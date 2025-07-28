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

  files: defineTable({
    name: v.string(),
    size: v.optional(v.number()),
    type: v.string(),
    path: v.string(),
    teamId: v.id("teams"),
    authorId: v.id("users"),
    isFolder: v.boolean(),
    parentId: v.optional(v.id("files")),
    isStarred: v.optional(v.boolean()),
    storageId: v.optional(v.id("_storage")),
    url: v.optional(v.string()),
    trashed: v.boolean(),
    trashedAt: v.optional(v.number()),
    updatedAt: v.optional(v.number()),
  })
    .index("by_teamId", ["teamId"])
    .index("by_teamId_trashed", ["teamId", "trashed"])
    .index("by_teamId_parentId_trashed", ["teamId", "parentId", "trashed"])
    .index("by_teamId_parentId_trashed_type", [
      "teamId",
      "parentId",
      "trashed",
      "type",
    ]),
})
