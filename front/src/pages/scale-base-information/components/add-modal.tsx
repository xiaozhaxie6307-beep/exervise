import '../scale-base-information.scss';

import type { ApolloQueryResult } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client';
import AddPhotoIcon
  from '@mui/icons-material/AddPhotoAlternateOutlined';
import CloseIcon from '@mui/icons-material/Close';
import DeleteIcon
  from '@mui/icons-material/DeleteOutline';
import type { SelectChangeEvent } from '@mui/material';
import {
  Box,
  Divider,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import type { ChangeEvent } from 'react';
import { useEffect, useState } from 'react';

import {
  GET_SCALE_DETAIL,
  SUBMIT_BASE_INFORMATION,
} from '@/apis';

import type {
  QueryData,
  Scale,
  ScaleType,
  TableData,
} from '../type';
import {
  StyledaAffirmButton,
  StyledBox,
  StyledCancelButton,
} from './style';

type PropsConfig = {
  open: boolean;
  onClose: () => void;
  scaleTypes: ScaleType[];
  modifyId: React.MutableRefObject<number>;
  getBaseInformationTableData: (
    variables?: Partial<QueryData> | undefined,
  ) => Promise<ApolloQueryResult<TableData>>;
  pageNumber: React.MutableRefObject<number>;
  setPage: React.Dispatch<
    React.SetStateAction<number>
  >;
};

const whether = ['否', '是'];
const numberNames = [
  'sd', 'baselineScore', 'scaleTimeLimit',
  'startAge', 'endAge', 'warnGender', 'average',
];

const selectItem = (name: string, index: number) => (
  <MenuItem
    value={index}
    key={`${name}-${index}`}
    sx={{ fontSize: 13.5 }}
  >
    {name}
  </MenuItem>
);

type FieldLabelProps = { children: React.ReactNode };
const FieldLabel = ({ children }: FieldLabelProps) => (
  <Typography
    sx={{
      fontSize: 13,
      color: '#5a6a7a',
      mb: 0.75,
      display: 'block',
    }}
  >
    {children}
  </Typography>
);

const inputSx = { style: { fontSize: 13.5 } };

const BoolSelect = ({
  name,
  value,
  placeholder,
  onChange,
}: {
  name: string;
  value: boolean | null | undefined;
  placeholder: string;
  onChange: (e: SelectChangeEvent<unknown>) => void;
}) => {
  const hasValue =
    value !== null && value !== undefined;
  return (
    <Select
      displayEmpty
      required
      name={name}
      size="small"
      fullWidth
      value={hasValue ? String(value ? 1 : 0) : ''}
      onChange={onChange}
      sx={{ fontSize: 13.5 }}
      renderValue={(selected) => {
        if (hasValue) return whether[Number(value)];
        if (
          !selected ||
          (selected as string).length === 0
        )
          return (
            <span style={{ color: 'rgba(0,0,0,0.35)' }}>
              {placeholder}
            </span>
          );
        return whether[Number(selected)];
      }}
    >
      <MenuItem value="" sx={{ fontSize: 13.5 }}>
        {placeholder}
      </MenuItem>
      {whether.map(selectItem)}
    </Select>
  );
};

const getGenderLabel = (val: number) => {
  if (val === 1) return '男';
  if (val === 2) return '性别不限';
  return '女';
};

const AddModal = ({
  open,
  onClose,
  scaleTypes,
  modifyId,
  getBaseInformationTableData,
  pageNumber,
  setPage,
}: PropsConfig) => {
  const [scale, setScale] = useState<Scale>();
  const [submit] = useMutation(
    SUBMIT_BASE_INFORMATION,
  );

  const { data, refetch } = useQuery(
    GET_SCALE_DETAIL,
    {
      variables: { data: Number(modifyId.current) },
      onCompleted: (d) =>
        setScale({ ...d.getScaleDetail }),
    },
  );

  useEffect(() => {
    if (open) {
      refetch({ data: Number(modifyId.current) });
      if (data) {
        setScale({ ...data.getScaleDetail });
      }
    }
  }, [data, open, refetch, modifyId]);

  const updateField = (name: string, val: unknown) =>
    setScale((pre) => ({ ...pre, [name]: val }));

  const handleClose = () => {
    setScale(undefined);
    onClose();
    modifyId.current = 0;
  };

  const handleSelectChange = (
    e: SelectChangeEvent<unknown>,
  ) => {
    const { name, value } = e.target;
    let newValue;
    if (
      name === 'scaleTypeId' ||
      name === 'warnGender'
    ) {
      newValue =
        String(value).length === 0
          ? null
          : Number(value);
    } else {
      newValue =
        String(value).length === 0
          ? null
          : Boolean(Number(value));
    }
    updateField(name, newValue);
  };

  const handleTextChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { name, value } = e.target;
    updateField(
      name,
      numberNames.includes(name)
        ? Number(value)
        : value,
    );
  };

  const handleImgClick = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.addEventListener(
      'change',
      handleFileInputChange as unknown as EventListener,
    );
    input.click();
  };

  const handleFileInputChange = (
    e: ChangeEvent<HTMLInputElement>,
  ) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () =>
      setScale((pre) => ({
        ...pre,
        scaleContentImg: reader.result as string,
      }));
    reader.readAsDataURL(file);
  };

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();
    submit({
      variables: {
        data: {
          ...scale,
          id: Number(modifyId.current),
        },
      },
      onCompleted: () => {
        handleClose();
        setPage(1);
        getBaseInformationTableData({
          data: {
            currentPage: 1,
            pageNumber: pageNumber.current,
          },
        });
      },
    });
  };

  const handleDeleteImg = (
    e: React.MouseEvent,
  ) => {
    e.stopPropagation();
    setScale((p) => ({
      ...p,
      scaleContentImg: null,
    }));
  };

  const isEdit = modifyId.current > 0;

  const genderValue =
    scale?.warnGender !== null &&
    scale?.warnGender !== undefined
      ? String(scale.warnGender)
      : '';

  // --- render ---

  return (
    <Modal open={open} onClose={handleClose}>
      <StyledBox>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3,
            py: 2.5,
          }}
        >
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 600,
              color: '#1a2332',
            }}
          >
            {isEdit ? '编辑量表' : '新增量表'}
          </Typography>
          <IconButton
            onClick={handleClose}
            size="small"
            sx={{
              color: '#9aabb5',
              '&:hover': { color: '#5a6a7a' },
            }}
          >
            <CloseIcon sx={{ fontSize: 18 }} />
          </IconButton>
        </Box>

        <Divider sx={{ borderColor: '#edf0f3' }} />

        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ px: 3, py: 2.5 }}
        >
          <Grid container spacing={2.5}>
            {/* 量表类型 */}
            <Grid item xs={6}>
              <FormControl fullWidth required>
                <FieldLabel>量表类型 *</FieldLabel>
                <Select
                  displayEmpty
                  required
                  name="scaleTypeId"
                  size="small"
                  fullWidth
                  value={
                    scale?.scaleTypeId
                      ? String(scale.scaleTypeId)
                      : ''
                  }
                  onChange={handleSelectChange}
                  sx={{ fontSize: 13.5 }}
                  renderValue={(selected) => {
                    if (scale?.scaleTypeId) {
                      return scaleTypes.find(
                        (el) =>
                          Number(el.id) ===
                          Number(scale.scaleTypeId),
                      )?.name;
                    }
                    const s = selected as string;
                    if (!s || s.length === 0) {
                      return (
                        <span
                          style={{
                            color: 'rgba(0,0,0,0.35)',
                          }}
                        >
                          请选择量表类型
                        </span>
                      );
                    }
                    return scaleTypes.find(
                      (el) =>
                        Number(el.id) ===
                        Number(selected),
                    )?.name;
                  }}
                >
                  <MenuItem
                    value=""
                    sx={{ fontSize: 13.5 }}
                  >
                    请选择量表类型
                  </MenuItem>
                  {scaleTypes.map((el) => (
                    <MenuItem
                      value={el.id}
                      key={`${el.name}-${el.id}`}
                      sx={{ fontSize: 13.5 }}
                    >
                      {el.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* 量表名称 */}
            <Grid item xs={6}>
              <FieldLabel>量表名称 *</FieldLabel>
              <TextField
                fullWidth
                size="small"
                required
                placeholder="请输入量表名称"
                name="name"
                value={scale?.name ?? ''}
                onChange={handleTextChange}
                inputProps={inputSx}
              />
            </Grid>

            {/* 是否有因子 */}
            <Grid item xs={6}>
              <FieldLabel>是否有因子 *</FieldLabel>
              <BoolSelect
                name="isFactor"
                value={scale?.isFactor}
                placeholder="请选择"
                onChange={handleSelectChange}
              />
            </Grid>

            {/* 是否跳题 */}
            <Grid item xs={6}>
              <FieldLabel>是否跳题 *</FieldLabel>
              <BoolSelect
                name="isSkip"
                value={scale?.isSkip}
                placeholder="请选择"
                onChange={handleSelectChange}
              />
            </Grid>

            {/* 是否启用 */}
            <Grid item xs={6}>
              <FieldLabel>是否启用 *</FieldLabel>
              <BoolSelect
                name="isEnable"
                value={scale?.isEnable}
                placeholder="请选择"
                onChange={handleSelectChange}
              />
            </Grid>

            {/* 量表编号 */}
            <Grid item xs={6}>
              <FieldLabel>量表编号</FieldLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="自动生成"
                name="id"
                disabled
                value={modifyId.current || ''}
                inputProps={inputSx}
              />
            </Grid>

            {/* 计算公式 */}
            <Grid item xs={12}>
              <FieldLabel>
                量表计算公式（粗分）
              </FieldLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="请输入量表计算公式（粗分）"
                name="calformula"
                value={scale?.calformula ?? ''}
                onChange={handleTextChange}
                inputProps={inputSx}
              />
            </Grid>

            {/* 转换公式 key */}
            <Grid item xs={12}>
              <FieldLabel>量表转换公式 key</FieldLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="请输入量表转换公式 key"
                name="tranformulakey"
                value={scale?.tranformulakey ?? ''}
                onChange={handleTextChange}
                inputProps={inputSx}
              />
            </Grid>

            {/* 转换公式 */}
            <Grid item xs={12}>
              <FieldLabel>量表转换公式</FieldLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="请输入量表转换公式"
                name="tranformula"
                value={scale?.tranformula ?? ''}
                onChange={handleTextChange}
                inputProps={inputSx}
              />
            </Grid>

            {/* 平均数 */}
            <Grid item xs={6}>
              <FieldLabel>平均数 X</FieldLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="请输入平均数 X"
                name="average"
                type="number"
                inputProps={{
                  step: 0.01,
                  style: { fontSize: 13.5 },
                }}
                value={scale?.average ?? ''}
                onChange={handleTextChange}
              />
            </Grid>

            {/* 标准差 */}
            <Grid item xs={6}>
              <FieldLabel>标准差 SD</FieldLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="请输入标准差 SD"
                name="sd"
                type="number"
                inputProps={{
                  step: 0.01,
                  style: { fontSize: 13.5 },
                }}
                value={scale?.sd ?? ''}
                onChange={handleTextChange}
              />
            </Grid>

            {/* 结果解释方式 */}
            <Grid item xs={6}>
              <FieldLabel>结果解释方式</FieldLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="请输入结果解释方式"
                name="scaleInterpretationResult"
                value={
                  scale?.scaleInterpretationResult ?? ''
                }
                onChange={handleTextChange}
                inputProps={inputSx}
              />
            </Grid>

            {/* 基线分数 */}
            <Grid item xs={6}>
              <FieldLabel>基线分数</FieldLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="请输入基线分数"
                name="baselineScore"
                type="number"
                inputProps={{
                  step: 0.01,
                  style: { fontSize: 13.5 },
                }}
                value={scale?.baselineScore ?? ''}
                onChange={handleTextChange}
              />
            </Grid>

            {/* 标准分取值方式 */}
            <Grid item xs={6}>
              <FieldLabel>标准分取值方式</FieldLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="请输入标准分取值方式"
                name="standardSourceMethod"
                value={
                  scale?.standardSourceMethod ?? ''
                }
                onChange={handleTextChange}
                inputProps={inputSx}
              />
            </Grid>

            {/* 原始分取值方式 */}
            <Grid item xs={6}>
              <FieldLabel>原始分取值方式</FieldLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="请输入原始分取值方式"
                name="rawSourceMethod"
                value={scale?.rawSourceMethod ?? ''}
                onChange={handleTextChange}
                inputProps={inputSx}
              />
            </Grid>

            {/* 平均分取值方式 */}
            <Grid item xs={6}>
              <FieldLabel>平均分取值方式</FieldLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="请输入平均分取值方式"
                name="averageSourceMethod"
                value={
                  scale?.averageSourceMethod ?? ''
                }
                onChange={handleTextChange}
                inputProps={inputSx}
              />
            </Grid>

            {/* 量表限时 */}
            <Grid item xs={6}>
              <FieldLabel>量表限时（分钟）</FieldLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="请输入量表限时"
                name="scaleTimeLimit"
                type="number"
                inputProps={{
                  min: 0,
                  step: 1,
                  style: { fontSize: 13.5 },
                }}
                value={scale?.scaleTimeLimit ?? ''}
                onChange={handleTextChange}
              />
            </Grid>

            {/* 量表介绍 */}
            <Grid item xs={12}>
              <FieldLabel>量表介绍</FieldLabel>
              <TextField
                fullWidth
                size="small"
                multiline
                rows={3}
                placeholder="请输入量表介绍"
                name="introduction"
                value={scale?.introduction ?? ''}
                onChange={handleTextChange}
                inputProps={inputSx}
              />
            </Grid>

            {/* 指导语 */}
            <Grid item xs={12}>
              <FieldLabel>指导语</FieldLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="请输入指导语"
                name="instructions"
                value={scale?.instructions ?? ''}
                onChange={handleTextChange}
                inputProps={inputSx}
              />
            </Grid>

            {/* 封面 URL */}
            <Grid item xs={12}>
              <FieldLabel>封面 URL</FieldLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="请输入封面 URL"
                name="scaleCoverUrl"
                value={scale?.scaleCoverUrl ?? ''}
                onChange={handleTextChange}
                inputProps={inputSx}
              />
            </Grid>

            {/* 是否团体 */}
            <Grid item xs={6}>
              <FieldLabel>是否团体 *</FieldLabel>
              <BoolSelect
                name="isTeam"
                value={scale?.isTeam}
                placeholder="请选择"
                onChange={handleSelectChange}
              />
            </Grid>

            {/* 内容图片 */}
            <Grid item xs={6}>
              <FieldLabel>内容图片</FieldLabel>
              <Box
                onClick={handleImgClick}
                sx={{
                  width: '100%',
                  height: 80,
                  borderRadius: 1.5,
                  cursor: 'pointer',
                  border: '1.5px dashed #dde3e8',
                  overflow: 'hidden',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: '#fafbfc',
                  '&:hover': {
                    borderColor: '#1a6b6f',
                    background:
                      'rgba(26,107,111,0.03)',
                  },
                }}
              >
                {scale?.scaleContentImg ? (
                  <>
                    <img
                      src={scale.scaleContentImg}
                      alt=""
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    <Box
                      onClick={handleDeleteImg}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        width: 22,
                        height: 22,
                        borderRadius: '50%',
                        background:
                          'rgba(0,0,0,0.45)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        '&:hover': {
                          background:
                            'rgba(0,0,0,0.65)',
                        },
                      }}
                    >
                      <DeleteIcon
                        sx={{
                          fontSize: 13,
                          color: '#fff',
                        }}
                      />
                    </Box>
                  </>
                ) : (
                  <Box sx={{ textAlign: 'center' }}>
                    <AddPhotoIcon
                      sx={{
                        fontSize: 22,
                        color: '#b0bcc8',
                        mb: 0.5,
                      }}
                    />
                    <Typography
                      sx={{
                        fontSize: 11.5,
                        color: '#b0bcc8',
                      }}
                    >
                      点击上传，最大 10M
                    </Typography>
                  </Box>
                )}
              </Box>
            </Grid>

            {/* 是否综合报告 */}
            <Grid item xs={6}>
              <FieldLabel>是否综合报告 *</FieldLabel>
              <BoolSelect
                name="isComprehensiveReport"
                value={scale?.isComprehensiveReport}
                placeholder="请选择"
                onChange={handleSelectChange}
              />
            </Grid>

            {/* 团体介绍 */}
            <Grid item xs={12}>
              <FieldLabel>团体介绍</FieldLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="请输入团体介绍"
                name="teamIntroduction"
                value={
                  scale?.teamIntroduction ?? ''
                }
                onChange={handleTextChange}
                inputProps={inputSx}
              />
            </Grid>

            {/* 开始年龄 */}
            <Grid item xs={6}>
              <FieldLabel>开始年龄</FieldLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="请输入开始年龄"
                name="startAge"
                type="number"
                inputProps={{
                  min: 0,
                  step: 1,
                  style: { fontSize: 13.5 },
                }}
                value={scale?.startAge ?? ''}
                onChange={handleTextChange}
              />
            </Grid>

            {/* 结束年龄 */}
            <Grid item xs={6}>
              <FieldLabel>结束年龄</FieldLabel>
              <TextField
                fullWidth
                size="small"
                placeholder="请输入结束年龄"
                name="endAge"
                type="number"
                inputProps={{
                  min: 0,
                  step: 1,
                  style: { fontSize: 13.5 },
                }}
                value={scale?.endAge ?? ''}
                onChange={handleTextChange}
              />
            </Grid>

            {/* 性别 */}
            <Grid item xs={6}>
              <FieldLabel>适用性别</FieldLabel>
              <Select
                displayEmpty
                name="warnGender"
                size="small"
                fullWidth
                required
                value={genderValue}
                onChange={handleSelectChange}
                sx={{ fontSize: 13.5 }}
                renderValue={(selected) => {
                  if (
                    scale?.warnGender !== null &&
                    scale?.warnGender !== undefined
                  ) {
                    return getGenderLabel(
                      Number(scale.warnGender),
                    );
                  }
                  const s = selected as string;
                  if (!s || s.length === 0) {
                    return (
                      <span
                        style={{
                          color: 'rgba(0,0,0,0.35)',
                        }}
                      >
                        请选择性别
                      </span>
                    );
                  }
                  return getGenderLabel(
                    Number(selected),
                  );
                }}
              >
                <MenuItem
                  value=""
                  sx={{ fontSize: 13.5 }}
                >
                  请选择性别
                </MenuItem>
                <MenuItem
                  value={0}
                  sx={{ fontSize: 13.5 }}
                >
                  女
                </MenuItem>
                <MenuItem
                  value={1}
                  sx={{ fontSize: 13.5 }}
                >
                  男
                </MenuItem>
                <MenuItem
                  value={2}
                  sx={{ fontSize: 13.5 }}
                >
                  性别不限
                </MenuItem>
              </Select>
            </Grid>

            {/* 是否计时 */}
            <Grid item xs={6}>
              <FieldLabel>量表是否计时</FieldLabel>
              <BoolSelect
                name="scaleTimeKeeping"
                value={scale?.scaleTimeKeeping}
                placeholder="请选择"
                onChange={handleSelectChange}
              />
            </Grid>

            {/* 跳题规则 */}
            <Grid item xs={12}>
              <FieldLabel>跳题规则</FieldLabel>
              <TextField
                fullWidth
                size="small"
                multiline
                rows={3}
                placeholder="请输入跳题规则"
                name="skipRule"
                value={scale?.skipRule ?? ''}
                onChange={handleTextChange}
                inputProps={inputSx}
              />
            </Grid>
          </Grid>

          <Divider
            sx={{
              borderColor: '#edf0f3',
              mt: 3,
              mb: 2.5,
            }}
          />

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: 1,
            }}
          >
            <StyledCancelButton onClick={handleClose}>
              取消
            </StyledCancelButton>
            <StyledaAffirmButton
              variant="contained"
              type="submit"
            >
              {isEdit ? '保存修改' : '确认新增'}
            </StyledaAffirmButton>
          </Box>
        </Box>
      </StyledBox>
    </Modal>
  );
};

export default AddModal;
