import { ExperienceModule } from './experience/experience.module';
import { SkillModule } from './skill/skill.module';
import { UnitModule } from './unit/unit.module';
import { UsersModule } from './users/users.module';

/** 框架需要加载的模块，在此处注册后会自动导入 */
const modules = [UsersModule, UnitModule, ExperienceModule, SkillModule];

export default modules;
