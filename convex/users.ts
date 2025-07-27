import { v } from "convex/values"
import { query } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"

export const getCurrentUser = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      console.error("Unauthorized")
      return null
    }
    return await ctx.db.get(userId)
  },
})

export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      console.error("Unauthorized")
      return null
    }
    return await ctx.db.get(args.userId)
  }
})