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
    defaultOrgId: v.optional(v.id("organizations")),
  }).index("email", ["email"]),

  organizations: defineTable({
    image: v.optional(v.id("storage")),
    name: v.string(),
  }).index("by_name", ["name"]),

  memberships: defineTable({
    userId: v.id("users"),
    orgId: v.id("organizations"),
    role: v.union(v.literal("read"), v.literal("write"), v.literal("admin")),
  })
    .index("by_userId", ["userId"])
    .index("by_userId_orgId", ["userId", "orgId"]),

  files: defineTable({
    name: v.string(),
    author: v.optional(v.id("users")),
    orgId: v.id("organizations"),
    storageId: v.id("_storage"),
    trashed: v.boolean(),
    trashedAt: v.optional(v.number()),
  })
    .index("by_orgId", ["orgId"])
    .index("by_orgId_trashed", ["orgId", "trashed"])
})
