import { gql } from '@apollo/client';

export const GetDemoDashData = gql`
  query getDemoDashData($endTime: Int!) {
    inbounds(end_time: $endTime) {
      date
      total
    }
    outbounds(end_time: $endTime) {
      date
      total
    }
    domesticIp(end_time: $endTime) {
      date
      total
    }
    overseasIp(end_time: $endTime) {
      date
      total
    }
    totalOutFlow(end_time: $endTime) {
      country
      number
    }
  }
`;

// 获取量表基本信息
export const GET_BASE_INFORMATION_TABLE_DATA = gql`
  query getBaseInformationTableData($data: GetBaseInformationTableData!) {
    totalCount(data: $data)
    getBaseInformationTableData(data: $data) {
      id
      name
      isEnable
      skipRule
      isSkip
      isFactor
      createdAt
    }
  }
`;

// 获取量表类型列表
export const GET_SCALE_TYPES = gql`
  query getScaleTypes {
    getScaleTypes {
      id
      name
    }
  }
`;

export const GET_SCALE_DETAIL = gql`
  query getScaleDetail($data: Int!) {
    getScaleDetail(data: $data) {
      name
      scacleCode
      calformula
      tranformulakey
      tranformula
      average
      sd
      scaleInterpretationResult
      baselineScore
      standardSourceMethod
      rawSourceMethod
      averageSourceMethod
      scaleTimeKeeping
      scaleTimeLimit
      introduction
      instructions
      isEnable
      scaleCoverUrl
      scaleContentImg
      isTeam
      teamIntroduction
      isComprehensiveReport
      startAge
      endAge
      warnGender
      skipRule
      isSkip
      isFactor
      scaleTypeId
    }
  }
`;

export const SUBMIT_BASE_INFORMATION = gql`
  mutation submitBaseInformation($data: SubmitBaseInformation!) {
    submitBaseInformation(data: $data) {
      name
    }
  }
`;

// 获取因子列表
export const GET_FACTOR_LIST_QUERY = gql`
  query getFactorList($data: GetFactorListInput!) {
    getFactorNumber(data: $data)
    getFactorList(data: $data) {
      id
      uuid
      name
      introduction
      calformula
      tranformula
      average
      sd
      baseLineScore
      remark
      createdAt
    }
  }
`;

// 获取量表类型
export const GET_SCALE_TYPE_QUERY = gql`
  query getScaleType {
    getScaleType {
      id
      uuid
      name
    }
  }
`;

// 获取量表名称
export const GET_SCALE_NAME_QUERY = gql`
  query getScaleName {
    getScaleName {
      id
      uuid
      name
      scaleTypeId
    }
  }
`;
// 添加与修改因子
export const ADD_FACTOR_MUTATION = gql`
  mutation addFactor($data: CreacteFactorInput!) {
    addFactor(data: $data) {
      id
      uuid
      name
      introduction
      calformula
      tranformula
      average
      sd
      baseLineScore
      remark
      createdAt
    }
  }
`;
// 删除因子
export const DELETE_FACTOR_MUTATION = gql`
  mutation deleteFactor($data: String!) {
    deleteFactor(data: $data) {
      id
      uuid
      name
      introduction
      calformula
      tranformula
      average
      sd
      baseLineScore
      remark
      createdAt
    }
  }
`;
// 获取因子信息
export const GET_FACTOR_QUERY = gql`
  query getFactor($data: String!) {
    getFactorScaleType(data: $data)
    getFactor(data: $data) {
      uuid
      name
      scaleId
      introduction
      calformula
      tranformula
      average
      sd
      baseLineScore
      remark
      createdAt
    }
  }
`;
// 获取量表类型和名称
export const GET_SCALE_TYPE_NAME = gql`
  query GetAllScaleTypes {
    getAllScaleTypeAndName {
      data {
        scaleTypeId: id
        name
      }
    }
  }
`;
// 根据类型获取量表
export const GET_SCALE_BY_TYPEID = gql`
  query GetScaleByType($scaleTypeId: Int!) {
    getScaleByType(scaleTypeId: $scaleTypeId) {
      data {
        id
        name
      }
    }
  }
`;
// 获取表格数据
export const GET_TABLE_DATA = gql`
  query GetTableData($data: QuestionQueryInput, $pagination: PaginationArgs!) {
    getAllSclaeQuestion(data: $data, pagination: $pagination) {
      data {
        id
        name
        questionCode
        questionImg
        answerGroupCode
        isMultiSelect
        timeLimit
        remark
        createdAt
        scale {
          name
          scaleTypeId
        }
      }
      total
    }
  }
`;
// 创建量表问题
export const CREATE_QUESTION_DATA = gql`
  mutation createScaleQuestion($data: ScaleQuestionInput!) {
    createScaleQuestion(data: $data) {
      message
    }
  }
`;
// 更新量表问题
export const UPDATE_QUESTION_DATA = gql`
  mutation UpdateScaleQuestion($id: Int!, $data: ScaleQuestionUpdateInput!) {
    updateScaleQuestion(id: $id, data: $data) {
      id
      message
      success
    }
  }
`;
// 删除量表问题
export const DELETE_QUESITON_DATA = gql`
  mutation deleteScaleQuestionById($id: Int!) {
    deleteScaleQuestionById(id: $id) {
      id
    }
  }
`;

/* ============================================================
 * 用户管理 / 单位 / 经历 / 技能
 * ============================================================ */

// ---- 用户 ----
export const GET_USERS_PAGED = gql`
  query getUsersPaged($data: GetUsersPagedInput!) {
    getUsersTotal(data: $data)
    getUsersPaged(data: $data) {
      id
      uuid
      username
      realname
      gender
      age
      telephone
      email
      role
      isEnable
      isAdmin
      province
      city
      district
      addressDetail
      remark
      createdAt
      unitId
      unit {
        id
        name
      }
      skills {
        id
        name
      }
    }
  }
`;

export const GET_USER_DETAIL = gql`
  query getUserDetail($id: Int!) {
    getUserDetail(id: $id) {
      id
      uuid
      username
      realname
      gender
      age
      telephone
      email
      role
      isEnable
      isAdmin
      province
      city
      district
      addressDetail
      remark
      unitId
      unit {
        id
        name
      }
      skills {
        id
        name
      }
    }
  }
`;

export const CREATE_USER = gql`
  mutation createUser($data: CreateUserInput!) {
    createUser(data: $data) {
      id
      username
    }
  }
`;

export const UPDATE_USER_BY_ID = gql`
  mutation updateUserById($id: Int!, $data: UpdateUserInput!) {
    updateUserById(id: $id, data: $data) {
      id
      username
    }
  }
`;

export const DELETE_USER = gql`
  mutation deleteUser($id: Int!) {
    deleteUser(id: $id) {
      id
    }
  }
`;

// ---- 单位 ----
export const GET_UNITS_PAGED = gql`
  query getUnitsPaged($data: GetUnitsPagedInput!) {
    getUnitsTotal(data: $data)
    getUnitsPaged(data: $data) {
      id
      uuid
      name
      code
      isEnable
      remark
      createdAt
    }
  }
`;

export const GET_ALL_UNITS = gql`
  query getAllUnits {
    getAllUnits {
      id
      name
    }
  }
`;

export const SUBMIT_UNIT = gql`
  mutation submitUnit($data: SubmitUnitInput!) {
    submitUnit(data: $data) {
      id
      name
    }
  }
`;

export const DELETE_UNIT = gql`
  mutation deleteUnit($id: Int!) {
    deleteUnit(id: $id) {
      id
    }
  }
`;

// ---- 社会经历 ----
export const GET_EXPERIENCES_PAGED = gql`
  query getExperiencesPaged($data: GetExperiencesPagedInput!) {
    getExperiencesTotal(data: $data)
    getExperiencesPaged(data: $data) {
      id
      uuid
      userId
      organization
      position
      startDate
      endDate
      description
      remark
      createdAt
      user {
        id
        username
        realname
      }
    }
  }
`;

export const SUBMIT_EXPERIENCE = gql`
  mutation submitExperience($data: SubmitExperienceInput!) {
    submitExperience(data: $data) {
      id
      organization
    }
  }
`;

export const DELETE_EXPERIENCE = gql`
  mutation deleteExperience($id: Int!) {
    deleteExperience(id: $id) {
      id
    }
  }
`;

// ---- 技能 ----
export const GET_SKILLS_PAGED = gql`
  query getSkillsPaged($data: GetSkillsPagedInput!) {
    getSkillsTotal(data: $data)
    getSkillsPaged(data: $data) {
      id
      uuid
      name
      level
      description
      createdAt
    }
  }
`;

export const GET_ALL_SKILLS = gql`
  query getAllSkills {
    getAllSkills {
      id
      name
      level
    }
  }
`;

export const GET_SKILL_USERS_PAGED = gql`
  query getSkillUsersPaged($data: GetSkillUsersPagedInput!) {
    getSkillUsersPaged(data: $data) {
      total
      rows {
        id
        username
        realname
        telephone
        unitId
      }
    }
  }
`;

export const SUBMIT_SKILL = gql`
  mutation submitSkill($data: SubmitSkillInput!) {
    submitSkill(data: $data) {
      id
      name
    }
  }
`;

export const DELETE_SKILL = gql`
  mutation deleteSkill($id: Int!) {
    deleteSkill(id: $id) {
      id
    }
  }
`;

export const ATTACH_SKILL_TO_USER = gql`
  mutation attachSkillToUser($data: UserSkillRelationInput!) {
    attachSkillToUser(data: $data)
  }
`;

export const DETACH_SKILL_FROM_USER = gql`
  mutation detachSkillFromUser($data: UserSkillRelationInput!) {
    detachSkillFromUser(data: $data)
  }
`;
