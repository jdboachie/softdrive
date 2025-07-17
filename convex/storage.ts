import { v } from "convex/values"
import { query, mutation } from "./_generated/server"
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

export const getMetadata = query({
  args: {
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.system.get(args.storageId);
  },
});

export const getFileUrl = query({
  args: {
    src: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      console.error("Unauthorized")
      return null
    }
    return await ctx.storage.getUrl(args.src);
  },
});