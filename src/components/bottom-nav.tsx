'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Users, ShoppingCart, PlusSquare, UserCircle, Boxes } from 'lucide-react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', icon: LayoutDashboard, label: 'Home' },
    { href: '/customers', icon: Users, label: 'Agen' },
    { href: '/cashier', icon: ShoppingCart, label: 'Kasir' },
    { href: '/inventory', icon: Boxes, label: 'Gudang' },
    { href: '/manage', icon: PlusSquare, label: 'Tambah' },
    { href: '/settings', icon: UserCircle, label: 'Akun' },
  ]

  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] z-50">
      <div className="bg-white border-t border-slate-100 px-6 py-4 flex justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className="relative flex flex-col items-center gap-1 group"
            >
              <item.icon className={cn(
                "h-5 w-5 transition-all duration-300",
                isActive ? "text-primary scale-110 stroke-[2.5]" : "text-slate-300 stroke-[2]"
              )} />
              <span className={cn(
                "text-[8px] font-black uppercase tracking-widest transition-colors duration-300",
                isActive ? "text-primary" : "text-slate-300"
              )}>
                {item.label}
              </span>
              {isActive && (
                <motion.div 
                  layoutId="nav-dot"
                  className="absolute -top-1 w-1 h-1 bg-primary rounded-full"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
