export type Role = 'ADMIN' | 'DIRECTIOR' | 'DOCTOR' | 'USER';

export interface UserSkill {
  id: number;
  name: string;
}

export interface UserUnit {
  id: number;
  name: string;
}

export interface User {
  id: number;
  uuid?: string;
  username: string;
  realname: string;
  gender?: number | null;
  age?: number | null;
  telephone?: string | null;
  email?: string | null;
  role: Role;
  isEnable?: boolean | null;
  isAdmin?: boolean | null;
  province?: string | null;
  city?: string | null;
  district?: string | null;
  addressDetail?: string | null;
  remark?: string | null;
  unitId?: number | null;
  unit?: UserUnit | null;
  skills?: UserSkill[];
  createdAt?: string;
}

export interface UsersPagedResp {
  getUsersTotal: number;
  getUsersPaged: User[];
}
