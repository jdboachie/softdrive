import { Sidenav } from "@/components/layout/sidenav"

export default function Layout({ children }: { children?: React.ReactNode }) {
  return (
    <div className="flex gap-12">
      <Sidenav
        links={[
          {
            label: "General",
            url: "/t/:teamId/settings",
          },
          {
            label: "Team",
            url: "/t/:teamId/settings/team",
          },
        ]}
      />
      {children}
    </div>
  )
}
