/**
 * Environment Variable Validation
 * Validates all required environment variables at startup
 * Exits the application if critical variables are missing or invalid in production
 */

interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const MIN_SECRET_LENGTH = 32;

/**
 * Validates that a secret meets minimum security requirements
 */
function validateSecret(secret: string | undefined, name: string): { valid: boolean; error?: string } {
  if (!secret) {
    return { valid: false, error: `${name} is required` };
  }
  
  if (secret.length < MIN_SECRET_LENGTH) {
    return { 
      valid: false, 
      error: `${name} must be at least ${MIN_SECRET_LENGTH} characters long (current: ${secret.length})` 
    };
  }
  
  // Check for common weak secrets
  const weakSecrets = ['supersecret', 'secret', 'password', 'changeme', 'default'];
  if (weakSecrets.some(weak => secret.toLowerCase().includes(weak))) {
    return { 
      valid: false, 
      error: `${name} appears to be a weak/default secret. Please use a strong random string.` 
    };
  }
  
  return { valid: true };
}

/**
 * Validates all environment variables
 */
export function validateEnvironment(): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];
  const isProduction = process.env.NODE_ENV === 'production';

  // Required in all environments
  if (!process.env.DATABASE_URL) {
    errors.push('DATABASE_URL is required');
  }

  // Required in production
  if (isProduction) {
    // Validate SESSION_SECRET
    const sessionSecretValidation = validateSecret(process.env.SESSION_SECRET, 'SESSION_SECRET');
    if (!sessionSecretValidation.valid) {
      errors.push(sessionSecretValidation.error!);
    }

    // Validate JWT_SECRET
    const jwtSecretValidation = validateSecret(process.env.JWT_SECRET, 'JWT_SECRET');
    if (!jwtSecretValidation.valid) {
      errors.push(jwtSecretValidation.error!);
    }

    // Validate FRONTEND_URL is set
    if (!process.env.FRONTEND_URL) {
      errors.push('FRONTEND_URL is required in production (used for password reset links)');
    } else if (!process.env.FRONTEND_URL.startsWith('https://')) {
      warnings.push('FRONTEND_URL should use HTTPS in production');
    }

    // Validate PORT is set
    if (!process.env.PORT) {
      warnings.push('PORT not set, defaulting to 5000');
    }
  } else {
    // Development warnings
    const sessionSecretValidation = validateSecret(process.env.SESSION_SECRET, 'SESSION_SECRET');
    if (!sessionSecretValidation.valid && process.env.SESSION_SECRET) {
      warnings.push(`SESSION_SECRET: ${sessionSecretValidation.error}`);
    }

    const jwtSecretValidation = validateSecret(process.env.JWT_SECRET, 'JWT_SECRET');
    if (!jwtSecretValidation.valid && process.env.JWT_SECRET) {
      warnings.push(`JWT_SECRET: ${jwtSecretValidation.error}`);
    }
  }

  // Optional but recommended
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    warnings.push('SMTP configuration not set. Email features (password reset, notifications) will not work.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Validates environment and exits if critical errors in production
 */
export function validateAndExitIfInvalid(): void {
  const result = validateEnvironment();
  const isProduction = process.env.NODE_ENV === 'production';

  // Log warnings
  if (result.warnings.length > 0) {
    console.warn('\n⚠️  Environment Variable Warnings:');
    result.warnings.forEach(warning => {
      console.warn(`   - ${warning}`);
    });
    console.warn('');
  }

  // Log errors and exit in production
  if (result.errors.length > 0) {
    console.error('\n❌ Environment Variable Validation Failed:\n');
    result.errors.forEach(error => {
      console.error(`   - ${error}`);
    });
    console.error('\n💡 Please set the required environment variables and restart the application.\n');
    
    if (isProduction) {
      console.error('🚫 Exiting due to missing/invalid environment variables in production mode.\n');
      process.exit(1);
    } else {
      console.warn('⚠️  Continuing in development mode, but these should be fixed before production.\n');
    }
  }

  if (result.valid && isProduction) {
    console.log('✅ Environment variables validated successfully\n');
  }
}

/**
 * Generates a secure random secret
 */
export function generateSecureSecret(length: number = 64): string {
  const crypto = require('crypto');
  return crypto.randomBytes(length).toString('hex');
}

