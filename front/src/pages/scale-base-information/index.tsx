import { useQuery } from '@apollo/client';
import { Box, Divider, Typography } from '@mui/material';
import { useEffect, useMemo, useRef, useState } from 'react';

import { GET_BASE_INFORMATION_TABLE_DATA, GET_SCALE_TYPES } from '@/apis/index';

import AddAndImport from './components/add-import';
import Search from './components/search';
import BaseInformationTable from './components/table';
import type { QueryData, Scale, ScaleType, ScaleTypes, TableData } from './type';

const BaseInformation = () => {
  const [scales, setScales] = useState<Scale[]>([]);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(1);
  const [searchData, setSearchData] = useState<{ scaleType?: number; scaleName?: string }>({});
  const pageNumber = useRef(10);
  const [scaleTypes, setScaleTypes] = useState<ScaleType[]>([]);
  const [addOpen, setAddOpen] = useState(false);
  const modifyId = useRef(0);

  const { loading, refetch: getBaseInformationTableData } = useQuery<TableData, QueryData>(
    GET_BASE_INFORMATION_TABLE_DATA,
    {
      onCompleted(data) {
        const { totalCount: tc, getBaseInformationTableData: tableData } = data || {};
        if (tc) setTotalCount(tc);
        setScales([...tableData]);
      },
    },
  );

  useQuery<ScaleTypes>(GET_SCALE_TYPES, {
    onCompleted(data) {
      setScaleTypes(data?.getScaleTypes ?? []);
    },
  });

  useEffect(() => {
    getBaseInformationTableData({
      data: { currentPage: page, pageNumber: pageNumber.current, ...searchData },
    });
  }, [getBaseInformationTableData, page, searchData]);

  const pageCount = useMemo(() => Math.ceil(totalCount / pageNumber.current), [totalCount]);

  return (
    <Box>
      {/* Toolbar */}
      <Box
        sx={{
          px: 3, py: 2,
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 2,
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 15, fontWeight: 600, color: '#1a2332', mb: 0.25 }}>
            量表基本信息
          </Typography>
          <Typography sx={{ fontSize: 12.5, color: '#9aabb5' }}>
            共 {totalCount} 条记录
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 2, flexWrap: 'wrap' }}>
          <Search setSearchData={setSearchData} scaleTypes={scaleTypes} setPage={setPage} />
          <AddAndImport
            setPage={setPage}
            addOpen={addOpen}
            setAddOpen={setAddOpen}
            scaleTypes={scaleTypes}
            modifyId={modifyId}
            getBaseInformationTableData={getBaseInformationTableData}
            pageNumber={pageNumber}
          />
        </Box>
      </Box>

      <Divider sx={{ borderColor: '#edf0f3' }} />

      <BaseInformationTable
        loading={loading}
        data={scales}
        page={page}
        setPage={setPage}
        pageCount={pageCount}
        setAddOpen={setAddOpen}
        modifyId={modifyId}
      />
    </Box>
  );
};

export default BaseInformation;
