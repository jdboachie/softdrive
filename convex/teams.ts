import { v } from "convex/values"
import { query, mutation } from "./_generated/server"
import { getAuthUserId } from "@convex-dev/auth/server"

export const getCurrentTeam = query({
  args: { teamId: v.optional(v.id("teams"))},
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      console.error('Unauthorized')
      return null
    }

    if (args.teamId && args.teamId !== undefined) {
      return ctx.db.get(args.teamId)
    } else {
      const defaultTeamId = (await ctx.db.get(userId))?.defaultTeamId
      if (!defaultTeamId) return null
      return ctx.db.get(defaultTeamId)
    }

  },
})

export const getUserTeams = query({
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) return []

    const memberships = await ctx.db
      .query("memberships")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .collect()

    const teamIds = memberships.map((m) => m.teamId)

    const teams = await Promise.all(
      teamIds.map((teamId) => ctx.db.get(teamId)),
    )

    // filter out deleted teams
    return teams.filter((team) => team !== null)
  },
})

export const createTeam = mutation({
  args: { name: v.string() },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx)
    if (!userId) {
      console.error("Unauthorized")
      return null
    }

    // create team
    const newTeamId = await ctx.db.insert("teams", { name: args.name })

    // add current authuser to team
    await ctx.db.insert("memberships", {
      userId: userId,
      teamId: newTeamId,
      role: "admin",
    })

    // return teamId for redirect
    return newTeamId
  },
})
