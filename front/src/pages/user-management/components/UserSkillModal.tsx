import { useMutation, useQuery } from '@apollo/client';
import { Button, message, Modal, Popconfirm, Select, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useEffect, useMemo, useState } from 'react';

import {
  ATTACH_SKILL_TO_USER,
  DETACH_SKILL_FROM_USER,
  GET_ALL_SKILLS,
  GET_USER_DETAIL,
} from '@/apis/index';
import { getErrorMessage } from '@/utils/error';

import type { User, UserSkill } from '../types';

interface UserDetailQuery {
  getUserDetail: {
    id: number;
    skills: UserSkill[];
  } | null;
}

interface AllSkillsQuery {
  getAllSkills: { id: number; name: string }[];
}

interface Props {
  open: boolean;
  user: User | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const UserSkillModal: React.FC<Props> = ({ open, user, onClose, onSuccess }) => {
  const { data: detailData, refetch: refetchDetail } = useQuery<UserDetailQuery>(
    GET_USER_DETAIL,
    {
      variables: { id: user?.id ?? 0 },
      skip: !open || !user,
      fetchPolicy: 'network-only',
    },
  );
  const { data: allSkillsData } = useQuery<AllSkillsQuery>(GET_ALL_SKILLS, {
    skip: !open,
  });

  const userSkills: UserSkill[] = useMemo(
    () => detailData?.getUserDetail?.skills ?? [],
    [detailData],
  );
  const allSkills: { id: number; name: string }[] = allSkillsData?.getAllSkills ?? [];

  const [pickedSkillId, setPickedSkillId] = useState<number | null>(null);

  useEffect(() => {
    if (open) setPickedSkillId(null);
  }, [open, user?.id]);

  const ownedIds = useMemo(() => new Set(userSkills.map((s) => s.id)), [userSkills]);

  const [attach, { loading: attaching }] = useMutation(ATTACH_SKILL_TO_USER);
  const [detach] = useMutation(DETACH_SKILL_FROM_USER);

  const handleAttach = async (): Promise<void> => {
    if (!user || !pickedSkillId) return;
    try {
      await attach({
        variables: { data: { userId: user.id, skillId: pickedSkillId } },
      });
      message.success('已添加该技能');
      setPickedSkillId(null);
      refetchDetail();
      onSuccess?.();
    } catch (e) {
      message.error(getErrorMessage(e));
    }
  };

  const handleDetach = async (skillId: number): Promise<void> => {
    if (!user) return;
    try {
      await detach({ variables: { data: { userId: user.id, skillId } } });
      message.success('已移除该技能');
      refetchDetail();
      onSuccess?.();
    } catch (e) {
      message.error(getErrorMessage(e));
    }
  };

  const columns: ColumnsType<UserSkill> = [
    { title: '#', width: 50, align: 'center', render: (_, __, i) => i + 1 },
    {
      title: '技能',
      dataIndex: 'name',
      key: 'name',
      render: (v) => <Tag color="blue">{v}</Tag>,
    },
    {
      title: '操作',
      width: 100,
      align: 'center',
      render: (_, row) => (
        <Popconfirm
          title={`确定移除技能「${row.name}」？`}
          onConfirm={() => handleDetach(row.id)}
        >
          <Button type="link" size="small" danger>
            移除
          </Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <Modal
      title={`管理「${user?.realname ?? ''}」的技能`}
      open={open}
      onCancel={onClose}
      footer={null}
      width={640}
      destroyOnClose
    >
      <Space style={{ width: '100%', marginBottom: 16 }}>
        <Select
          allowClear
          showSearch
          style={{ width: 320 }}
          placeholder="选择要添加的技能"
          optionFilterProp="label"
          value={pickedSkillId ?? undefined}
          onChange={(v) => setPickedSkillId(v)}
          options={allSkills
            .filter((s) => !ownedIds.has(s.id))
            .map((s) => ({ value: s.id, label: s.name }))}
        />
        <Button
          type="primary"
          disabled={!pickedSkillId}
          loading={attaching}
          onClick={handleAttach}
        >
          添加
        </Button>
      </Space>
      <Table<UserSkill>
        rowKey="id"
        columns={columns}
        dataSource={userSkills}
        size="small"
        pagination={false}
      />
    </Modal>
  );
};

export default UserSkillModal;
