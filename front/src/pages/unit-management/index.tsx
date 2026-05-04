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

import { DELETE_UNIT, GET_UNITS_PAGED } from '@/apis/index';
import { getErrorMessage } from '@/utils/error';

import UnitEditModal from './components/UnitEditModal';
import type { Unit, UnitsPagedResp } from './types';

interface UnitSearchValues {
  name?: string;
  code?: string;
}

const UnitManagement: React.FC = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<{ name?: string; code?: string }>({});

  const [units, setUnits] = useState<Unit[]>([]);
  const [total, setTotal] = useState(0);

  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Unit | null>(null);

  const { loading, refetch } = useQuery<UnitsPagedResp>(GET_UNITS_PAGED, {
    variables: {
      data: { currentPage: page, pageNumber: pageSize, ...filters },
    },
    fetchPolicy: 'network-only',
    onCompleted(data) {
      setUnits(data?.getUnitsPaged ?? []);
      setTotal(data?.getUnitsTotal ?? 0);
    },
  });

  const [deleteUnit] = useMutation(DELETE_UNIT);

  const handleDelete = async (id: number): Promise<void> => {
    try {
      await deleteUnit({ variables: { id } });
      message.success('删除成功');
      refetch();
    } catch (e) {
      message.error(getErrorMessage(e, '删除失败'));
    }
  };

  const handleSearch = (vals: UnitSearchValues): void => {
    setPage(1);
    setFilters({ name: vals.name?.trim(), code: vals.code?.trim() });
  };

  const columns: ColumnsType<Unit> = [
    {
      title: '序号',
      width: 70,
      align: 'center',
      render: (_, __, i) => (page - 1) * pageSize + i + 1,
    },
    { title: '单位名称', dataIndex: 'name', key: 'name' },
    { title: '单位代码', dataIndex: 'code', key: 'code', render: (v) => v || '—' },
    {
      title: '是否启用',
      dataIndex: 'isEnable',
      key: 'isEnable',
      width: 100,
      render: (v: boolean | null) => (
        <Tag color={v ? 'green' : 'default'}>{v ? '启用' : '禁用'}</Tag>
      ),
    },
    { title: '备注', dataIndex: 'remark', key: 'remark', render: (v) => v || '—' },
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
            title={`确定删除单位「${row.name}」？`}
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
          <Form.Item label="单位名称" name="name">
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Form.Item label="单位代码" name="code">
            <Input placeholder="请输入" allowClear />
          </Form.Item>
          <Space>
            <Button htmlType="submit" type="primary">
              查询
            </Button>
          </Space>
        </Form>
        <Button
          type="primary"
          onClick={() => {
            setEditTarget(null);
            setEditOpen(true);
          }}
        >
          新增单位
        </Button>
      </div>
      <Table<Unit>
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={units}
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
      <UnitEditModal
        open={editOpen}
        initial={editTarget}
        onClose={() => setEditOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default UnitManagement;
