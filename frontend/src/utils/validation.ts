import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  avatar: z.string().url().optional(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  price: z.number().positive(),
  imageUrl: z.string().url(),
  stock: z.number().int().nonnegative(),
  likesCount: z.number().int().nonnegative(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export const validateApiResponse = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
  return schema.parse(data);
};
