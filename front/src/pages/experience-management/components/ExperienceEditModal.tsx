import { useMutation, useQuery } from '@apollo/client';
import { DatePicker, Form, Input, message, Modal, Select } from 'antd';
import moment from 'moment';
import { useEffect, useMemo } from 'react';

import { GET_USERS_PAGED, SUBMIT_EXPERIENCE } from '@/apis/index';
import { getErrorMessage, isValidationError } from '@/utils/error';

import type { Experience } from '../types';

interface UserOption {
  id: number;
  username: string;
  realname: string;
}

interface Props {
  open: boolean;
  initial: Experience | null;
  defaultUserId?: number;
  onClose: () => void;
  onSuccess: () => void;
}

const ExperienceEditModal: React.FC<Props> = ({
  open,
  initial,
  defaultUserId,
  onClose,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [submit, { loading }] = useMutation(SUBMIT_EXPERIENCE);

  // 拉一页用户当下拉框（first 100）
  const { data: usersData } = useQuery(GET_USERS_PAGED, {
    variables: { data: { currentPage: 1, pageNumber: 100 } },
    skip: !open,
    fetchPolicy: 'cache-first',
  });
  const userOptions: UserOption[] = useMemo(
    () => (usersData?.getUsersPaged ?? []) as UserOption[],
    [usersData],
  );

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        userId: initial?.userId ?? defaultUserId ?? undefined,
        organization: initial?.organization ?? '',
        position: initial?.position ?? '',
        range: initial?.startDate || initial?.endDate
          ? [
              initial?.startDate ? moment(initial.startDate) : null,
              initial?.endDate ? moment(initial.endDate) : null,
            ]
          : null,
        description: initial?.description ?? '',
        remark: initial?.remark ?? '',
      });
    }
  }, [open, initial, defaultUserId, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const [startDate, endDate] = values.range || [];
      await submit({
        variables: {
          data: {
            id: initial?.id ?? null,
            userId: values.userId,
            organization: values.organization?.trim(),
            position: values.position || null,
            startDate: startDate ? startDate.toDate() : null,
            endDate: endDate ? endDate.toDate() : null,
            description: values.description || null,
            remark: values.remark || null,
          },
        },
      });
      message.success(initial ? '修改成功' : '新增成功');
      onSuccess();
      onClose();
    } catch (e) {
      if (isValidationError(e)) return;
      message.error(getErrorMessage(e));
    }
  };

  return (
    <Modal
      title={initial ? '编辑社会经历' : '新增社会经历'}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={loading}
      destroyOnClose
      maskClosable={false}
      width={600}
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          label="所属用户"
          name="userId"
          rules={[{ required: true, message: '请选择用户' }]}
        >
          <Select
            placeholder="请选择用户"
            showSearch
            optionFilterProp="label"
            options={userOptions.map((u) => ({
              value: u.id,
              label: `${u.realname} (${u.username})`,
            }))}
            disabled={!!defaultUserId && !initial}
          />
        </Form.Item>
        <Form.Item
          label="组织 / 单位"
          name="organization"
          rules={[{ required: true, message: '请输入组织名称' }]}
        >
          <Input placeholder="请输入组织 / 单位" maxLength={100} />
        </Form.Item>
        <Form.Item label="职务" name="position">
          <Input placeholder="可选" maxLength={50} />
        </Form.Item>
        <Form.Item label="起止日期" name="range">
          <DatePicker.RangePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="经历描述" name="description">
          <Input.TextArea rows={3} maxLength={500} />
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input.TextArea rows={2} maxLength={200} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ExperienceEditModal;
