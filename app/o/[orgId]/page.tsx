import Component from "@/app/component"

export default async function Page({
  params,
}: {
  params: Promise<{ orgId: string }>
}) {
  const { orgId } = await params
  return (
    <div className="min-h-dvh p-6">
      My org ID: {orgId}
      <Component />
    </div>
  )
}