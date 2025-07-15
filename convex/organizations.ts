import { v } from "convex/values"
import { query, mutation } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"

export const getCurrentOrg = query({
  args: { orgId: v.optional(v.id("organizations"))},
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      console.error('Unauthorized')
      return null
    }

    if (args.orgId && args.orgId !== undefined) {
      return ctx.db.get(args.orgId)
    } else {
      const defaultOrgId = (await ctx.db.get(userId))?.defaultOrgId
      if (!defaultOrgId) return null
      return ctx.db.get(defaultOrgId)
    }

  },
})

export const getUserOrganizations = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return []

    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect()

    const orgIds = memberships.map((m) => m.orgId)

    const organizations = await Promise.all(
      orgIds.map((orgId) => ctx.db.get(orgId)),
    )

    // filter out deleted orgs
    return organizations.filter((org) => org !== null)
  },
})

export const createOrganization = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      console.error("Unauthorized")
      return null
    }

    // create organization
    const newOrgId = await ctx.db.insert("organizations", { name: args.name })

    // add current authuser to organization
    await ctx.db.insert("memberships", {
      userId: userId,
      orgId: newOrgId,
      role: "admin",
    })

    // return orgId for redirect
    return newOrgId
  },
})
