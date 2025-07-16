import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"

export const getFiles = query({
  args: { orgId: v.id("organizations") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return []

    // check for proper permissions
    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_userId_orgId", (q) =>
        q.eq("userId", userId).eq("orgId", args.orgId),
      )
      .unique()

    if (!membership) {
      throw new Error("User does not have access to this organization")
    }

    return ctx.db
      .query("files")
      .withIndex("by_orgId", (q) => q.eq("orgId", args.orgId))
      .collect()
  },
})

export const createFile = mutation({
  args: {
    name: v.string(),
    orgId: v.id("organizations"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Unauthorized")

    // check if user is a member of the org
    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_userId_orgId", (q) =>
        q.eq("userId", userId).eq("orgId", args.orgId),
      )
      .unique()

    if (!membership) {
      throw new Error("User does not have access to this organization")
    }

    await ctx.db.insert("files", {
      name: args.name,
      orgId: args.orgId,
      storageId: args.storageId,
    })
  },
})
