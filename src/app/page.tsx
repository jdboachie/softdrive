'use client'

import { Button } from "@/components/ui/button"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"

export default function Home() {

  const createFile = useMutation(api.files.createFile)
  const files = useQuery(api.files.getFiles)

  return (
    <div className="grid place-items-center w-full h-screen" >
      <Button
        onClick={() => {createFile({ name: 'jude' })}}
      >
        Create file
      </Button>
      <div className="border grid gap-2 p-4 rounded-md">
        {JSON.stringify(files)}
      </div>
    </div>
  );
}
