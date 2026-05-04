import {
  Button,
  InputLabel,
  Pagination,
  Select,
  styled,
  TableCell,
  tableCellClasses,
  TextField,
} from '@mui/material';

export const StyledBox = styled('div')`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 640px;
  max-height: 82vh;
  border-radius: 10px;
  background: #ffffff;
  overflow-y: auto;
  overflow-x: hidden;
  outline: none;
`;

export const StyledaAffirmButton = styled(Button)`
  height: 34px;
  border-radius: 6px;
  background: #1a6b6f;
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 500;
  padding: 0 20px;
  box-shadow: none;
  &:hover {
    background: #0f4a4d;
    box-shadow: none;
  }
`;

export const StyledCancelButton = styled(Button)`
  height: 34px;
  border-radius: 6px;
  background: #ffffff;
  border: 1px solid #dde3e8;
  color: #5a6a7a;
  font-size: 13.5px;
  font-weight: 500;
  padding: 0 20px;
  box-shadow: none;
  &:hover {
    background: #f4f6f8;
    border-color: #c0ccd4;
    box-shadow: none;
  }
`;

export const StyledInputLable = styled(InputLabel)`
  font-size: 13.5px;
  color: #5a6a7a;
  margin-bottom: 4px;
`;

export const StyledSelectField = styled(Select)`
  width: 160px;
  height: 34px;
  border-radius: 6px;
  font-size: 13.5px;
  background: #ffffff;
`;

export const StyledTextField = styled(TextField)`
  width: 180px;
  background: #ffffff;
  border-radius: 6px;
  & .MuiInputBase-root {
    height: 34px;
    font-size: 13.5px;
  }
`;

export const StyledButton = styled(Button)`
  height: 34px;
  border-radius: 6px;
  background: #1a6b6f;
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 500;
  padding: 0 16px;
  box-shadow: none;
  &:hover {
    background: #0f4a4d;
    box-shadow: none;
  }
`;

export const StyledCreatedButton = styled(Button)`
  height: 34px;
  border-radius: 6px;
  background: #1a6b6f;
  color: #ffffff;
  font-size: 13.5px;
  font-weight: 500;
  padding: 0 14px;
  box-shadow: none;
  &:hover {
    background: #0f4a4d;
    box-shadow: none;
  }
`;

export const StyledImportButton = styled(Button)`
  height: 34px;
  border-radius: 6px;
  background: #ffffff;
  border: 1px solid #dde3e8;
  color: #5a6a7a;
  font-size: 13.5px;
  font-weight: 500;
  padding: 0 14px;
  box-shadow: none;
  &:hover {
    background: #f4f6f8;
    border-color: #c0ccd4;
    box-shadow: none;
  }
`;

export const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#f8fafb',
    color: '#5a6a7a',
    fontWeight: 600,
    fontSize: '12.5px',
    letterSpacing: '0.02em',
    textTransform: 'uppercase',
    height: 40,
    borderBottom: '1px solid #edf0f3',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: '13.5px',
    color: '#1a2332',
    height: 48,
    borderBottom: '1px solid #f4f6f8',
  },
}));

export const StyledPagination = styled(Pagination)`
  display: flex;
  justify-content: flex-end;
  padding: 14px 16px;
  & .MuiPaginationItem-root {
    border-radius: 6px;
    font-size: 13px;
    color: #5a6a7a;
    border-color: #e8ecf0;
  }
  & .MuiPaginationItem-root.Mui-selected {
    background: #1a6b6f;
    color: #ffffff;
    border-color: #1a6b6f;
  }
`;

export const StyleDeleteAndModifyButton = styled(Button)`
  height: 26px;
  border-radius: 4px;
  font-size: 12.5px;
  font-weight: 500;
  padding: 0 10px;
  min-width: unset;
  box-shadow: none;
`;
