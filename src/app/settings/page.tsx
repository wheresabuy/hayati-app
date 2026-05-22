import { auth } from '@/auth'
import SettingsClient from './settings-client'

export default async function SettingsPage() {
  const session = await auth()
  return <SettingsClient session={session} />
}
