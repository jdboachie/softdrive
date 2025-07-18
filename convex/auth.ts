import Google from "@auth/core/providers/google"
import { convexAuth } from "@convex-dev/auth/server"

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, args) {
      if (args.existingUserId) return

      const teamId = await ctx.db.insert("teams", {
        name: `${args.profile.email?.split("@")[0]}s files`,
      })

      await ctx.db.insert("memberships", {
        userId: args.userId,
        teamId: teamId,
        role: "admin",
      })

      await ctx.db.patch(args.userId, {
        defaultTeamId: teamId,
      })
    },
  },
})
