import { useMutation, useQuery } from '@apollo/client';
import {
  Button,
  Form,
  Input,
  message,
  Popconfirm,
  Space,
  Table,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import moment from 'moment';
import { useState } from 'react';

import { DELETE_EXPERIENCE, GET_EXPERIENCES_PAGED } from '@/apis/index';
import { getErrorMessage } from '@/utils/error';

import ExperienceEditModal from './components/ExperienceEditModal';
import type { Experience, ExperiencesPagedResp } from './types';

interface ExperienceSearchValues {
  organization?: string;
}

const ExperienceManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<{ organization?: string }>({});

  const [list, setList] = useState<Experience[]>([]);
  const [total, setTotal] = useState(0);

  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Experience | null>(null);

  const { loading, refetch } = useQuery<ExperiencesPagedResp>(
    GET_EXPERIENCES_PAGED,
    {
      variables: {
        data: { currentPage: page, pageNumber: pageSize, ...filters },
      },
      fetchPolicy: 'network-only',
      onCompleted(data) {
        setList(data?.getExperiencesPaged ?? []);
        setTotal(data?.getExperiencesTotal ?? 0);
      },
    },
  );

  const [del] = useMutation(DELETE_EXPERIENCE);

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await del({ variables: { id } });
      message.success('删除成功');
      refetch();
    } catch (e) {
      message.error(getErrorMessage(e, '删除失败'));
    }
  };

  const handleSearch = (vals: ExperienceSearchValues): void => {
    setPage(1);
    setFilters({ organization: vals.organization?.trim() });
  };

  const columns: ColumnsType<Experience> = [
    {
      title: '序号',
      width: 70,
      align: 'center',
      render: (_, __, i) => (page - 1) * pageSize + i + 1,
    },
    {
      title: '用户名称',
      key: 'user',
      render: (_, row) =>
        row.user ? `${row.user.realname} (${row.user.username})` : `用户 #${row.userId}`,
    },
    { title: '组织 / 单位', dataIndex: 'organization', key: 'organization' },
    { title: '职务', dataIndex: 'position', key: 'position', render: (v) => v || '—' },
    {
      title: '起止时间',
      key: 'range',
      width: 230,
      render: (_, row) => {
        const s = row.startDate ? moment(row.startDate).format('YYYY-MM-DD') : '—';
        const e = row.endDate ? moment(row.endDate).format('YYYY-MM-DD') : '至今';
        return `${s} ~ ${e}`;
      },
    },
    { title: '经历描述', dataIndex: 'description', key: 'description', render: (v) => v || '—' },
    {
      title: '操作',
      key: 'action',
      width: 160,
      align: 'center',
      render: (_, row) => (
        <Space>
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
            title="确定删除该经历？"
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
          <Form.Item label="组织" name="organization">
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
          新增经历
        </Button>
      </div>
      <Table<Experience>
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={list}
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
      <ExperienceEditModal
        open={editOpen}
        initial={editTarget}
        onClose={() => setEditOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default ExperienceManagement;
