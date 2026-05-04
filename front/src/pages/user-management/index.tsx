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

import { DELETE_USER, GET_USERS_PAGED } from '@/apis/index';
import { getErrorMessage } from '@/utils/error';

import UserEditModal from './components/UserEditModal';
import UserSkillModal from './components/UserSkillModal';
import type { User, UsersPagedResp } from './types';

interface UserSearchValues {
  username?: string;
  realname?: string;
}

const ROLE_LABEL: Record<string, string> = {
  ADMIN: '超级管理员',
  DIRECTIOR: '主任医师',
  DOCTOR: '普通医生',
  USER: '普通用户',
};

const UserManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<{ username?: string; realname?: string }>({});

  const [list, setList] = useState<User[]>([]);
  const [total, setTotal] = useState(0);

  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<User | null>(null);

  const [skillOpen, setSkillOpen] = useState(false);
  const [skillTarget, setSkillTarget] = useState<User | null>(null);

  const { loading, refetch } = useQuery<UsersPagedResp>(GET_USERS_PAGED, {
    variables: {
      data: { currentPage: page, pageNumber: pageSize, ...filters },
    },
    fetchPolicy: 'network-only',
    onCompleted(data) {
      setList(data?.getUsersPaged ?? []);
      setTotal(data?.getUsersTotal ?? 0);
    },
  });

  const [del] = useMutation(DELETE_USER);
  const handleDelete = async (id: number): Promise<void> => {
    try {
      await del({ variables: { id } });
      message.success('删除成功');
      refetch();
    } catch (e) {
      message.error(getErrorMessage(e, '删除失败'));
    }
  };

  const handleSearch = (vals: UserSearchValues): void => {
    setPage(1);
    setFilters({
      username: vals.username?.trim(),
      realname: vals.realname?.trim(),
    });
  };

  const columns: ColumnsType<User> = [
    {
      title: '序号',
      width: 70,
      align: 'center',
      render: (_, __, i) => (page - 1) * pageSize + i + 1,
    },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '姓名', dataIndex: 'realname', key: 'realname' },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
      width: 110,
      render: (r: string) => <Tag color="geekblue">{ROLE_LABEL[r] ?? r}</Tag>,
    },
    {
      title: '所属单位',
      key: 'unit',
      width: 140,
      render: (_, row) => (row.unit?.name ? <Tag color="cyan">{row.unit.name}</Tag> : '—'),
    },
    {
      title: '技能',
      key: 'skills',
      render: (_, row) =>
        row.skills && row.skills.length > 0 ? (
          <Space wrap size={4}>
            {row.skills.map((s) => (
              <Tag key={s.id} color="blue">
                {s.name}
              </Tag>
            ))}
          </Space>
        ) : (
          '—'
        ),
    },
    {
      title: '地址',
      key: 'address',
      render: (_, row) => {
        const parts = [row.province, row.city, row.district].filter(Boolean);
        const head = parts.join(' / ');
        const detail = row.addressDetail || '';
        if (!head && !detail) return '—';
        return `${head}${head && detail ? ' · ' : ''}${detail}`;
      },
    },
    { title: '电话', dataIndex: 'telephone', key: 'telephone', width: 130, render: (v) => v || '—' },
    {
      title: '启用',
      dataIndex: 'isEnable',
      key: 'isEnable',
      width: 80,
      render: (v: boolean | null) => <Tag color={v ? 'green' : 'default'}>{v ? '是' : '否'}</Tag>,
    },
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
      width: 220,
      align: 'center',
      fixed: 'right',
      render: (_, row) => (
        <Space>
          <Button
            type="link"
            size="small"
            onClick={() => {
              setSkillTarget(row);
              setSkillOpen(true);
            }}
          >
            管理技能
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
            title={`确定删除用户「${row.realname}」？`}
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
          <Form.Item label="用户名" name="username">
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item label="姓名" name="realname">
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
          新增用户
        </Button>
      </div>
      <Table<User>
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={list}
        scroll={{ x: 1400 }}
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
      <UserEditModal
        open={editOpen}
        initial={editTarget}
        onClose={() => setEditOpen(false)}
        onSuccess={() => refetch()}
      />
      <UserSkillModal
        open={skillOpen}
        user={skillTarget}
        onClose={() => setSkillOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default UserManagement;
