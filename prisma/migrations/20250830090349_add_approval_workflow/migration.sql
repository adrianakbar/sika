/*
  Warnings:

  - The values [UNDER_REVIEW,APPROVED,REJECTED] on the enum `permit_planning_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `permit_planning` ADD COLUMN `aa_approved_at` DATETIME(3) NULL,
    ADD COLUMN `aa_approved_by` INTEGER NULL,
    ADD COLUMN `aa_comments` TEXT NULL,
    ADD COLUMN `cc_approved_at` DATETIME(3) NULL,
    ADD COLUMN `cc_approved_by` INTEGER NULL,
    ADD COLUMN `cc_comments` TEXT NULL,
    ADD COLUMN `rejected_at` DATETIME(3) NULL,
    ADD COLUMN `rejected_by` INTEGER NULL,
    ADD COLUMN `rejection_reason` TEXT NULL,
    MODIFY `status` ENUM('DRAFT', 'SUBMITTED', 'PENDING_AA_APPROVAL', 'PENDING_CC_APPROVAL', 'AA_APPROVED', 'FULLY_APPROVED', 'REJECTED_BY_AA', 'REJECTED_BY_CC', 'ACTIVE', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE `users` MODIFY `role` ENUM('ADMIN', 'USER', 'PTWC', 'AA', 'CC') NOT NULL DEFAULT 'USER';

-- AddForeignKey
ALTER TABLE `permit_planning` ADD CONSTRAINT `permit_planning_aa_approved_by_fkey` FOREIGN KEY (`aa_approved_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permit_planning` ADD CONSTRAINT `permit_planning_cc_approved_by_fkey` FOREIGN KEY (`cc_approved_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `permit_planning` ADD CONSTRAINT `permit_planning_rejected_by_fkey` FOREIGN KEY (`rejected_by`) REFERENCES `users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
