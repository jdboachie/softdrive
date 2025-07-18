import { v } from "convex/values"
import { internalMutation, mutation, query } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"

export const getFiles = query({
  args: {
    teamId: v.id("teams"),
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return []

    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_userId_teamId", (q) =>
        q.eq("userId", userId).eq("teamId", args.teamId),
      )
      .unique()

    if (!membership) {
      throw new Error("User does not have access to this team")
    }

    const files = await ctx.db
      .query("files")
      .withIndex("by_teamId_trashed", (q) =>
        q.eq("teamId", args.teamId).eq("trashed", false),
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
    teamId: v.id("teams"),
    searchQuery: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return []

    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_userId_teamId", (q) =>
        q.eq("userId", userId).eq("teamId", args.teamId),
      )
      .unique()

    if (!membership) {
      throw new Error("User does not have access to this team")
    }

    const files = await ctx.db
      .query("files")
      .withIndex("by_teamId_trashed", (q) =>
        q.eq("teamId", args.teamId).eq("trashed", true)
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
    size: v.number(),
    type: v.string(),
    teamId: v.id("teams"),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Unauthorized")

    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_userId_teamId", (q) =>
        q.eq("userId", userId).eq("teamId", args.teamId),
      )
      .unique()

    if (!membership) {
      throw new Error("User does not have access to this team")
    }

    await ctx.db.insert("files", {
      name: args.name,
      type: args.type,
      size: args.size,
      author: userId,
      teamId: args.teamId,
      trashed: false,
      storageId: args.storageId,
    })
  },
})

export const trashFile = mutation({
  args: {
    fileId: v.id("files"),
    teamId: v.id("teams"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Unauthorized")

    const file = await ctx.db.get(args.fileId)
    if (!file) throw new Error("File not found")

    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_userId_teamId", (q) =>
        q.eq("userId", userId).eq("teamId", args.teamId),
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

export const restoreFile = mutation({
  args: {
    fileId: v.id("files"),
    teamId: v.id("teams"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Unauthorized")

    const file = await ctx.db.get(args.fileId)
    if (!file) throw new Error("File not found")

    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_userId_teamId", (q) =>
        q.eq("userId", userId).eq("teamId", args.teamId),
      )
      .unique()

    if (!membership || membership.role !== "admin") { // or write
      throw new Error("No permission to restore this file")
    }

    await ctx.db.patch(args.fileId, {
      trashed: false,
      trashedAt: undefined,
    })
  },
})

export const deleteFilePermanently = mutation({
  args: {
    fileId: v.id("files"),
    teamId: v.id("teams"),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Unauthorized")

    const file = await ctx.db.get(args.fileId)
    if (!file) throw new Error("File not found")

    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_userId_teamId", (q) =>
        q.eq("userId", userId).eq("teamId", args.teamId),
      )
      .unique()

    if (!membership || membership.role !== "admin") { // or write
      throw new Error("No permission to delete this file")
    }

    await ctx.storage.delete(file.storageId)
    await ctx.db.delete(file._id)
  }
})

export const deleteTrashedFilesViaCron = internalMutation({
  handler: async (ctx) => {
    const cutoff = Date.now() - 30 * 24 * 60 * 60 * 1000

    const oldFiles = await ctx.db
      .query("files")
      .withIndex("by_teamId_trashed")
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
