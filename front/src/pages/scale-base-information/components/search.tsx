import { Search as SearchIcon } from '@mui/icons-material';
import { Box, FormControl, MenuItem } from '@mui/material';
import type { SelectChangeEvent } from '@mui/material/Select';
import { memo, useRef } from 'react';

import type { ScaleType } from '../type';
import { StyledButton, StyledInputLable, StyledSelectField, StyledTextField } from './style';

type PropsConfig = {
  setSearchData: React.Dispatch<React.SetStateAction<{ scaleType?: number; scaleName?: string }>>;
  scaleTypes: ScaleType[];
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

const Search = ({ setSearchData, scaleTypes, setPage }: PropsConfig) => {
  const scaleType = useRef(0);
  const scaleName = useRef('');

  const handleSelectChange = (event: SelectChangeEvent<unknown>) => {
    scaleType.current = event.target.value as number;
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    scaleName.current = event.target.value;
  };

  const handleClick = () => {
    setPage(1);
    setSearchData({ scaleType: scaleType.current, scaleName: scaleName.current });
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, flexWrap: 'wrap' }}>
      <FormControl>
        <StyledInputLable shrink>量表类型</StyledInputLable>
        <StyledSelectField
          size="small"
          displayEmpty
          defaultValue={0}
          onChange={handleSelectChange}
        >
          <MenuItem value={0} sx={{ fontSize: 13.5 }}>全部类型</MenuItem>
          {scaleTypes.map((el) => (
            <MenuItem value={Number(el.id)} key={`${el.id}-${el.name}`} sx={{ fontSize: 13.5 }}>
              {el.name}
            </MenuItem>
          ))}
        </StyledSelectField>
      </FormControl>

      <FormControl>
        <StyledInputLable shrink>量表名称</StyledInputLable>
        <StyledTextField
          placeholder="请输入量表名称"
          variant="outlined"
          size="small"
          onChange={handleTextChange}
        />
      </FormControl>

      <StyledButton
        variant="contained"
        startIcon={<SearchIcon sx={{ fontSize: 15 }} />}
        onClick={handleClick}
      >
        查询
      </StyledButton>
    </Box>
  );
};

export default memo(Search);
