import { z } from 'zod';

// Accept MongoDB ObjectId-like values and coerce to string
export const ObjectIdSchema = z.preprocess((val) => {
  if (val == null) return val;
  if (typeof val === 'string') return val;
  try {
    // Some ObjectId implementations have a toString method
    return (val as any).toString();
  } catch (e) {
    return val;
  }
}, z.string());

// Accept Date or ISO string and coerce to Date
export const DateLikeSchema = z.preprocess((val) => {
  if (val instanceof Date) return val;
  if (typeof val === 'string' || typeof val === 'number') return new Date(val);
  return val;
}, z.date());
