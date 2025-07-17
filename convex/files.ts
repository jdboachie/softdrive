import { v } from "convex/values"
import { internalMutation, mutation, query } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"

export const getFiles = query({
  args: {
    orgId: v.id("organizations"),
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return []

    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_userId_orgId", (q) =>
        q.eq("userId", userId).eq("orgId", args.orgId),
      )
      .unique()

    if (!membership) {
      throw new Error("User does not have access to this organization")
    }

    const files = await ctx.db
      .query("files")
      .withIndex("by_orgId_trashed", (q) =>
        q.eq("orgId", args.orgId).eq("trashed", false),
      )
      .order("desc")
      .collect()

    if (!args.searchQuery) return files

    const searchLower = args.searchQuery.toLowerCase()

    return files.filter((file) =>
      file.name?.toLowerCase().includes(searchLower),
    )
  },
})

export const getTrashedFiles = query({
  args: {
    orgId: v.id("organizations"),
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return []

    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_userId_orgId", (q) =>
        q.eq("userId", userId).eq("orgId", args.orgId),
      )
      .unique()

    if (!membership) {
      throw new Error("User does not have access to this organization")
    }

    const files = await ctx.db
      .query("files")
      .withIndex("by_orgId_trashed", (q) =>
        q.eq("orgId", args.orgId).eq("trashed", true)
      )
      .collect()

    if (args.searchQuery?.trim()) {
      const searchLower = args.searchQuery.toLowerCase()
      return files.filter((file) =>
        file.name?.toLowerCase().includes(searchLower)
      )
    }

    return files
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
      author: userId,
      orgId: args.orgId,
      trashed: false,
      storageId: args.storageId,
    })
  },
})

export const trashFile = mutation({
  args: {
    fileId: v.id("files"),
    orgId: v.id("organizations"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Unauthorized")

    const file = await ctx.db.get(args.fileId)
    if (!file) throw new Error("File not found")

    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_userId_orgId", (q) =>
        q.eq("userId", userId).eq("orgId", args.orgId),
      )
      .unique()

    if (!membership) {
      return
    }

    const allowed = membership.role === "write" || membership.role === "admin"

    if (!allowed) throw new Error("No permission to trash this file")

    await ctx.db.patch(args.fileId, {
      trashed: true,
      trashedAt: Date.now(),
    })
  },
})

export const deleteTrashedFilesViaCron = internalMutation({
  handler: async (ctx) => {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000

    const oldFiles = await ctx.db
      .query("files")
      .withIndex("by_orgId_trashed")
      .filter((f) =>
        f.and(
          f.eq(f.field("trashed"), true),
          f.lt(f.field("trashedAt"), cutoff),
        ),
      )
      .collect()

    for (const file of oldFiles) {
      console.info(`Deleting ${file.name}`)
      await ctx.db.delete(file._id)
      await ctx.storage.delete(file.storageId)
    }
  },
})
