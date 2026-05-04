import { Cascader } from 'antd';
import type { DefaultOptionType } from 'antd/es/cascader';
import { useMemo } from 'react';

import regionData from '@/assets/region.json';

export type RegionValue = {
  province?: string | null;
  city?: string | null;
  district?: string | null;
};

interface Props {
  value?: RegionValue;
  onChange?: (val: RegionValue) => void;
  placeholder?: string;
  disabled?: boolean;
  size?: 'small' | 'middle' | 'large';
  style?: React.CSSProperties;
}

const RegionCascader: React.FC<Props> = ({
  value,
  onChange,
  placeholder = '请选择 省 / 市 / 区',
  disabled,
  size,
  style,
}) => {
  const cascaderValue = useMemo(() => {
    const arr: string[] = [];
    if (value?.province) arr.push(value.province);
    if (value?.city) arr.push(value.city);
    if (value?.district) arr.push(value.district);
    return arr;
  }, [value?.province, value?.city, value?.district]);

  const handleChange = (val: (string | number | null)[]) => {
    const [province, city, district] = (val as (string | null)[]) || [];
    onChange?.({
      province: province ?? null,
      city: city ?? null,
      district: district ?? null,
    });
  };

  return (
    <Cascader
      options={regionData as DefaultOptionType[]}
      value={cascaderValue}
      onChange={handleChange}
      placeholder={placeholder}
      disabled={disabled}
      size={size}
      style={{ width: '100%', ...(style || {}) }}
      changeOnSelect={false}
      allowClear
      showSearch={{
        filter: (inputValue, path) =>
          path.some((opt) =>
            (opt.label as string)?.toLowerCase().includes(inputValue.toLowerCase()),
          ),
      }}
    />
  );
};

export default RegionCascader;
