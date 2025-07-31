import { Button } from "@/components/ui/button"

export default function TeamSettingsPage() {
  return (
    <div className="w-full">
      <div className="border rounded-lg w-full p-5 bg-background flex flex-col gap-5">
        <h2 className="text-xl font-medium">Invites</h2>
        <div className="">
          <Button>Create invite</Button>
        </div>
      </div>
    </div>
  )
}
