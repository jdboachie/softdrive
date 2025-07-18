"use client"

import { z } from "zod"
import * as React from "react"
import { useForm } from "react-hook-form"
import {
  Dialog,
  DialogTitle,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { PlusCircleIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useRouter } from "next/navigation"

const createTeamFormSchema = z.object({
  name: z.string().min(2).max(50),
})

export default function CreateTeamButton() {
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false)

  const router = useRouter()
  const createTeam = useMutation(api.teams.createTeam)

  const form = useForm<z.infer<typeof createTeamFormSchema>>({
    resolver: zodResolver(createTeamFormSchema),
    defaultValues: {
      name: "",
    },
  })

  async function handleSubmit() {
    const name = form.getValues("name")
    const newTeamId = await createTeam({ name: name })
    router.push(`/t/${newTeamId}`)
    setDialogOpen(false)
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button
          size={"sm"}
          variant={"ghost"}
          className="justify-start font-normal"
          onClick={() => setDialogOpen(true)}
        >
          <PlusCircleIcon className="text-primary" /> Create team
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a team</DialogTitle>
          <DialogDescription>
            Continue to start collaborating on Pro with increased usage,
            additional security features, and support.
          </DialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="py-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Team name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        </DialogHeader>
        <DialogFooter>
          <Button variant={'outline'}>Cancel</Button>
          <Button onClick={handleSubmit}>
            Create team
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
