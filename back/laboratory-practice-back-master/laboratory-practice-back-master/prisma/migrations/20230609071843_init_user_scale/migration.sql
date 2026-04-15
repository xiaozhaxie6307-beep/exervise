-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'DIRECTIOR', 'DOCTOR', 'USER');

-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "department_id" INTEGER,
    "education_id" INTEGER,
    "ethnicity_id" INTEGER,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "realname" TEXT NOT NULL,
    "identification_card" TEXT,
    "is_enable" BOOLEAN,
    "is_admin" BOOLEAN,
    "signature" TEXT,
    "gender" INTEGER,
    "age" INTEGER,
    "telephone" TEXT,
    "marital" INTEGER,
    "email" TEXT,
    "job_number" INTEGER,
    "working_year" INTEGER,
    "address" TEXT,
    "qualification" TEXT,
    "introduction" TEXT,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "role" "Role" NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ethnicity" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ethnicity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "institution_code" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubsidiaryDepartment" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "department_id" INTEGER,
    "name" TEXT NOT NULL,
    "institution_code" TEXT NOT NULL,
    "is_enable" BOOLEAN NOT NULL,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SubsidiaryDepartment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "education" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scales" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "scale_type_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "scale_code" TEXT,
    "is_factor" BOOLEAN NOT NULL,
    "is_skip" BOOLEAN NOT NULL,
    "calformula" TEXT,
    "tranformula_key" TEXT,
    "tranformula" TEXT,
    "average" DOUBLE PRECISION,
    "sd" DOUBLE PRECISION,
    "scale_interpretation_result" TEXT,
    "baseline_score" INTEGER,
    "standard_source_method" TEXT,
    "raw_source_method" TEXT,
    "average_source_method" TEXT,
    "scale_time_keeping" BOOLEAN,
    "scale_time_limit" INTEGER,
    "introduction" TEXT,
    "instructions" TEXT,
    "is_enable" BOOLEAN NOT NULL,
    "scale_cover_url" TEXT,
    "scale_content_img" TEXT,
    "scale_comment" TEXT,
    "average_numbre" TEXT,
    "sdf" TEXT,
    "iniscore" INTEGER,
    "stand_score" DOUBLE PRECISION,
    "average_score" DOUBLE PRECISION,
    "average_numnber_sd" DOUBLE PRECISION,
    "is_team" BOOLEAN NOT NULL,
    "team_introduction" TEXT,
    "is_comprehensive_report" BOOLEAN NOT NULL,
    "start_age" INTEGER,
    "end_age" INTEGER,
    "warn_gender" INTEGER NOT NULL,
    "skip_rule" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sub_scales" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "sub_scales_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scale_factor" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "scale_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "introduction" TEXT,
    "calformula" TEXT,
    "tranformula" TEXT,
    "average" DOUBLE PRECISION,
    "sd" DOUBLE PRECISION,
    "baseLineScore" INTEGER,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scale_factor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scale_question" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "scale_id" INTEGER NOT NULL,
    "name" TEXT,
    "question_code" TEXT,
    "question_img" TEXT,
    "answer_group_code" TEXT,
    "is_multi_select" INTEGER NOT NULL,
    "time_limit" INTEGER,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scale_question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "merge_factor_question" (
    "factor_id" INTEGER NOT NULL,
    "question_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merge_factor_question_pkey" PRIMARY KEY ("factor_id","question_id")
);

-- CreateTable
CREATE TABLE "merge_user_scale" (
    "user_id" INTEGER NOT NULL,
    "scale_id" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "merge_user_scale_pkey" PRIMARY KEY ("user_id","scale_id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "answer_group_code" TEXT,
    "name" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "picture" TEXT,
    "type" INTEGER NOT NULL,
    "score" INTEGER NOT NULL,
    "remark" TEXT,
    "questionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scale_warning" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "scaleId" INTEGER NOT NULL,
    "warning_type" INTEGER NOT NULL,
    "warning_Expression" TEXT NOT NULL,
    "warning_result" TEXT NOT NULL,
    "warning_color" TEXT NOT NULL,
    "is_enable" BOOLEAN NOT NULL,
    "remark" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scale_warning_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scale_diagnostic_info" (
    "id" SERIAL NOT NULL,
    "uuid" TEXT NOT NULL,
    "scaleId" INTEGER,
    "condition" TEXT,
    "proposal" TEXT,
    "diagnostic_info" TEXT,
    "is_enable" BOOLEAN NOT NULL,
    "severity" TEXT,
    "remark" TEXT,

    CONSTRAINT "scale_diagnostic_info_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_uuid_key" ON "user"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "Ethnicity_uuid_key" ON "Ethnicity"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "department_uuid_key" ON "department"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "SubsidiaryDepartment_uuid_key" ON "SubsidiaryDepartment"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "education_uuid_key" ON "education"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "scales_uuid_key" ON "scales"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "sub_scales_uuid_key" ON "sub_scales"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "scale_factor_uuid_key" ON "scale_factor"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "scale_question_uuid_key" ON "scale_question"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "answers_uuid_key" ON "answers"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "scale_warning_uuid_key" ON "scale_warning"("uuid");

-- CreateIndex
CREATE UNIQUE INDEX "scale_diagnostic_info_uuid_key" ON "scale_diagnostic_info"("uuid");

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_education_id_fkey" FOREIGN KEY ("education_id") REFERENCES "education"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_ethnicity_id_fkey" FOREIGN KEY ("ethnicity_id") REFERENCES "Ethnicity"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubsidiaryDepartment" ADD CONSTRAINT "SubsidiaryDepartment_department_id_fkey" FOREIGN KEY ("department_id") REFERENCES "department"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scales" ADD CONSTRAINT "scales_scale_type_id_fkey" FOREIGN KEY ("scale_type_id") REFERENCES "sub_scales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scale_factor" ADD CONSTRAINT "scale_factor_scale_id_fkey" FOREIGN KEY ("scale_id") REFERENCES "scales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scale_question" ADD CONSTRAINT "scale_question_scale_id_fkey" FOREIGN KEY ("scale_id") REFERENCES "scales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merge_factor_question" ADD CONSTRAINT "merge_factor_question_factor_id_fkey" FOREIGN KEY ("factor_id") REFERENCES "scale_factor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merge_factor_question" ADD CONSTRAINT "merge_factor_question_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "scale_question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merge_user_scale" ADD CONSTRAINT "merge_user_scale_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "merge_user_scale" ADD CONSTRAINT "merge_user_scale_scale_id_fkey" FOREIGN KEY ("scale_id") REFERENCES "scales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "scale_question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scale_warning" ADD CONSTRAINT "scale_warning_scaleId_fkey" FOREIGN KEY ("scaleId") REFERENCES "scales"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scale_diagnostic_info" ADD CONSTRAINT "scale_diagnostic_info_scaleId_fkey" FOREIGN KEY ("scaleId") REFERENCES "scales"("id") ON DELETE SET NULL ON UPDATE CASCADE;
