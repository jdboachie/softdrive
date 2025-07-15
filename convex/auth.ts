import Google from "@auth/core/providers/google"
import { convexAuth } from "@convex-dev/auth/server"

export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Google],
  callbacks: {
    async afterUserCreatedOrUpdated(ctx, args) {
      if (args.existingUserId) return

      const orgId = await ctx.db.insert("organizations", {
        name: `${args.profile.email?.split("@")[0]}s files`,
      })

      await ctx.db.insert("memberships", {
        userId: args.userId,
        orgId,
        role: "admin",
      })

      await ctx.db.patch(args.userId, {
        defaultOrgId: orgId,
      })
    },
  },
})
