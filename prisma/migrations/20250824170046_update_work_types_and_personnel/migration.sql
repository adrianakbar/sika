/*
  Warnings:

  - The values [HOT_WORK,CONFINED_SPACE,HEIGHT_WORK,EXCAVATION,ELECTRICAL,MAINTENANCE,CONSTRUCTION] on the enum `permit_planning_workType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `permit_planning` ADD COLUMN `area_authority` VARCHAR(255) NULL,
    ADD COLUMN `company` VARCHAR(255) NULL,
    ADD COLUMN `performing_authority` VARCHAR(255) NULL,
    ADD COLUMN `site_controller_name` VARCHAR(255) NULL,
    MODIFY `workType` ENUM('COLD_WORK', 'COLD_WORK_BREAKING', 'HOT_WORK_SPARK', 'HOT_WORK_FLAME') NULL;
