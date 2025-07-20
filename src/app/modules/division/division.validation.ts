import { z } from "zod";

export const divisionZodSchema = z.object({
    name: z.string({invalid_type_error: "Name must be string"}).max(20, {message: "character max 20"}).min(2, "minimum 2 char"),
    slug: z.string({invalid_type_error: "slug must be string"}).max(20, {message: "character max 20"}).min(2, "minimum 2 char"),
    thumbnail: z.string().optional(),
    description: z.string().optional(),
})

export const updateDivisionZodSchema = z.object({
    name: z.string({invalid_type_error: "Name must be string"}).max(20, {message: "character max 20"}).min(2, "minimum 2 char").optional(),
    slug: z.string({invalid_type_error: "slug must be string"}).max(20, {message: "character max 20"}).min(2, "minimum 2 char").optional(),
    thumbnail: z.string().optional(),
    description: z.string().optional(),
})