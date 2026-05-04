import { useMutation } from '@apollo/client';
import { Form, Input, message, Modal, Switch } from 'antd';
import { useEffect } from 'react';

import { SUBMIT_UNIT } from '@/apis/index';
import { getErrorMessage, isValidationError } from '@/utils/error';

import type { Unit } from '../types';

interface Props {
  open: boolean;
  initial: Unit | null;
  onClose: () => void;
  onSuccess: () => void;
}

const UnitEditModal: React.FC<Props> = ({ open, initial, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [submitUnit, { loading }] = useMutation(SUBMIT_UNIT);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        name: initial?.name ?? '',
        code: initial?.code ?? '',
        isEnable: initial?.isEnable ?? true,
        remark: initial?.remark ?? '',
      });
    }
  }, [open, initial, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      await submitUnit({
        variables: {
          data: {
            id: initial?.id ?? null,
            name: values.name?.trim(),
            code: values.code || null,
            isEnable: values.isEnable ?? true,
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
      title={initial ? '编辑单位' : '新增单位'}
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
          label="单位名称"
          name="name"
          rules={[{ required: true, message: '请输入单位名称' }]}
        >
          <Input placeholder="请输入单位名称" maxLength={50} />
        </Form.Item>
        <Form.Item label="单位代码" name="code">
          <Input placeholder="可选" maxLength={50} />
        </Form.Item>
        <Form.Item label="是否启用" name="isEnable" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item label="备注" name="remark">
          <Input.TextArea rows={3} placeholder="可选" maxLength={200} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UnitEditModal;
