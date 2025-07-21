import { z } from "zod";

export const tourTypeZodSchema = z.object({
    name: z.string({invalid_type_error: "name must be string"}).min(2, {message: "min char 2"})
})

export const updateTourTypeZodSchema = z.object({
    name: z.string({invalid_type_error: "name must be string"}).min(2, {message: "min char 2"})
})


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


export const tourZodSchema = z.object({
    title: z.string({invalid_type_error: "title must be string"}),
    slug: z.string({invalid_type_error: "slug must be string"}),
    description: z.string({invalid_type_error: "description must be string"}),
    images: z.array(z.string()).min(1, {message: "minimum 1 image"}).optional(),
    location: z.string({invalid_type_error: "location must be string"}).optional(),
    costFrom: z.number({invalid_type_error: "costFrom must be number"}).positive().min(1, "starts from 1tk").optional(),
    startDate: z.preprocess((val) => new Date(val as string), z.date()).optional(),
    departureLocation: z.string().optional(),
    arrivalLocation: z.string().optional(),
    endDate: z.preprocess((val) => new Date(val as string), z.date()).optional(),
    included: z.array(z.string({invalid_type_error: "included must be string"})).optional(),
    excluded: z.array(z.string({invalid_type_error: "excluded must be string"})).optional(),
    amenities: z.array(z.string({invalid_type_error: "amenities must be string"})).optional(),
    tourPlan: z.array(z.string({invalid_type_error: "tourPlan must be string"})).optional(),
    maxGuest: z.number({invalid_type_error: "maxGuest must be number"}).positive().max(12, "max 12").int().optional(),
    minAge: z.number({invalid_type_error: "minAge must be number"}).positive().min(15, "min age 15").int().optional(),
    division: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for division"),
    tourType: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for tourType"),
})

export const upadteTourZodSchema = z.object({
    title: z.string({invalid_type_error: "title must be string"}).optional(),
    slug: z.string({invalid_type_error: "slug must be string"}).optional(),
    description: z.string({invalid_type_error: "description must be string"}).optional(),
    images: z.array(z.string()).min(1, {message: "minimum 1 image"}).optional(),
    location: z.string({invalid_type_error: "location must be string"}).optional(),
    costFrom: z.number({invalid_type_error: "costFrom must be number"}).positive().min(1, "starts from 1tk").optional(),
    startDate: z.preprocess((val) => new Date(val as string), z.date()).optional(),
    departureLocation: z.string().optional(),
    arrivalLocation: z.string().optional(),
    endDate: z.preprocess((val) => new Date(val as string), z.date()).optional(),
    included: z.array(z.string({invalid_type_error: "included must be string"})).optional(),
    excluded: z.array(z.string({invalid_type_error: "excluded must be string"})).optional(),
    amenities: z.array(z.string({invalid_type_error: "amenities must be string"})).optional(),
    tourPlan: z.array(z.string({invalid_type_error: "tourPlan must be string"})).optional(),
    maxGuest: z.number({invalid_type_error: "maxGuest must be number"}).positive().max(12, "max 12").int().optional(),
    minAge: z.number({invalid_type_error: "minAge must be number"}).positive().min(15, "min age 15").int().optional(),
    division: z.string({required_error: "division is required"}).regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for division"),
    tourType: z.string({required_error: "tour type is required"}).regex(/^[0-9a-fA-F]{24}$/, "Invalid MongoDB ObjectId for tourType"),
})