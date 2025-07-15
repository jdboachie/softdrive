"use client"

import { z } from "zod"
import * as React from "react"
import { useForm } from "react-hook-form"
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog"
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

const createOrganizationFormSchema = z.object({
  name: z.string().min(2).max(50),
})

export default function CreateOrganizationButton() {
  const [dialogOpen, setDialogOpen] = React.useState<boolean>(false)

  const router = useRouter()
  const createOrganization = useMutation(api.organizations.createOrganization)

  const form = useForm<z.infer<typeof createOrganizationFormSchema>>({
    resolver: zodResolver(createOrganizationFormSchema),
    defaultValues: {
      name: "",
    },
  })

  async function handleSubmit() {
    const name = form.getValues("name")
    const newOrgId = await createOrganization({ name: name })
    router.push(`/o/${newOrgId}`)
    setDialogOpen(false)
  }

  return (
    <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <AlertDialogTrigger asChild>
        <Button
          size={"sm"}
          variant={"ghost"}
          className="justify-start font-normal"
          onClick={() => setDialogOpen(true)}
        >
          <PlusCircleIcon className="text-primary" /> Create organization
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Create an organization</AlertDialogTitle>
          <AlertDialogDescription>
            Continue to start collaborating on Pro with increased usage,
            additional security features, and support.
          </AlertDialogDescription>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="py-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization name</FormLabel>
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
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>
            Create organization
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
