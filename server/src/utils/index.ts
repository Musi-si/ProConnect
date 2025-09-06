import { isEmail, isEmpty } from 'validator';

export const validateEmail = (email: string): boolean => {
  return isEmail(email);
};

export const validateRequiredFields = (fields: Record<string, any>): boolean => {
  return Object.values(fields).every(field => !isEmpty(field));
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const generateRandomString = (length: number): string => {
  return Math.random().toString(36).substring(2, length + 2);
};