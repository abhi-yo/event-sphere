import { hash, compare } from "bcryptjs";

export const PASSWORD_REQUIREMENTS = {
  minLength: 12,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  minSpecialChars: 2,
  minNumbers: 2,
};

export function validatePasswordStrength(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < PASSWORD_REQUIREMENTS.minLength) {
    errors.push(
      `Password must be at least ${PASSWORD_REQUIREMENTS.minLength} characters long`
    );
  }

  if (PASSWORD_REQUIREMENTS.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push("Password must contain at least one uppercase letter");
  }

  if (PASSWORD_REQUIREMENTS.requireLowercase && !/[a-z]/.test(password)) {
    errors.push("Password must contain at least one lowercase letter");
  }

  if (PASSWORD_REQUIREMENTS.requireNumbers) {
    const numberCount = (password.match(/\d/g) || []).length;
    if (numberCount < PASSWORD_REQUIREMENTS.minNumbers) {
      errors.push(
        `Password must contain at least ${PASSWORD_REQUIREMENTS.minNumbers} numbers`
      );
    }
  }

  if (PASSWORD_REQUIREMENTS.requireSpecialChars) {
    const specialCharCount = (
      password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/g) || []
    ).length;
    if (specialCharCount < PASSWORD_REQUIREMENTS.minSpecialChars) {
      errors.push(
        `Password must contain at least ${PASSWORD_REQUIREMENTS.minSpecialChars} special characters`
      );
    }
  }

  const commonPasswords = [
    "password",
    "123456",
    "password123",
    "admin",
    "letmein",
    "welcome",
    "monkey",
    "1234567890",
    "qwerty",
    "abc123",
    "Password1",
    "admin123",
  ];

  if (
    commonPasswords.some((common) =>
      password.toLowerCase().includes(common.toLowerCase())
    )
  ) {
    errors.push("Password contains common patterns and is not secure");
  }

  if (/(.)\1{2,}/.test(password)) {
    errors.push(
      "Password cannot contain more than 2 consecutive identical characters"
    );
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export async function hashPassword(password: string): Promise<string> {
  const saltRounds = 14;
  return await hash(password, saltRounds);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await compare(password, hashedPassword);
}

export function generateSecurePassword(): string {
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";
  const special = "!@#$%^&*()_+-=[]{}|;:,.<>?";

  const allChars = uppercase + lowercase + numbers + special;

  let password = "";

  password += uppercase[Math.floor(Math.random() * uppercase.length)];
  password += lowercase[Math.floor(Math.random() * lowercase.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];
  password += numbers[Math.floor(Math.random() * numbers.length)];
  password += special[Math.floor(Math.random() * special.length)];

  for (let i = 6; i < 16; i++) {
    password += allChars[Math.floor(Math.random() * allChars.length)];
  }

  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

export function validateAdminEmail(email: string): {
  isValid: boolean;
  error?: string;
} {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(email)) {
    return { isValid: false, error: "Invalid email format" };
  }

  if (email.length > 254) {
    return { isValid: false, error: "Email address too long" };
  }

  const localPart = email.split("@")[0];
  if (localPart.length > 64) {
    return { isValid: false, error: "Email local part too long" };
  }

  return { isValid: true };
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>\"']/g, "");
}
