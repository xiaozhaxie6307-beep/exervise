import { useMutation, useQuery } from '@apollo/client';
import {
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Select,
  Switch,
} from 'antd';
import { useEffect } from 'react';

import {
  CREATE_USER,
  GET_ALL_UNITS,
  UPDATE_USER_BY_ID,
} from '@/apis/index';
import RegionCascader from '@/components/RegionCascader';
import { getErrorMessage, isValidationError } from '@/utils/error';

import type { User } from '../types';

interface UnitOption {
  id: number;
  name: string;
}

interface Props {
  open: boolean;
  initial: User | null;
  onClose: () => void;
  onSuccess: () => void;
}

const ROLE_OPTIONS = [
  { value: 'ADMIN', label: '超级管理员' },
  { value: 'DIRECTIOR', label: '主任医师' },
  { value: 'DOCTOR', label: '普通医生' },
  { value: 'USER', label: '普通用户' },
];

const GENDER_OPTIONS = [
  { value: 1, label: '男' },
  { value: 2, label: '女' },
];

const UserEditModal: React.FC<Props> = ({ open, initial, onClose, onSuccess }) => {
  const [form] = Form.useForm();

  const { data: unitsData } = useQuery<{ getAllUnits: UnitOption[] }>(
    GET_ALL_UNITS,
    { skip: !open },
  );
  const unitOptions = (unitsData?.getAllUnits ?? []).map((u) => ({
    value: u.id,
    label: u.name,
  }));

  const [createUser, { loading: creating }] = useMutation(CREATE_USER);
  const [updateUser, { loading: updating }] = useMutation(UPDATE_USER_BY_ID);

  useEffect(() => {
    if (open) {
      form.setFieldsValue({
        username: initial?.username ?? '',
        password: '',
        realname: initial?.realname ?? '',
        role: initial?.role ?? 'USER',
        unitId: initial?.unitId ?? null,
        gender: initial?.gender ?? null,
        age: initial?.age ?? null,
        telephone: initial?.telephone ?? '',
        email: initial?.email ?? '',
        isEnable: initial?.isEnable ?? true,
        isAdmin: initial?.isAdmin ?? false,
        region: {
          province: initial?.province ?? null,
          city: initial?.city ?? null,
          district: initial?.district ?? null,
        },
        addressDetail: initial?.addressDetail ?? '',
        remark: initial?.remark ?? '',
      });
    }
  }, [open, initial, form]);

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      const region = values.region || {};
      const payloadCommon = {
        realname: values.realname?.trim(),
        unitId: values.unitId ?? null,
        gender: values.gender ?? null,
        age: values.age ?? null,
        telephone: values.telephone || null,
        email: values.email || null,
        isEnable: values.isEnable,
        isAdmin: values.isAdmin,
        province: region.province ?? null,
        city: region.city ?? null,
        district: region.district ?? null,
        addressDetail: values.addressDetail || null,
        remark: values.remark || null,
        role: values.role,
      };

      if (initial) {
        await updateUser({
          variables: { id: initial.id, data: payloadCommon },
        });
        message.success('修改成功');
      } else {
        if (!values.password) {
          form.setFields([{ name: 'password', errors: ['请输入密码'] }]);
          return;
        }
        await createUser({
          variables: {
            data: {
              ...payloadCommon,
              username: values.username?.trim(),
              password: values.password,
            },
          },
        });
        message.success('新增成功');
      }
      onSuccess();
      onClose();
    } catch (e) {
      if (isValidationError(e)) return;
      message.error(getErrorMessage(e));
    }
  };

  return (
    <Modal
      title={initial ? `编辑用户「${initial.realname}」` : '新增用户'}
      open={open}
      onOk={handleOk}
      onCancel={onClose}
      confirmLoading={creating || updating}
      destroyOnClose
      maskClosable={false}
      width={720}
    >
      <Form form={form} layout="vertical" preserve={false}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <Form.Item
            label="用户名"
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input disabled={!!initial} placeholder="登录用户名" maxLength={50} />
          </Form.Item>
          {!initial && (
            <Form.Item
              label="密码"
              name="password"
              rules={[{ required: true, message: '请输入密码' }, { min: 6, message: '至少 6 位' }]}
            >
              <Input.Password placeholder="请输入密码" />
            </Form.Item>
          )}
          <Form.Item
            label="姓名"
            name="realname"
            rules={[{ required: true, message: '请输入姓名' }]}
          >
            <Input placeholder="姓名" maxLength={50} />
          </Form.Item>
          <Form.Item label="角色" name="role">
            <Select options={ROLE_OPTIONS} />
          </Form.Item>
          <Form.Item label="所属单位" name="unitId">
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="请选择单位"
              options={unitOptions}
            />
          </Form.Item>
          <Form.Item label="性别" name="gender">
            <Select allowClear options={GENDER_OPTIONS} placeholder="请选择" />
          </Form.Item>
          <Form.Item label="年龄" name="age">
            <InputNumber min={0} max={150} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="电话" name="telephone">
            <Input placeholder="11 位手机号" maxLength={20} />
          </Form.Item>
          <Form.Item label="邮箱" name="email" rules={[{ type: 'email', message: '邮箱格式不正确' }]}>
            <Input placeholder="邮箱" maxLength={100} />
          </Form.Item>
        </div>

        <Form.Item label="省 / 市 / 区" name="region">
          <RegionCascader />
        </Form.Item>
        <Form.Item label="详细地址" name="addressDetail">
          <Input placeholder="街道、门牌号等" maxLength={200} />
        </Form.Item>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 16px' }}>
          <Form.Item label="启用" name="isEnable" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="管理员" name="isAdmin" valuePropName="checked">
            <Switch />
          </Form.Item>
        </div>

        <Form.Item label="备注" name="remark">
          <Input.TextArea rows={2} maxLength={200} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserEditModal;
