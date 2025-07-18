import { v } from "convex/values"
import { authTables } from "@convex-dev/auth/server"
import { defineSchema, defineTable } from "convex/server"

export default defineSchema({
  ...authTables,

  users: defineTable({
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    email: v.optional(v.string()),
    emailVerificationTime: v.optional(v.number()),
    phone: v.optional(v.string()),
    phoneVerificationTime: v.optional(v.number()),
    isAnonymous: v.optional(v.boolean()),
    defaultTeamId: v.optional(v.id("teams")),
  }).index("email", ["email"]),

  teams: defineTable({
    image: v.optional(v.id("storage")),
    name: v.string(),
  }).index("by_name", ["name"]),

  memberships: defineTable({
    userId: v.id("users"),
    teamId: v.id("teams"),
    role: v.union(v.literal("read"), v.literal("write"), v.literal("admin")),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_teamId", ["userId", "teamId"]),

  invites: defineTable({
    teamId: v.id("teams"),
    inviterId: v.id("users"),
    inviteeEmail: v.string(),
    role: v.union(v.literal("read"), v.literal("write"), v.literal("admin")),
    createdAt: v.number(),
    expiresAt: v.number(),
    acceptedAt: v.optional(v.number()),
  })
    .index("by_inviteeEmail", ["inviteeEmail"])
    .index("by_teamId", ["teamId"])
    .index("by_teamId_inviteeEmail", ["teamId", "inviteeEmail"]),

  folders: defineTable({
    name: v.string(),
    teamId: v.id("teams"),
    parentId: v.optional(v.id("folders")),
    createdAt: v.number(),
  })
    .index("by_teamId", ["teamId"])
    .index("by_teamId_parentId", ["teamId", "parentId"]),

  files: defineTable({
    name: v.string(),
    size: v.number(),
    type: v.string(),
    author: v.id("users"),
    teamId: v.id("teams"),
    favorite: v.optional(v.boolean()),
    folderId: v.optional(v.id("folders")),
    storageId: v.id("_storage"),
    trashed: v.boolean(),
    trashedAt: v.optional(v.number()),
  })
    .index("by_teamId", ["teamId"])
    .index("by_teamId_folderId", ["teamId", "folderId"])
    .index("by_teamId_trashed", ["teamId", "trashed"]),
})
