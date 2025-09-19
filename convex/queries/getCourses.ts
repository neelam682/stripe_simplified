// convex/queries/getCourses.ts
import { query } from "../_generated/server";

export const getCourses = query(async (ctx) => {
    return await ctx.db.query("courses").collect();
});
