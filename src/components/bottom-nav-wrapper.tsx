import { auth } from "@/auth"

export default async function BottomNavWrapper() {
  const session = await auth()
  
  // Jika tidak login, jangan tampilkan navbar bawah
  if (!session) return null

  // Import dynamic untuk menghindari masalah SSR di layout root
  const BottomNav = (await import("./bottom-nav")).default
  return <BottomNav />
}
