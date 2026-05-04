import { useMutation, useQuery } from '@apollo/client';
import { Button, message, Modal, Popconfirm, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useState } from 'react';

import { DETACH_SKILL_FROM_USER, GET_SKILL_USERS_PAGED } from '@/apis/index';
import { getErrorMessage } from '@/utils/error';

import type { Skill, SkillUser, SkillUsersResp } from '../types';

interface Props {
  open: boolean;
  skill: Skill | null;
  onClose: () => void;
}

const SkillUsersModal: React.FC<Props> = ({ open, skill, onClose }) => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [rows, setRows] = useState<SkillUser[]>([]);
  const [total, setTotal] = useState(0);

  const { loading, refetch } = useQuery<SkillUsersResp>(GET_SKILL_USERS_PAGED, {
    variables: {
      data: {
        skillId: skill?.id ?? 0,
        currentPage: page,
        pageNumber: pageSize,
      },
    },
    skip: !open || !skill,
    fetchPolicy: 'network-only',
    onCompleted(data) {
      setRows(data?.getSkillUsersPaged?.rows ?? []);
      setTotal(data?.getSkillUsersPaged?.total ?? 0);
    },
  });

  useEffect(() => {
    if (open) {
      setPage(1);
      setPageSize(10);
    }
  }, [open, skill?.id]);

  const [detach] = useMutation(DETACH_SKILL_FROM_USER);

  const handleRemove = async (userId: number): Promise<void> => {
    if (!skill) return;
    try {
      await detach({ variables: { data: { userId, skillId: skill.id } } });
      message.success('已解除该用户的此技能');
      refetch();
    } catch (e) {
      message.error(getErrorMessage(e));
    }
  };

  const columns: ColumnsType<SkillUser> = [
    {
      title: '序号',
      width: 70,
      align: 'center',
      render: (_, __, i) => (page - 1) * pageSize + i + 1,
    },
    { title: '用户名', dataIndex: 'username', key: 'username' },
    { title: '姓名', dataIndex: 'realname', key: 'realname' },
    { title: '电话', dataIndex: 'telephone', key: 'telephone', render: (v) => v || '—' },
    {
      title: '操作',
      key: 'action',
      width: 120,
      align: 'center',
      render: (_, row) => (
        <Popconfirm
          title={`将「${row.realname}」从该技能中移除？`}
          onConfirm={() => handleRemove(row.id)}
        >
          <Button danger size="small" type="link">
            解除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Modal
      title={`拥有技能「${skill?.name ?? ''}」的用户`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      destroyOnClose
    >
      <Table<SkillUser>
        rowKey="id"
        loading={loading}
        columns={columns}
        dataSource={rows}
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
    </Modal>
  );
};

export default SkillUsersModal;
