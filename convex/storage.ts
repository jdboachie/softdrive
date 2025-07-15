import { mutation } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"

export const generateUploadUrl = mutation({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      console.error("Unauthorized")
      return null
    }
    return await ctx.storage.generateUploadUrl()
  },
})
