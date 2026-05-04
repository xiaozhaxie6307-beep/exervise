import type { ApolloQueryResult } from '@apollo/client';
import { Add } from '@mui/icons-material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import { Box } from '@mui/material';
import { memo, useState } from 'react';

import type { QueryData, ScaleType, TableData } from '../type';
import AddModal from './add-modal';
import ImportModal from './import-modal';
import { StyledCreatedButton, StyledImportButton } from './style';

type PropsConfig = {
  addOpen: boolean;
  setAddOpen: Function;
  scaleTypes: ScaleType[];
  modifyId: React.MutableRefObject<number>;
  getBaseInformationTableData: (
    variables?: Partial<QueryData> | undefined,
  ) => Promise<ApolloQueryResult<TableData>>;
  pageNumber: React.MutableRefObject<number>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
};

const AddAndImport = ({
  addOpen,
  setAddOpen,
  scaleTypes,
  modifyId,
  getBaseInformationTableData,
  pageNumber,
  setPage,
}: PropsConfig) => {
  const [importOpen, setImportOpen] = useState(false);

  const handleAddClick = () => {
    modifyId.current = 0;
    setAddOpen(true);
  };

  return (
    <>
      <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
        <StyledCreatedButton
          variant="contained"
          startIcon={<Add sx={{ fontSize: 15 }} />}
          onClick={handleAddClick}
        >
          新增
        </StyledCreatedButton>
        <StyledImportButton
          variant="outlined"
          startIcon={<UploadFileIcon sx={{ fontSize: 15 }} />}
          onClick={() => setImportOpen(true)}
        >
          导入量表
        </StyledImportButton>
      </Box>

      <AddModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        scaleTypes={scaleTypes}
        modifyId={modifyId}
        getBaseInformationTableData={getBaseInformationTableData}
        pageNumber={pageNumber}
        setPage={setPage}
      />
      <ImportModal open={importOpen} onClose={() => setImportOpen(false)} />
    </>
  );
};

export default memo(AddAndImport);
