import { auth } from "@/auth"

export default async function useRole() {
  const session = await auth()
  const role = (session?.user as any)?.role || "STAFF"
  const isAdmin = role === "ADMIN"
  return { role, isAdmin, session }
}
