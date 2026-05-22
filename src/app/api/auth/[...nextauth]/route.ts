import { handlers } from "@/auth"
import { NextRequest } from "next/server"

const { GET: authGET, POST: authPOST } = handlers

export async function GET(
  req: NextRequest,
  props: { params: Promise<{ nextauth: string[] }> }
) {
  return authGET(req)
}

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ nextauth: string[] }> }
) {
  return authPOST(req)
}
