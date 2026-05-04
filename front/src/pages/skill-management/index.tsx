import { useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Form,
  Input,
  message,
  Popconfirm,
  Space,
  Table,
  Tag,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useState } from 'react';

import { DELETE_SKILL, GET_SKILLS_PAGED } from '@/apis/index';
import { getErrorMessage } from '@/utils/error';

import SkillEditModal from './components/SkillEditModal';
import SkillUsersModal from './components/SkillUsersModal';
import type { Skill, SkillsPagedResp } from './types';

interface SkillSearchValues {
  name?: string;
}

const SkillManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<{ name?: string }>({});

  const [skills, setSkills] = useState<Skill[]>([]);
  const [total, setTotal] = useState(0);

  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Skill | null>(null);

  const [usersModalOpen, setUsersModalOpen] = useState(false);
  const [usersModalSkill, setUsersModalSkill] = useState<Skill | null>(null);

  const { loading, refetch } = useQuery<SkillsPagedResp>(GET_SKILLS_PAGED, {
    variables: {
      data: { currentPage: page, pageNumber: pageSize, ...filters },
    },
    fetchPolicy: 'network-only',
    onCompleted(data) {
      setSkills(data?.getSkillsPaged ?? []);
      setTotal(data?.getSkillsTotal ?? 0);
    },
  });

  const [deleteSkill] = useMutation(DELETE_SKILL);
  const handleDelete = async (id: number): Promise<void> => {
    try {
      await deleteSkill({ variables: { id } });
      message.success('删除成功');
      refetch();
    } catch (e) {
      message.error(getErrorMessage(e, '删除失败'));
    }
  };

  const handleSearch = (vals: SkillSearchValues): void => {
    setPage(1);
    setFilters({ name: vals.name?.trim() });
  };

  const columns: ColumnsType<Skill> = [
    {
      title: '序号',
      width: 70,
      align: 'center',
      render: (_, __, i) => (page - 1) * pageSize + i + 1,
    },
    { title: '技能名称', dataIndex: 'name', key: 'name' },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 100,
      render: (v: number | null) =>
        v ? <Tag color="blue">L{v}</Tag> : '—',
    },
    { title: '描述', dataIndex: 'description', key: 'description', render: (v) => v || '—' },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 170,
      render: (v) => (v ? moment(v).format('YYYY-MM-DD HH:mm') : '—'),
    },
    {
      title: '操作',
      key: 'action',
      width: 230,
      align: 'center',
      render: (_, row) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setUsersModalSkill(row);
              setUsersModalOpen(true);
            }}
          >
            查看用户
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setEditTarget(row);
              setEditOpen(true);
            }}
          >
            编辑
          </Button>
          <Popconfirm
            title={`确定删除技能「${row.name}」？`}
            onConfirm={() => handleDelete(row.id)}
          >
            <Button type="link" size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 12,
          marginBottom: 16,
        }}
      >
        <Form layout="inline" onFinish={handleSearch}>
          <Form.Item label="技能名称" name="name">
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Button type="primary" htmlType="submit">查询</Button>
        </Form>
        <Button
          type="primary"
          onClick={() => {
            setEditTarget(null);
            setEditOpen(true);
          }}
        >
          新增技能
        </Button>
      </div>
      <Table<Skill>
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={skills}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: true,
          showTotal: (t) => `共 ${t} 条`,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
          },
        }}
      />
      <SkillEditModal
        open={editOpen}
        initial={editTarget}
        onClose={() => setEditOpen(false)}
        onSuccess={() => refetch()}
      />
      <SkillUsersModal
        open={usersModalOpen}
        skill={usersModalSkill}
        onClose={() => setUsersModalOpen(false)}
      />
    </div>
  );
};

export default SkillManagement;
