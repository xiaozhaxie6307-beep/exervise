import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  console.log('🧹 清理已有业务数据 …');
  // 顺序：中间表 → 经历 → 用户 → 技能 → 单位 → 量表关联
  await prisma.mergeUserSkill.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.mergeUserScale.deleteMany();
  await prisma.user.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.unit.deleteMany();

  console.log('🌱 写入单位 …');
  const units = await Promise.all(
    [
      { name: '可信人工智能实验室', code: 'TAI-LAB' },
      { name: '信息技术中心', code: 'ITC' },
      { name: '医学影像研究所', code: 'MRI-INS' },
      { name: '心理健康中心', code: 'PSY-CTR' },
    ].map((u) =>
      prisma.unit.create({
        data: { uuid: uuidv4(), name: u.name, code: u.code, isEnable: true },
      })
    )
  );

  console.log('🌱 写入技能 …');
  const skills = await Promise.all(
    [
      { name: 'NestJS', level: 5, description: '后端框架' },
      { name: 'React', level: 5, description: '前端框架' },
      { name: 'TypeScript', level: 4, description: 'JS 超集' },
      { name: 'PostgreSQL', level: 4, description: '关系型数据库' },
      { name: 'Prisma', level: 4, description: 'Node.js ORM' },
      { name: 'GraphQL', level: 3, description: '查询语言' },
      { name: '机器学习', level: 3, description: 'ML 基础' },
      { name: '心理咨询', level: 4, description: '咨询技能' },
    ].map((s) =>
      prisma.skill.create({
        data: {
          uuid: uuidv4(),
          name: s.name,
          level: s.level,
          description: s.description,
        },
      })
    )
  );

  const passwordHash = await bcrypt.hash('123456', 10);

  console.log('🌱 写入用户 …');
  const admin = await prisma.user.create({
    data: {
      uuid: uuidv4(),
      username: 'admin',
      password: passwordHash,
      realname: '超级管理员',
      role: 'ADMIN',
      isAdmin: true,
      isEnable: true,
      gender: 1,
      age: 32,
      telephone: '13800000001',
      email: 'admin@exervise.local',
      province: '北京市',
      city: '北京市',
      district: '海淀区',
      addressDetail: '中关村大街 1 号',
      qualification: '高级工程师',
      introduction: '系统管理员',
      unit: { connect: { id: units[0].id } },
    },
  });

  const userUser = await prisma.user.create({
    data: {
      uuid: uuidv4(),
      username: 'user',
      password: passwordHash,
      realname: '普通用户',
      role: 'USER',
      isAdmin: false,
      isEnable: true,
      gender: 2,
      age: 26,
      telephone: '13800000002',
      email: 'user@exervise.local',
      province: '上海市',
      city: '上海市',
      district: '浦东新区',
      addressDetail: '世纪大道 100 号',
      unit: { connect: { id: units[1].id } },
    },
  });

  const doctor = await prisma.user.create({
    data: {
      uuid: uuidv4(),
      username: 'doctor',
      password: passwordHash,
      realname: '李医生',
      role: 'DOCTOR',
      isAdmin: false,
      isEnable: true,
      gender: 1,
      age: 38,
      telephone: '13800000003',
      email: 'doctor@exervise.local',
      province: '广东省',
      city: '广州市',
      district: '天河区',
      addressDetail: '天河路 200 号',
      qualification: '主治医师',
      unit: { connect: { id: units[2].id } },
    },
  });

  const director = await prisma.user.create({
    data: {
      uuid: uuidv4(),
      username: 'director',
      password: passwordHash,
      realname: '王主任',
      role: 'DIRECTIOR',
      isAdmin: false,
      isEnable: true,
      gender: 2,
      age: 45,
      telephone: '13800000004',
      email: 'director@exervise.local',
      province: '浙江省',
      city: '杭州市',
      district: '西湖区',
      addressDetail: '文一西路 500 号',
      qualification: '主任医师',
      unit: { connect: { id: units[3].id } },
    },
  });

  console.log('🌱 写入用户—技能关联 …');
  // admin: 全栈管理员
  for (const s of [skills[0], skills[1], skills[2], skills[3], skills[4], skills[5]]) {
    await prisma.mergeUserSkill.create({
      data: { userId: admin.id, skillId: s.id },
    });
  }
  // user: 前端 + TS
  for (const s of [skills[1], skills[2]]) {
    await prisma.mergeUserSkill.create({
      data: { userId: userUser.id, skillId: s.id },
    });
  }
  // doctor: 心理咨询 + ML
  for (const s of [skills[7], skills[6]]) {
    await prisma.mergeUserSkill.create({
      data: { userId: doctor.id, skillId: s.id },
    });
  }
  // director: 心理咨询
  await prisma.mergeUserSkill.create({
    data: { userId: director.id, skillId: skills[7].id },
  });

  console.log('🌱 写入社会经历 …');
  const expRows = [
    {
      userId: admin.id,
      organization: '清华大学',
      position: '本科生',
      startDate: new Date('2010-09-01'),
      endDate: new Date('2014-07-01'),
      description: '计算机科学与技术学士',
    },
    {
      userId: admin.id,
      organization: '北京字节跳动',
      position: '高级工程师',
      startDate: new Date('2018-04-01'),
      endDate: new Date('2023-08-01'),
      description: '后端架构与平台开发',
    },
    {
      userId: userUser.id,
      organization: '上海交通大学',
      position: '硕士',
      startDate: new Date('2018-09-01'),
      endDate: new Date('2021-07-01'),
      description: '软件工程',
    },
    {
      userId: userUser.id,
      organization: '某互联网公司',
      position: '前端工程师',
      startDate: new Date('2021-08-01'),
      endDate: null,
      description: '负责中后台业务',
    },
    {
      userId: doctor.id,
      organization: '中山大学医学院',
      position: '硕博连读',
      startDate: new Date('2008-09-01'),
      endDate: new Date('2014-07-01'),
      description: '临床医学',
    },
    {
      userId: doctor.id,
      organization: '广州市第一医院',
      position: '主治医师',
      startDate: new Date('2014-08-01'),
      endDate: null,
      description: '内科',
    },
    {
      userId: director.id,
      organization: '浙江大学医学院',
      position: '博士',
      startDate: new Date('2002-09-01'),
      endDate: new Date('2008-07-01'),
      description: '精神卫生',
    },
    {
      userId: director.id,
      organization: '杭州市心理卫生中心',
      position: '主任',
      startDate: new Date('2015-03-01'),
      endDate: null,
      description: '心理评估与治疗',
    },
  ];
  for (const e of expRows) {
    await prisma.experience.create({ data: { uuid: uuidv4(), ...e } });
  }

  console.log('✅ Seed 完成');
  console.table([
    { account: 'admin',    password: '123456', role: 'ADMIN' },
    { account: 'user',     password: '123456', role: 'USER' },
    { account: 'doctor',   password: '123456', role: 'DOCTOR' },
    { account: 'director', password: '123456', role: 'DIRECTIOR' },
  ]);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
