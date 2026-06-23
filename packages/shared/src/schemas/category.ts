import z from "zod";

export const createCategorySchema = z.object({
  name: z.string().length(20),
});

export type CreateCategorySchema = z.infer<typeof createCategorySchema>;
