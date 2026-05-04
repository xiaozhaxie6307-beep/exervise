export interface Skill {
  id: number;
  uuid?: string;
  name: string;
  level?: number | null;
  description?: string | null;
  createdAt?: string;
}

export interface SkillsPagedResp {
  getSkillsTotal: number;
  getSkillsPaged: Skill[];
}

export interface SkillUser {
  id: number;
  username: string;
  realname: string;
  telephone?: string | null;
  unitId?: number | null;
}

export interface SkillUsersResp {
  getSkillUsersPaged: { rows: SkillUser[]; total: number };
}
