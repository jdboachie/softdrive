import { cronJobs } from "convex/server"
import { internal } from "./_generated/api"

const crons = cronJobs()

crons.interval(
  "clear messages table",
  { hours: 1 }, // every minute
  internal.files.deleteTrashedFilesViaCron,
)

export default crons