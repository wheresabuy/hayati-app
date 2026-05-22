import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

// Konfigurasi Pengguna & Role
const USERS = [
  { name: "Setio", password: "password-setio", role: "ADMIN" },
  { name: "Syifa", password: "password-syifa", role: "ADMIN" },
  { name: "Ayub", password: "password-ayub", role: "ADMIN" },
  { name: "Ulfah", password: "password-ulfah", role: "STAFF" },
  { name: "Putri", password: "password-putri", role: "STAFF" },
]

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Nama", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = USERS.find(
          (u) => 
            u.name.toLowerCase() === (credentials?.username as string).toLowerCase() && 
            u.password === credentials?.password
        )

        if (user) {
          return { id: user.name, name: user.name, role: user.role }
        }
        return null
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.role = (user as any).role
      return token
    },
    session({ session, token }) {
      if (session.user) (session.user as any).role = token.role
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = !nextUrl.pathname.startsWith('/login')
      
      if (isOnDashboard) {
        if (isLoggedIn) return true
        return false
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl))
      }
      return true
    },
  },
  pages: {
    signIn: "/login",
  },
})
