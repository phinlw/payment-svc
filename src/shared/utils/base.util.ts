import * as uuid from "uuid";
import * as b32 from "base32";
import * as CryptoJS from "crypto-js";
import * as bc from "bcryptjs";
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import { Metadata } from '@grpc/grpc-js';
import { ENCRYPT_TEXT_KEY,BACKEND_KEY } from "./env.util";

export function setMetaData() {
  const backendKey = BACKEND_KEY || "";
  if (!backendKey) {
    console.warn('WARNING: BACKEND_KEY is not defined in environment variables');
    console.log('Current NODE_ENV:', process.env.NODE_ENV || 'undefined');
  }

  const metadata = new Metadata();
  metadata.set('platform', "inventory-svc");
  metadata.set('backendkey', backendKey);
  return metadata;
}

export function encodeB32(text: string) {
  return b32.encode(text);
}
export function decodeB32(text: string) {
  return b32.decode(text);
}

export function _ID() {
  return uuid.v4().split("-").join("");
}

export function _UID() {
  return uuid.v4();
}

export enum IEntityStatus {
  active = "active",
  inactive = "inactive",
}

export function customDateTime(time = new Date()) {
  const d = new Date(time);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  const seconds = String(d.getSeconds()).padStart(2, '0');
  return new Date(`${year}-${month}-${day} ${hours}:${minutes}:${seconds}`);
}

export enum IEntity {
  user = "user",
  service_account = "service_account",
  merchant = "merchant",
  merchant_profile = "merchant_profile",
}

export function encryptText(obj: any) {
  try {
    const secretKey = ENCRYPT_TEXT_KEY;
    const key = CryptoJS.enc.Utf8.parse(secretKey);
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(JSON.stringify(obj), key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const cipherText = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
    const ivText = iv.toString(CryptoJS.enc.Base64);
    // const encryptedData = cipherText + ":" + ivText;
    return {
      ivText: ivText,
      cipherText: cipherText,
    };
  } catch (error) {
    throw error;
  }
}

export function decryptText(value: string) {
  try {
    const secretKey = ENCRYPT_TEXT_KEY;
    const key = CryptoJS.enc.Utf8.parse(secretKey);
    const parts = value.split(":");
    const ciphertext1 = CryptoJS.enc.Base64.parse(parts[0]);
    const parsedIv = CryptoJS.enc.Base64.parse(parts[1]);
    const decrypted = CryptoJS.AES.decrypt({ ciphertext: ciphertext1 }, key, {
      iv: parsedIv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    const decryptData = decrypted.toString(CryptoJS.enc.Utf8);
    const decryptedHeaders = JSON.parse(decryptData);
    return decryptedHeaders;
  } catch (error) {
    throw error;
  }
}

export function validateUID(uid: string) {
  let s: any = "" + uid;

  s = s.match(
    "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
  );
  if (s === null) {
    return false;
  }
  return true;
}

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  message?: string;
}

// Validation options interface
export interface ValidationOptions {
  minLength?: number;
  maxLength?: number;
  required?: boolean;
  allowEmpty?: boolean;
}

// Password validation options
export interface PasswordOptions extends ValidationOptions {
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSpecialChars?: boolean;
}

// Text validation
export function validateText(text: string, options: ValidationOptions = {}): ValidationResult {
  const { minLength = 0, maxLength = Infinity, required = false, allowEmpty = true } = options;

  if (required && (!text || text.trim().length === 0)) {
    return { isValid: false, message: 'Text is required' };
  }

  if (!text) {
    return { isValid: true };
  }

  if (!allowEmpty && text.trim().length === 0) {
    return { isValid: false, message: 'Text cannot be empty' };
  }

  if (text.length < minLength) {
    return { isValid: false, message: `Text must be at least ${minLength} characters long` };
  }

  if (text.length > maxLength) {
    return { isValid: false, message: `Text must not exceed ${maxLength} characters` };
  }

  return { isValid: true };
}

// Email validation
export function validateEmail(email: string, options: ValidationOptions = {}): ValidationResult {
  const { required = false } = options;

  if (required && (!email || email.trim().length === 0)) {
    return { isValid: false, message: 'Email is required' };
  }

  if (!email || email.trim().length === 0) {
    return { isValid: true }; // Allow empty if not required
  }

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$/;
  
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }

  return { isValid: true };
}

// Password validation
export function validatePassword(password: string, options: PasswordOptions = {}): ValidationResult {
  const {
    minLength = 8,
    maxLength = 128,
    required = true,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true
  } = options;

  if (required && (!password || password.length === 0)) {
    return { isValid: false, message: 'Password is required' };
  }

  if (!password || password.length === 0) {
    return { isValid: true }; // Allow empty if not required
  }

  if (password.length < minLength) {
    return { isValid: false, message: `Password must be at least ${minLength} characters long` };
  }

  if (password.length > maxLength) {
    return { isValid: false, message: `Password must not exceed ${maxLength} characters` };
  }

  if (requireUppercase && !/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }

  if (requireLowercase && !/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }

  if (requireNumbers && !/d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }

  return { isValid: true };
}

// Phone number validation
export function validatePhone(phone: string, options: ValidationOptions = {}): ValidationResult {
  const { required = false } = options;

  if (required && (!phone || phone.trim().length === 0)) {
    return { isValid: false, message: 'Phone number is required' };
  }

  if (!phone || phone.trim().length === 0) {
    return { isValid: true }; // Allow empty if not required
  }

  // Remove all non-digit characters for validation
  const digitsOnly = phone.replace(/D/g, '');
  
  // Check for common phone number patterns (10-15 digits)
  if (digitsOnly.length < 10 || digitsOnly.length > 15) {
    return { isValid: false, message: 'Please enter a valid phone number' };
  }

  return { isValid: true };
}

// URL validation
export function validateURL(url: string, options: ValidationOptions = {}): ValidationResult {
  const { required = false } = options;

  if (required && (!url || url.trim().length === 0)) {
    return { isValid: false, message: 'URL is required' };
  }

  if (!url || url.trim().length === 0) {
    return { isValid: true }; // Allow empty if not required
  }

  try {
    new URL(url.trim());
    return { isValid: true };
  } catch {
    return { isValid: false, message: 'Please enter a valid URL' };
  }
}

// Numeric validation
export function validateNumber(value: string | number, options: { min?: number; max?: number; required?: boolean; allowDecimals?: boolean } = {}): ValidationResult {
  const { min = -Infinity, max = Infinity, required = false, allowDecimals = true } = options;

  if (required && (value === null || value === undefined || value === '')) {
    return { isValid: false, message: 'Number is required' };
  }

  if (value === null || value === undefined || value === '') {
    return { isValid: true }; // Allow empty if not required
  }

  const num = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(num)) {
    return { isValid: false, message: 'Please enter a valid number' };
  }

  if (!allowDecimals && num % 1 !== 0) {
    return { isValid: false, message: 'Please enter a whole number' };
  }

  if (num < min) {
    return { isValid: false, message: `Number must be at least ${min}` };
  }

  if (num > max) {
    return { isValid: false, message: `Number must not exceed ${max}` };
  }

  return { isValid: true };
}

// Date validation
export function validateDate(date: string | Date, options: { required?: boolean; minDate?: Date; maxDate?: Date } = {}): ValidationResult {
  const { required = false, minDate, maxDate } = options;

  if (required && (!date || (typeof date === 'string' && date.trim().length === 0))) {
    return { isValid: false, message: 'Date is required' };
  }

  if (!date || (typeof date === 'string' && date.trim().length === 0)) {
    return { isValid: true }; // Allow empty if not required
  }

  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return { isValid: false, message: 'Please enter a valid date' };
  }

  if (minDate && dateObj < minDate) {
    return { isValid: false, message: `Date must be after ${minDate.toDateString()}` };
  }

  if (maxDate && dateObj > maxDate) {
    return { isValid: false, message: `Date must be before ${maxDate.toDateString()}` };
  }

  return { isValid: true };
}

// Credit card validation (basic Luhn algorithm)
export function validateCreditCard(cardNumber: string, options: ValidationOptions = {}): ValidationResult {
  const { required = false } = options;

  if (required && (!cardNumber || cardNumber.trim().length === 0)) {
    return { isValid: false, message: 'Credit card number is required' };
  }

  if (!cardNumber || cardNumber.trim().length === 0) {
    return { isValid: true }; // Allow empty if not required
  }

  // Remove spaces and dashes
  const cleanNumber = cardNumber.replace(/[s-]/g, '');

  // Check if it contains only digits
  if (!/^d+$/.test(cleanNumber)) {
    return { isValid: false, message: 'Credit card number must contain only digits' };
  }

  // Check length (most cards are 13-19 digits)
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return { isValid: false, message: 'Credit card number must be between 13 and 19 digits' };
  }

  // Luhn algorithm validation
  let sum = 0;
  let isEven = false;

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  if (sum % 10 !== 0) {
    return { isValid: false, message: 'Please enter a valid credit card number' };
  }

  return { isValid: true };
}

// Username validation
export function validateUsername(username: string, options: ValidationOptions = {}): ValidationResult {
  const { minLength = 3, maxLength = 30, required = true } = options;

  if (required && (!username || username.trim().length === 0)) {
    return { isValid: false, message: 'Username is required' };
  }

  if (!username || username.trim().length === 0) {
    return { isValid: true }; // Allow empty if not required
  }

  if (username.length < minLength) {
    return { isValid: false, message: `Username must be at least ${minLength} characters long` };
  }

  if (username.length > maxLength) {
    return { isValid: false, message: `Username must not exceed ${maxLength} characters` };
  }

  // Username should contain only alphanumeric characters, underscores, and hyphens
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return { isValid: false, message: 'Username can only contain letters, numbers, underscores, and hyphens' };
  }

  // Username should not start or end with underscore or hyphen
  if (/^[_-]|[_-]$/.test(username)) {
    return { isValid: false, message: 'Username cannot start or end with underscore or hyphen' };
  }

  return { isValid: true };
}

// Multiple validation helper
export function validateMultiple(validations: { [key: string]: ValidationResult }): { isValid: boolean; errors: { [key: string]: string } } {
  const errors: { [key: string]: string } = {};
  let isValid = true;

  for (const [field, result] of Object.entries(validations)) {
    if (!result.isValid) {
      isValid = false;
      if (result.message) {
        errors[field] = result.message;
      }
    }
  }

  return { isValid, errors };
}

// gRPC Error response interface
export interface GrpcErrorResponse {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
}

// Error types enum
export enum ErrorType {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DATABASE_ERROR = 'DATABASE_ERROR',
  BUSINESS_LOGIC_ERROR = 'BUSINESS_LOGIC_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// Parse validation errors from error message
export function parseValidationErrors(errorMessage: string): any {
  try {
    // Extract validation details from error message
    const validationPart = errorMessage.replace('Validation failed: ', '');
    const errors = validationPart.split(', ');
    const parsedErrors: { [key: string]: string } = {};

    errors.forEach(error => {
      const [field, message] = error.split(': ');
      if (field && message) {
        parsedErrors[field] = message;
      }
    });

    return parsedErrors;
  } catch {
    return { general: errorMessage };
  }
}

// Create gRPC error response
export function createGrpcError(error: any, operation: string): RpcException {
  const timestamp = new Date().toISOString();
  let grpcStatus = status.INTERNAL;
  let errorResponse: GrpcErrorResponse;
  
  // Handle validation errors
  if (error.message && error.message.includes('Validation failed:')) {
    grpcStatus = status.INVALID_ARGUMENT;
    errorResponse = {
      code: ErrorType.VALIDATION_ERROR,
      message: error.message,
      details: parseValidationErrors(error.message),
      timestamp
    };
  }
  // Handle MongoDB/Database errors
  else if (error.name === 'MongoError' || error.name === 'ValidationError' || error.code === 11000) {
    let message = 'Database operation failed';
    let details = {};

    if (error.code === 11000) {
      message = 'Duplicate entry found';
      details = { duplicateKey: error.keyValue };
      grpcStatus = status.ALREADY_EXISTS;
    } else if (error.name === 'ValidationError') {
      message = 'Database validation failed';
      details = error.errors;
      grpcStatus = status.INVALID_ARGUMENT;
    } else {
      grpcStatus = status.INTERNAL;
    }

    errorResponse = {
      code: ErrorType.DATABASE_ERROR,
      message,
      details,
      timestamp
    };
  }
  // Handle business logic errors
  else if (error.message && (
    error.message.includes('already exists') ||
    error.message.includes('not found') ||
    error.message.includes('required when')
  )) {
    if (error.message.includes('not found')) {
      grpcStatus = status.NOT_FOUND;
    } else {
      grpcStatus = status.FAILED_PRECONDITION;
    }
    
    errorResponse = {
      code: ErrorType.BUSINESS_LOGIC_ERROR,
      message: error.message,
      timestamp
    };
  }
  // Handle network/connection errors
  else if (error.name === 'MongoNetworkError' || error.name === 'MongoTimeoutError') {
    grpcStatus = status.UNAVAILABLE;
    errorResponse = {
      code: ErrorType.NETWORK_ERROR,
      message: 'Database connection failed',
      timestamp
    };
  }
  // Default unknown error
  else {
    grpcStatus = status.INTERNAL;
    errorResponse = {
      code: ErrorType.UNKNOWN_ERROR,
      message: `${operation} failed: ${error.message || 'Unknown error occurred'}`,
      timestamp
    };
  }

  return new RpcException({
    code: grpcStatus,
    message: JSON.stringify(errorResponse)
  });
}

// Global error handler wrapper for async operations
export async function handleGrpcOperation<T>(
  operation: () => Promise<T>,
  operationName: string
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.log(`ERROR ${operationName}:`, error?.message);
    throw createGrpcError(error, operationName);
  }
}

const p = bc.hashSync(
  "f34d4d7e-2afa-42ed-a7f8-26853ce9f035" + "1234",
  bc.genSaltSync()
);