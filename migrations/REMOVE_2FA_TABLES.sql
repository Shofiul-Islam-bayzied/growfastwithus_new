-- Migration to remove 2FA-related tables
DROP TABLE IF EXISTS two_factor_auth;
DROP TABLE IF EXISTS two_factor_backup_codes; 