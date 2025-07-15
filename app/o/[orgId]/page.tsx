import Component from "@/app/component"

export default async function Page({
  params,
}: {
  params: Promise<{ orgId: string }>
}) {
  const { orgId } = await params
  return (
    <div className="min-h-dvh p-6">
     <span className="sr-only"> My org ID: {orgId}</span>
      <Component />
    </div>
  )
}