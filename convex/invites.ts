import { getAuthUserId } from "@convex-dev/auth/server"
import { mutation, query } from "./_generated/server"
import { v } from "convex/values"

export const getInvitesForTeam = query({
  args: { teamId: v.id("teams") },
  handler: async (ctx, args) => {
    const userId = (await getAuthUserId(ctx))
    if (!userId) throw new Error("Not authenticated")

    return await ctx.db
      .query("invites")
      .withIndex("by_teamId", (q) => q.eq("teamId", args.teamId))
      .collect()
  },
})

export const createInvite = mutation({
  args: {
    teamId: v.id("teams"),
    inviteeEmail: v.string(),
    role: v.union(v.literal("read"), v.literal("write"), v.literal("admin")),
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
    if (!membership || membership.role !== "admin") {
      throw new Error("Not authorized")
    }

    const now = Date.now()
    const expiresAt = now + 7 * 24 * 60 * 60 * 1000

    return await ctx.db.insert("invites", {
      teamId: args.teamId,
      inviterId: userId,
      inviteeEmail: args.inviteeEmail,
      role: args.role,
      createdAt: now,
      expiresAt,
    })
  },
})

// export const acceptInvitation = mutation({
//   args: {
//     invitationId: v.id("invitations"),
//   },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity()
//     if (!identity) throw new Error("Not authenticated")

//     const invitation = await ctx.db.get(args.invitationId)
//     if (!invitation) throw new Error("Invitation not found")

//     if (invitation.expiresAt < Date.now()) {
//       throw new Error("Invitation expired")
//     }

//     if (invitation.inviteeEmail !== identity.email) {
//       throw new Error("This invitation was not sent to your email")
//     }

//     await ctx.db.insert("memberships", {
//       userId: identity.subject,
//       teamId: invitation.teamId,
//       role: invitation.role,
//     })

//     await ctx.db.patch(args.invitationId, { acceptedAt: Date.now() })
//   },
// })

// export const deleteInvite = mutation({
//   args: { invitationId: v.id("invites") },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity()
//     if (!identity) throw new Error("Not authenticated")

//     const invitation = await ctx.db.get(args.invitationId)
//     if (!invitation) throw new Error("Invitation not found")

//     await assertAdmin(ctx, invitation.teamId, identity.subject)

//     await ctx.db.delete(args.invitationId)
//   },
// })
