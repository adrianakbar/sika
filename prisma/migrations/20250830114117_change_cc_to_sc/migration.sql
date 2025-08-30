/*
  Warnings:

  - Changing CC role to SC role
  - Changing PENDING_CC_APPROVAL to PENDING_SC_APPROVAL
  - Changing REJECTED_BY_CC to REJECTED_BY_SC
  - Renaming cc_* columns to sc_* columns while preserving data

*/

-- First, update enum values in the data before changing the enum definition
UPDATE `permit_planning` SET `status` = 'PENDING_SC_APPROVAL' WHERE `status` = 'PENDING_CC_APPROVAL';
UPDATE `permit_planning` SET `status` = 'REJECTED_BY_SC' WHERE `status` = 'REJECTED_BY_CC';
UPDATE `users` SET `role` = 'SC' WHERE `role` = 'CC';

-- DropForeignKey
ALTER TABLE `permit_planning` DROP FOREIGN KEY `permit_planning_cc_approved_by_fkey`;

-- Add new columns
ALTER TABLE `permit_planning` 
    ADD COLUMN `sc_approved_at` DATETIME(3) NULL,
    ADD COLUMN `sc_approved_by` INTEGER NULL,
    ADD COLUMN `sc_comments` TEXT NULL;

-- Copy data from old columns to new columns
UPDATE `permit_planning` SET 
    `sc_approved_at` = `cc_approved_at`,
    `sc_approved_by` = `cc_approved_by`,
    `sc_comments` = `cc_comments`
WHERE `cc_approved_by` IS NOT NULL;

-- Drop old columns
ALTER TABLE `permit_planning` 
    DROP COLUMN `cc_approved_at`,
    DROP COLUMN `cc_approved_by`,
    DROP COLUMN `cc_comments`;

-- Update enum definitions
ALTER TABLE `permit_planning` 
    MODIFY `status` ENUM('DRAFT', 'SUBMITTED', 'PENDING_AA_APPROVAL', 'PENDING_SC_APPROVAL', 'AA_APPROVED', 'FULLY_APPROVED', 'REJECTED_BY_AA', 'REJECTED_BY_SC', 'ACTIVE', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT';

ALTER TABLE `users` 
    MODIFY `role` ENUM('ADMIN', 'USER', 'PTWC', 'AA', 'SC') NOT NULL DEFAULT 'USER';

-- AddForeignKey
ALTER TABLE `permit_planning` ADD CONSTRAINT `permit_planning_sc_approved_by_fkey` FOREIGN KEY (`sc_approved_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
