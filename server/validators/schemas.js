const { z } = require('zod');

/**
 * STEP 5: Zod validation schemas for request bodies
 * Ensures type-safe and validated input
 */

// Auth schemas
const registerSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .trim(),
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(100, 'Password is too long'),
  role: z
    .enum(['citizen', 'lawyer', 'judge', 'police'])
    .optional()
    .default('citizen'),
});

const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(1, 'Password is required'),
  role: z
    .enum(['citizen', 'lawyer', 'judge', 'police', 'admin'])
    .optional(),
});

const refreshTokenSchema = z.object({
  refreshToken: z
    .string()
    .optional(),
});

const updateProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .trim()
    .optional(),
  email: z
    .string()
    .email('Invalid email address')
    .toLowerCase()
    .trim()
    .optional(),
  profilePic: z
    .string()
    .url('Profile picture must be a valid URL')
    .optional()
    .nullable(),
  phone: z
    .string()
    .regex(/^\+?[0-9\-\s()]+$/, 'Invalid phone number')
    .optional(),
  address: z
    .string()
    .max(200, 'Address is too long')
    .optional(),
  city: z
    .string()
    .max(50, 'City name is too long')
    .optional(),
  // Lawyer-specific fields
  licenseNumber: z
    .string()
    .optional(),
  specialization: z
    .string()
    .optional(),
  officeAddress: z
    .string()
    .optional(),
  experience: z
    .number()
    .min(0, 'Experience cannot be negative')
    .optional(),
  // Judge-specific fields
  courtName: z
    .string()
    .optional(),
  // Police-specific fields
  badgeNumber: z
    .string()
    .optional(),
  division: z
    .string()
    .optional(),
  rank: z
    .string()
    .optional(),
  yearsOfService: z
    .number()
    .min(0, 'Years of service cannot be negative')
    .optional(),
  department: z
    .string()
    .optional(),
  // Password change
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .optional(),
});

// Case schemas
const createCaseSchema = z.object({
  title: z
    .string()
    .min(5, 'Case title must be at least 5 characters')
    .max(200, 'Case title is too long'),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(2000, 'Description is too long'),
  caseType: z
    .enum(['civil', 'criminal', 'commercial', 'family', 'other'])
    .optional()
    .default('other'),
  priority: z
    .enum(['low', 'medium', 'high', 'urgent'])
    .optional()
    .default('medium'),
  documents: z
    .array(z.object({
      name: z.string(),
      url: z.string().url(),
    }))
    .optional()
    .default([]),
});

// Appointment schemas
const createAppointmentSchema = z.object({
  appointmentDate: z
    .string()
    .datetime('Invalid date format')
    .refine(date => new Date(date) > new Date(), 'Appointment must be in the future'),
  duration: z
    .number()
    .min(15, 'Appointment must be at least 15 minutes')
    .max(480, 'Appointment cannot exceed 8 hours'),
  notes: z
    .string()
    .max(500, 'Notes must be less than 500 characters')
    .optional(),
  type: z
    .enum(['consultation', 'hearing', 'meeting', 'other'])
    .optional()
    .default('consultation'),
});

module.exports = {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  updateProfileSchema,
  createCaseSchema,
  createAppointmentSchema,
};