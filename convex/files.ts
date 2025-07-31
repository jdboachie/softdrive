import { v } from "convex/values"
import { getAuthUserId } from "@convex-dev/auth/server"
import { paginationOptsValidator } from "convex/server"
import {
  internalMutation,
  mutation,
  query,
  MutationCtx,
} from "./_generated/server"
import { Id } from "./_generated/dataModel"

async function getBreadcrumbs(
  ctx: MutationCtx,
  parentId?: Id<"files">
): Promise<{ folderId: Id<"files">; folderName: string }[]> {
  if (!parentId) return []
  const parent = await ctx.db.get(parentId)
  if (!parent) return []
  const parentCrumbs = parent.breadcrumbs ?? []
  return [...parentCrumbs, { folderId: parent._id, folderName: parent.name }]
}

export const getFileById = query({
  args: { id: v.id("files") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id)
  },
})

export const getFolders = query({
  args: {
    teamId: v.id("teams"),
    excludeFileId: v.optional(v.id("files")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return []

    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_userId_teamId", (q) =>
        q.eq("userId", userId).eq("teamId", args.teamId)
      )
      .unique()

    if (!membership) {
      throw new Error("User does not have access to this team")
    }

    const folders = await ctx.db
      .query("files")
      .withIndex("by_teamId_trashed", (q) =>
        q.eq("teamId", args.teamId).eq("trashed", false)
      )
      .filter((q) =>
        q.and(
          q.eq(q.field("isFolder"), true),
          args.excludeFileId ? q.neq(q.field("_id"), args.excludeFileId) : true
        )
      )
      .order("asc")
      .collect()

    return folders
  },
})

export const getFiles = query({
  args: {
    teamId: v.id("teams"),
    parentId: v.optional(v.id("files")),
    searchQuery: v.optional(v.string()),
    type: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return []

    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_userId_teamId", (q) =>
        q.eq("userId", userId).eq("teamId", args.teamId)
      )
      .unique()

    if (!membership) {
      throw new Error("User does not have access to this team")
    }

    const hasSearch = Boolean(args.searchQuery)
    const useTypeFilter = Boolean(args.type)

    const files = await (() => {
      if (hasSearch) {
        if (useTypeFilter) {
          return ctx.db
            .query("files")
            .withIndex("by_teamId_trashed_type", (q) =>
              q
                .eq("teamId", args.teamId)
                .eq("trashed", false)
                .eq("type", args.type!)
            )
            .order("desc")
            .collect()
        } else {
          return ctx.db
            .query("files")
            .withIndex("by_teamId_trashed", (q) =>
              q.eq("teamId", args.teamId).eq("trashed", false)
            )
            .order("desc")
            .collect()
        }
      } else {
        if (useTypeFilter) {
          return ctx.db
            .query("files")
            .withIndex("by_teamId_parentId_trashed_type", (q) =>
              q
                .eq("teamId", args.teamId)
                .eq("parentId", args.parentId)
                .eq("trashed", false)
                .eq("type", args.type!)
            )
            .order("desc")
            .collect()
        } else {
          return ctx.db
            .query("files")
            .withIndex("by_teamId_parentId_trashed", (q) =>
              q
                .eq("teamId", args.teamId)
                .eq("parentId", args.parentId)
                .eq("trashed", false)
            )
            .order("desc")
            .collect()
        }
      }
    })()

    const sortFiles = (arr: typeof files) =>
      arr.sort((a, b) => {
        if (a.isFolder !== b.isFolder) return a.isFolder ? -1 : 1
        return (b.updatedAt ?? 0) - (a.updatedAt ?? 0)
      })

    if (!hasSearch) {
      return sortFiles(files)
    }

    const searchLower = args.searchQuery!.toLowerCase()

    return sortFiles(
      files.filter((file) => file.name?.toLowerCase().includes(searchLower))
    )
  },
})

export const getFilesPaginated = query({
  args: {
    teamId: v.id("teams"),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const pagination = await ctx.db
      .query("files")
      .withIndex("by_teamId_trashed", (q) =>
        q.eq("teamId", args.teamId).eq("trashed", false)
      )
      .order("desc")
      .paginate(args.paginationOpts)

    return pagination
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
        q.eq("userId", userId).eq("teamId", args.teamId)
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
    storageId: v.optional(v.id("_storage")),
    isFolder: v.optional(v.boolean()),
    parentId: v.optional(v.id("files")),
    path: v.optional(v.string()),
    breadcrumbs: v.optional(
      v.array(
        v.object({
          folderId: v.id("files"),
          folderName: v.string(),
        })
      )
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Unauthorized")

    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_userId_teamId", (q) =>
        q.eq("userId", userId).eq("teamId", args.teamId)
      )
      .unique()

    if (!membership) {
      throw new Error("User does not have access to this team")
    }

    if (!args.isFolder && !args.storageId) {
      throw new Error("Storage ID is required for files")
    }

    const url = args.storageId
      ? (await ctx.storage.getUrl(args.storageId)) ?? undefined
      : undefined

    return await ctx.db.insert("files", {
      name: args.name,
      type: args.type,
      size: args.size,
      isFolder: args.isFolder ?? false,
      parentId: args.parentId,
      authorId: userId,
      teamId: args.teamId,
      trashed: false,
      storageId: args.storageId,
      url,
      path: args.path,
      breadcrumbs: args.breadcrumbs ?? (await getBreadcrumbs(ctx, args.parentId)),
    })
  },
})

export const renameFile = mutation({
  args: {
    teamId: v.id("teams"),
    fileId: v.id("files"),
    newName: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Unauthorized")

    const file = await ctx.db.get(args.fileId)
    if (!file) throw new Error("File not found")

    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_userId_teamId", (q) =>
        q.eq("userId", userId).eq("teamId", args.teamId)
      )
      .unique()

    if (!membership || membership.role === "read") {
      throw new Error("No permission to rename this file")
    }

    await ctx.db.patch(args.fileId, {
      name: args.newName,
      updatedAt: Date.now(),
    })

    // If this is a folder, update breadcrumbs for all descendants
    if (file.isFolder) {
      await updateDescendantBreadcrumbsAfterRename(ctx, args.fileId, args.newName, args.teamId)
    }
  },
})

export const toggleFileIsStarred = mutation({
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
        q.eq("userId", userId).eq("teamId", args.teamId)
      )
      .unique()

    if (!membership || membership.role === "read") {
      throw new Error("No permission to toggle star")
    }

    await ctx.db.patch(args.fileId, {
      isStarred: !file.isStarred,
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
        q.eq("userId", userId).eq("teamId", args.teamId)
      )
      .unique()

    if (!membership) return

    const allowed = membership.role === "write" || membership.role === "admin"
    if (!allowed) throw new Error("No permission to trash this file")

    await ctx.db.patch(args.fileId, {
      trashed: true,
      trashedAt: Date.now(),
    })
  },
})

export const trashFolder = mutation({
  args: { fileId: v.id("files"), teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const now = Date.now()

    async function trashRecursive(fileId: Id<"files">, teamId: Id<"teams">) {
      await ctx.db.patch(fileId, {
        trashed: true,
        trashedAt: now,
      })

      const children = await ctx.db
        .query("files")
        .withIndex("by_teamId_parentId_trashed", (q) =>
          q.eq("teamId", teamId).eq("parentId", fileId)
        )
        .collect()

      for (const child of children) {
        await trashRecursive(child._id, teamId)
      }
    }

    await trashRecursive(args.fileId, args.teamId)
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
        q.eq("userId", userId).eq("teamId", args.teamId)
      )
      .unique()

    if (!membership || membership.role !== "admin") {
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
        q.eq("userId", userId).eq("teamId", args.teamId)
      )
      .unique()

    if (!membership || membership.role !== "admin") {
      throw new Error("No permission to delete this file")
    }

    if (file.storageId) await ctx.storage.delete(file.storageId)
    await ctx.db.delete(file._id)
  },
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
          f.lt(f.field("trashedAt"), cutoff)
        )
      )
      .collect()

    for (const file of oldFiles) {
      console.info(`Deleting ${file.name}`)
      await ctx.db.delete(file._id)
      if (file.storageId) await ctx.storage.delete(file.storageId)
    }
  },
})

export const deleteAllTrashedFiles = mutation({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) throw new Error("Unauthorized")

    const membership = await ctx.db
      .query("memberships")
      .withIndex("by_userId_teamId", (q) =>
        q.eq("userId", userId).eq("teamId", args.teamId)
      )
      .unique()
    if (!membership || membership.role !== "admin") {
      throw new Error("No permission to empty trash")
    }

    const trashedFiles = await ctx.db
      .query("files")
      .withIndex("by_teamId_trashed")
      .filter((f) => f.eq(f.field("trashed"), true))
      .collect()

    for (const file of trashedFiles) {
      console.info(`Deleting ${file.name}`)
      await ctx.db.delete(file._id)
      if (file.storageId) await ctx.storage.delete(file.storageId)
    }
  },
})

export const moveFile = mutation({
  args: {
    fileId: v.id("files"),
    newParentId: v.optional(v.id("files")),
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
        q.eq("userId", userId).eq("teamId", args.teamId)
      )
      .unique()

    if (!membership || membership.role === "read") {
      throw new Error("No permission to move this file")
    }

    let breadcrumbs: { folderId: Id<"files">; folderName: string }[] = []
    let newPath = file.name

    if (args.newParentId) {
      const newParent = await ctx.db.get(args.newParentId)
      if (!newParent || !newParent.isFolder || newParent.trashed) {
        throw new Error("Invalid target folder")
      }

      let current = newParent
      while (current.parentId) {
        if (current.parentId === args.fileId) {
          throw new Error("Cannot move folder into its own descendant")
        }
        const parent = await ctx.db.get(current.parentId)
        if (!parent) break
        current = parent
      }

      breadcrumbs = [...(newParent.breadcrumbs ?? []), {
        folderId: newParent._id,
        folderName: newParent.name,
      }]

      newPath = newParent.path ? `${newParent.path}/${file.name}` : file.name
    }

    await ctx.db.patch(args.fileId, {
      parentId: args.newParentId,
      breadcrumbs,
      path: newPath,
      updatedAt: Date.now(),
    })

    if (file.isFolder) {
      await updateDescendantPaths(ctx, args.fileId, newPath, args.teamId)
      await updateDescendantBreadcrumbs(ctx, args.fileId, breadcrumbs, args.teamId)
    }
  },
})

// Helper function to recursively update paths of all descendants
async function updateDescendantPaths(
  ctx: MutationCtx,
  folderId: Id<"files">,
  newParentPath: string,
  teamId: Id<"teams">
) {
  const children = await ctx.db
    .query("files")
    .withIndex("by_teamId_parentId_trashed", (q) =>
      q.eq("teamId", teamId).eq("parentId", folderId).eq("trashed", false)
    )
    .collect()

  const currentFolder = await ctx.db.get(folderId)
  if (!currentFolder) return

  const newPath = `${newParentPath}/${currentFolder.name}`

  for (const child of children) {
    const childPath = `${newPath}/${child.name}`
    await ctx.db.patch(child._id, {
      path: childPath,
      updatedAt: Date.now(),
    })

    if (child.isFolder) {
      await updateDescendantPaths(ctx, child._id, newPath, teamId)
    }
  }
}

async function updateDescendantBreadcrumbs(
  ctx: MutationCtx,
  folderId: Id<"files">,
  parentBreadcrumbs: { folderId: Id<"files">; folderName: string }[],
  teamId: Id<"teams">
) {
  const children = await ctx.db
    .query("files")
    .withIndex("by_teamId_parentId_trashed", (q) =>
      q.eq("teamId", teamId).eq("parentId", folderId).eq("trashed", false)
    )
    .collect()

  const currentFolder = await ctx.db.get(folderId)
  if (!currentFolder) return

  const breadcrumbs = [
    ...parentBreadcrumbs,
    { folderId: currentFolder._id, folderName: currentFolder.name },
  ]

  for (const child of children) {
    await ctx.db.patch(child._id, {
      breadcrumbs,
      updatedAt: Date.now(),
    })

    if (child.isFolder) {
      await updateDescendantBreadcrumbs(ctx, child._id, breadcrumbs, teamId)
    }
  }
}

async function updateDescendantBreadcrumbsAfterRename(
  ctx: MutationCtx,
  folderId: Id<"files">,
  newName: string,
  teamId: Id<"teams">
) {
  const children = await ctx.db
    .query("files")
    .withIndex("by_teamId_parentId_trashed", (q) =>
      q.eq("teamId", teamId).eq("parentId", folderId).eq("trashed", false)
    )
    .collect()

  const currentFolder = await ctx.db.get(folderId)
  if (!currentFolder) return

  for (const child of children) {
    // Update the breadcrumbs to replace the old folder name with the new one
    const updatedBreadcrumbs = child.breadcrumbs?.map(crumb =>
      crumb.folderId === folderId
        ? { ...crumb, folderName: newName }
        : crumb
    ) ?? []

    await ctx.db.patch(child._id, {
      breadcrumbs: updatedBreadcrumbs,
      updatedAt: Date.now(),
    })

    if (child.isFolder) {
      await updateDescendantBreadcrumbsAfterRename(ctx, child._id, newName, teamId)
    }
  }
}
