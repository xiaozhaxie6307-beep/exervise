export interface Experience {
  id: number;
  uuid?: string;
  userId: number;
  organization: string;
  position?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  description?: string | null;
  remark?: string | null;
  createdAt?: string;
  user?: { id: number; username: string; realname: string } | null;
}

export interface ExperiencesPagedResp {
  getExperiencesTotal: number;
  getExperiencesPaged: Experience[];
}
