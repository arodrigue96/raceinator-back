import { z } from "zod";

const text = (min: number, max: number) => z.string().trim().min(min).max(max);

const relativeImagePath = /^\/images\/teams\/[a-z0-9-]+\.webp$/;
const httpsUrl = z.url({ protocol: /^https$/, hostname: z.regexes.domain });

export const teamBodySchema = z
  .object({
    name: text(2, 60),
    ridersNames: z.array(text(2, 60)).min(1).max(4),
    championshipTitles: z.int().min(0).max(99),
    debutYear: z
      .int()
      .min(1949)
      .refine((year) => year <= new Date().getFullYear(), {
        message: "Debut year can't be in the future",
      }),
    imageUrl: z
      .string()
      .max(500)
      .refine(
        (url) => relativeImagePath.test(url) || httpsUrl.safeParse(url).success,
        { message: "Must be an https URL or /images/teams/<name>.webp" },
      ),
    altImageText: text(2, 150),
    description: text(10, 1000),
    isOfficialTeam: z.boolean(),
  })
  .strict();

export const teamIdParamsSchema = z.object({
  _id: z.string().regex(/^[a-f\d]{24}$/i, { message: "ID is not correct" }),
});
