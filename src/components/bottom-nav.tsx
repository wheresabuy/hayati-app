'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { LayoutDashboard, Users, ShoppingCart, PlusSquare, UserCircle, Boxes, Sparkles } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', icon: LayoutDashboard, label: 'Home' },
    { href: '/customers', icon: Users, label: 'Agen' },
    { href: '/cashier', icon: ShoppingCart, label: 'Kasir', highlight: true },
    { href: '/inventory', icon: Boxes, label: 'Gudang' },
    { href: '/manage', icon: PlusSquare, label: 'Tambah' },
  ]

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-[440px] z-[100] px-6">
      <nav className="relative bg-[#121212]/90 backdrop-blur-2xl rounded-[2.5rem] p-2 flex justify-between items-center shadow-2xl border border-white/10 overflow-hidden">
        {/* Animated Background Highlight */}
        <AnimatePresence>
          {navItems.map((item, idx) => {
             const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
             if (!isActive) return null
             return (
               <motion.div
                 key="active-bg"
                 layoutId="nav-pill"
                 className="absolute top-2 bottom-2 bg-white/10 rounded-[2rem]"
                 style={{ 
                   width: `${100 / navItems.length - 2}%`,
                   left: `${(idx * (100 / navItems.length)) + 1}%`
                 }}
                 transition={{ type: 'spring', stiffness: 350, damping: 30 }}
               />
             )
          })}
        </AnimatePresence>

        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))
          
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className="relative z-10 flex-1 flex flex-col items-center justify-center py-3 gap-1 group outline-none"
            >
              <div className={cn(
                "relative p-2 rounded-xl transition-all duration-300",
                item.highlight && !isActive && "bg-primary/20 animate-pulse",
                isActive ? "scale-110" : "scale-100 group-hover:scale-105"
              )}>
                <item.icon className={cn(
                  "h-5 w-5 transition-colors duration-300",
                  isActive ? "text-primary stroke-[2.5]" : "text-slate-500 group-hover:text-slate-300 stroke-[2]",
                  item.highlight && !isActive && "text-primary"
                )} />
                
                {item.highlight && (
                   <div className="absolute -top-1 -right-1">
                      <Sparkles className="w-2.5 h-2.5 text-primary fill-primary animate-bounce" />
                   </div>
                )}
              </div>
              
              <span className={cn(
                "text-[7px] font-black uppercase tracking-[0.2em] transition-all duration-300",
                isActive ? "text-white opacity-100" : "text-slate-500 opacity-0 group-hover:opacity-100 group-hover:text-slate-300"
              )}>
                {item.label}
              </span>

              {isActive && (
                <motion.div 
                  layoutId="active-dot"
                  className="absolute -bottom-1 w-1 h-1 bg-primary rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          )
        })}

        {/* Ambient Glows */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
           <div className="absolute top-0 left-1/4 w-20 h-20 bg-primary/30 rounded-full blur-2xl" />
           <div className="absolute bottom-0 right-1/4 w-20 h-20 bg-blue-500/30 rounded-full blur-2xl" />
        </div>
      </nav>
    </div>
  )
}
