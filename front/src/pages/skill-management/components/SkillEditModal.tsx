import { useMutation } from '@apollo/client';
import { Form, Input, InputNumber, message, Modal } from 'antd';
import { useEffect } from 'react';

import { SUBMIT_SKILL } from '@/apis/index';
import { getErrorMessage, isValidationError } from '@/utils/error';

import type { Skill } from '../types';

interface Props {
  open: boolean;
  initial: Skill | null;
  onClose: () => void;
  onSuccess: () => void;
}

const SkillEditModal: React.FC<Props> = ({ open, initial, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [submit, { loading }] = useMutation(SUBMIT_SKILL);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        name: initial?.name ?? '',
        level: initial?.level ?? null,
        description: initial?.description ?? '',
      });
    }
  }, [open, initial, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await submit({
        variables: {
          data: {
            id: initial?.id ?? null,
            name: values.name?.trim(),
            level: values.level ?? null,
            description: values.description || null,
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
      title={initial ? '编辑技能' : '新增技能'}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={loading}
      destroyOnClose
      maskClosable={false}
      width={520}
    >
      <Form form={form} layout="vertical" preserve={false}>
        <Form.Item
          label="技能名称"
          name="name"
          rules={[{ required: true, message: '请输入技能名称' }]}
        >
          <Input placeholder="请输入技能名称" maxLength={50} />
        </Form.Item>
        <Form.Item
          label="等级 (1-5)"
          name="level"
          rules={[{ type: 'number', min: 1, max: 5 }]}
        >
          <InputNumber min={1} max={5} placeholder="可选" style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="描述" name="description">
          <Input.TextArea rows={3} placeholder="可选" maxLength={200} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default SkillEditModal;
