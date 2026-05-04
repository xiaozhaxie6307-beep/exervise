import {
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import moment from 'moment';
import { memo, useState } from 'react';

import type { Scale } from '../type';
import {
  StyledaAffirmButton,
  StyledCancelButton,
  StyleDeleteAndModifyButton,
  StyledPagination,
  StyledTableCell,
} from './style';

type PropsConfig = {
  loading: Boolean;
  data: Scale[];
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  pageCount: number;
  setAddOpen: React.Dispatch<React.SetStateAction<boolean>>;
  modifyId: React.MutableRefObject<number>;
};

const BoolChip = ({ value }: { value: boolean | null | undefined }) => (
  <Chip
    label={value ? '是' : '否'}
    size="small"
    sx={{
      height: 20,
      fontSize: 11.5,
      fontWeight: 500,
      borderRadius: '4px',
      background: value ? 'rgba(46,158,107,0.1)' : 'rgba(90,106,122,0.08)',
      color: value ? '#2e9e6b' : '#7a8a9a',
      border: 'none',
    }}
  />
);

const COLUMNS = ['序号', '量表名称', '量表编号', '有因子', '跳题', '已启用', '跳转规则', '创建时间', '操作'];

const BaseInformationTable = ({
  loading,
  data,
  page,
  setPage,
  pageCount,
  setAddOpen,
  modifyId,
}: PropsConfig) => {
  const [deleteTarget, setDeleteTarget] = useState<Scale | null>(null);

  const handleModify = (row: Scale) => {
    modifyId.current = row.id as number;
    setAddOpen(true);
  };

  const handlePaginationChange = (_: React.ChangeEvent<unknown>, p: number) => setPage(p);

  return (
    <Box>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              {COLUMNS.map((col) => (
                <StyledTableCell key={col} align="center">{col}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>

          {loading ? (
            <TableBody>
              <TableRow>
                <StyledTableCell colSpan={COLUMNS.length} align="center" sx={{ py: 6 }}>
                  <CircularProgress size={28} sx={{ color: '#1a6b6f' }} />
                </StyledTableCell>
              </TableRow>
            </TableBody>
          ) : data.length === 0 ? (
            <TableBody>
              <TableRow>
                <StyledTableCell colSpan={COLUMNS.length} align="center" sx={{ py: 6 }}>
                  <Typography sx={{ color: '#9aabb5', fontSize: 13.5 }}>暂无数据</Typography>
                </StyledTableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {data.map((row, index) => (
                <TableRow
                  key={`${row.name}-${row.id}`}
                  sx={{ '&:hover': { background: '#fafbfc' } }}
                >
                  <StyledTableCell align="center">
                    <Typography sx={{ fontSize: 12.5, color: '#9aabb5', fontWeight: 500 }}>
                      {(page - 1) * 10 + index + 1}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Typography sx={{ fontSize: 13.5, fontWeight: 500, color: '#1a2332' }}>
                      {row.name}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Typography sx={{ fontSize: 12.5, color: '#7a8a9a', fontFamily: 'monospace' }}>
                      #{row.id}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <BoolChip value={row.isFactor} />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <BoolChip value={row.isSkip} />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <BoolChip value={row.isEnable} />
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Typography
                      noWrap
                      sx={{
                        fontSize: 12.5,
                        color: '#7a8a9a',
                        maxWidth: 120,
                        mx: 'auto',
                      }}
                    >
                      {row.skipRule ?? '—'}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Typography sx={{ fontSize: 12.5, color: '#7a8a9a' }}>
                      {moment(row.createdAt).format('YYYY-MM-DD')}
                    </Typography>
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <Box
                      sx={{
                        display: 'flex',
                        gap: 0.75,
                        justifyContent: 'center',
                      }}
                    >
                      <StyleDeleteAndModifyButton
                        variant="outlined"
                        onClick={() => handleModify(row)}
                        sx={{
                          color: '#1a6b6f',
                          borderColor: 'rgba(26,107,111,0.3)',
                          '&:hover': {
                            borderColor: '#1a6b6f',
                            background: 'rgba(26,107,111,0.05)',
                          },
                        }}
                      >
                        编辑
                      </StyleDeleteAndModifyButton>
                      <StyleDeleteAndModifyButton
                        variant="outlined"
                        onClick={() => setDeleteTarget(row)}
                        sx={{
                          color: '#d94f4f',
                          borderColor: 'rgba(217,79,79,0.3)',
                          '&:hover': {
                            borderColor: '#d94f4f',
                            background: 'rgba(217,79,79,0.05)',
                          },
                        }}
                      >
                        删除
                      </StyleDeleteAndModifyButton>
                    </Box>
                  </StyledTableCell>
                </TableRow>
              ))}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      <StyledPagination
        count={pageCount}
        defaultPage={1}
        variant="outlined"
        shape="rounded"
        page={page}
        onChange={handlePaginationChange}
      />

      {/* Delete confirm dialog */}
      <Dialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        PaperProps={{ sx: { borderRadius: 2, minWidth: 320 } }}
      >
        <DialogTitle sx={{ fontSize: 15, fontWeight: 600, pb: 1 }}>确认删除</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ fontSize: 13.5, color: '#5a6a7a' }}>
            确定要删除量表「{deleteTarget?.name}」吗？此操作不可撤销。
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
          <StyledCancelButton onClick={() => setDeleteTarget(null)}>取消</StyledCancelButton>
          <StyledaAffirmButton
            variant="contained"
            onClick={() => setDeleteTarget(null)}
            sx={{ background: '#d94f4f', '&:hover': { background: '#b83c3c' } }}
          >
            确认删除
          </StyledaAffirmButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default memo(BaseInformationTable);
