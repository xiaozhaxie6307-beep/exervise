export interface Unit {
  id: number;
  uuid?: string;
  name: string;
  code?: string | null;
  isEnable?: boolean | null;
  remark?: string | null;
  createdAt?: string;
}

export interface GetUnitsPagedInput {
  currentPage: number;
  pageNumber: number;
  name?: string;
  code?: string;
}

export interface UnitsPagedResp {
  getUnitsTotal: number;
  getUnitsPaged: Unit[];
}

export interface SubmitUnitInput {
  id?: number | null;
  name: string;
  code?: string | null;
  isEnable?: boolean | null;
  remark?: string | null;
}
