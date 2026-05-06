-- Consolidated Migration: Profile Picture & Booking System Upgrade

-- 1. Fix missing profile_picture_url in trainers (if V2 was modified later)
ALTER TABLE trainers ADD COLUMN IF NOT EXISTS profile_picture_url LONGTEXT;

-- 2. Upgrade Booking System to support custom dates
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS scheduled_at DATETIME;

-- 3. Populate scheduled_at for existing records
UPDATE bookings SET scheduled_at = booked_at WHERE scheduled_at IS NULL;

-- 4. Make schedule_id nullable and update constraints
ALTER TABLE bookings MODIFY COLUMN scheduled_at DATETIME NOT NULL;
ALTER TABLE bookings DROP FOREIGN KEY IF EXISTS fk_bookings_schedule;
ALTER TABLE bookings MODIFY COLUMN schedule_id BIGINT NULL;
ALTER TABLE bookings ADD CONSTRAINT fk_bookings_schedule FOREIGN KEY (schedule_id) REFERENCES schedules(id) ON DELETE SET NULL;
