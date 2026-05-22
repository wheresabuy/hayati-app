"use client"

import * as React from "react"
import { Select as SelectPrimitive } from "@base-ui/react/select"
import { motion, AnimatePresence } from "framer-motion"
import { cva, type VariantProps } from "class-variance-authority"
import { 
  ChevronDown, 
  Check, 
  ChevronUp, 
  Search, 
  User, 
  Package, 
  MapPin, 
  Tag, 
  CreditCard, 
  Wallet,
  ArrowRight,
  Filter,
  CheckCircle2
} from "lucide-react"
import { cn } from "@/lib/utils"

/**
 * =============================================================================
 * HAYATI DESIGN SYSTEM v3.2 - FIXED SCROLL SELECT SYSTEM
 * =============================================================================
 */

const selectVariants = cva(
  "flex w-full items-center justify-between transition-all duration-200 outline-none disabled:cursor-not-allowed disabled:opacity-40 select-none",
  {
    variants: {
      variant: {
        default: "bg-slate-50 border-none text-slate-900 focus:bg-white focus:ring-2 focus:ring-primary/10 shadow-inner-soft",
        secondary: "bg-white border-2 border-slate-100 text-slate-900 focus:border-primary",
        dark: "bg-[#121212] border border-white/10 text-white focus:border-white/40 focus:bg-black",
        glass: "bg-white/40 backdrop-blur-xl border border-white/40 text-slate-900 focus:bg-white/60",
        premium: "bg-white border-none shadow-premium text-slate-900 rounded-[1.5rem] focus:ring-4 focus:ring-slate-100",
        underline: "bg-transparent border-b-2 border-slate-100 rounded-none px-0 focus:border-primary",
        ghost: "bg-transparent border-none px-0 focus:ring-0",
      },
      size: {
        xs: "h-8 px-3 text-[10px] font-black rounded-xl",
        sm: "h-10 px-4 text-xs font-bold rounded-xl",
        default: "h-14 px-6 text-sm font-bold rounded-2xl",
        lg: "h-16 px-8 text-base font-black rounded-[1.5rem]",
        xl: "h-20 px-10 text-lg font-black rounded-[2rem]",
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Select = SelectPrimitive.Root

const SelectValue = SelectPrimitive.Value

interface SelectTriggerProps extends SelectPrimitive.Trigger.Props, VariantProps<typeof selectVariants> {
  icon?: React.ReactNode
}

const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, variant, size, icon, children, ...props }, ref) => (
    <SelectPrimitive.Trigger
      ref={ref}
      className={cn(selectVariants({ variant, size, className }), "group/trigger")}
      {...props}
    >
      <div className="flex items-center gap-3 truncate">
        {icon && (
          <span className="text-slate-300 group-focus/trigger:text-primary transition-colors">
            {icon}
          </span>
        )}
        <SelectValue className="truncate" />
      </div>
      <SelectPrimitive.Icon className="transition-transform group-data-[open]:rotate-180 shrink-0">
        <ChevronDown className="h-4 w-4 text-slate-300" />
      </SelectPrimitive.Icon>
    </SelectPrimitive.Trigger>
  )
)
SelectTrigger.displayName = "SelectTrigger"

function SelectContent({
  className,
  children,
  side = "bottom",
  sideOffset = 8,
  align = "center",
  ...props
}: SelectPrimitive.Popup.Props & Pick<SelectPrimitive.Positioner.Props, "align" | "alignOffset" | "side" | "sideOffset" | "alignItemWithTrigger">) {
  return (
    <SelectPrimitive.Portal>
      <SelectPrimitive.Positioner side={side} sideOffset={sideOffset} align={align} className="z-[9999]">
        <SelectPrimitive.Popup
          className={cn(
            "relative z-[9999] max-h-[300px] min-w-[200px] overflow-y-auto no-scrollbar rounded-[2rem] bg-white p-2 text-slate-900 shadow-lux ring-1 ring-slate-100 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95 touch-auto",
            className
          )}
          style={{ pointerEvents: 'auto' }}
          {...props}
        >
          <SelectPrimitive.List className="space-y-1">
            {children}
          </SelectPrimitive.List>
        </SelectPrimitive.Popup>
      </SelectPrimitive.Positioner>
    </SelectPrimitive.Portal>
  )
}

function SelectItem({ className, children, icon, ...props }: SelectPrimitive.Item.Props & { icon?: React.ReactNode }) {
  return (
    <SelectPrimitive.Item
      className={cn(
        "relative flex w-full cursor-pointer items-center gap-3 rounded-xl py-3 px-4 text-sm font-bold outline-none select-none focus:bg-slate-50 focus:text-primary data-disabled:pointer-events-none data-disabled:opacity-40 transition-all active:scale-[0.98]",
        className
      )}
      {...props}
    >
      {icon && <span className="text-slate-300 shrink-0">{icon}</span>}
      <SelectPrimitive.ItemText className="flex-1 truncate">{children}</SelectPrimitive.ItemText>
      <SelectPrimitive.ItemIndicator className="ml-auto text-primary shrink-0">
        <Check className="h-4 w-4 stroke-[3]" />
      </SelectPrimitive.ItemIndicator>
    </SelectPrimitive.Item>
  )
}

export const CustomerSelect = ({ 
  customers, 
  onValueChange, 
  value, 
  ...props 
}: { 
  customers: any[]
  onValueChange?: (val: string | null, details: any) => void
  value?: string 
} & Omit<SelectTriggerProps, 'onValueChange'>) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger icon={<User className="w-5 h-5" />} {...props}>
        <SelectValue placeholder="Pilih Agen..." />
      </SelectTrigger>
      <SelectContent className="min-w-[280px]">
        {customers.map(c => (
          <SelectItem key={c.id} value={c.id} className="py-4">
            <div className="flex flex-col gap-0.5">
              <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter">{c.uid}</span>
              <span className="text-base font-black">{c.name}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export const ProductSelect = ({ 
  products, 
  onValueChange, 
  value, 
  ...props 
}: { 
  products: any[]
  onValueChange?: (val: string | null, details: any) => void
  value?: string 
} & Omit<SelectTriggerProps, 'onValueChange'>) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger icon={<Package className="w-5 h-5" />} {...props}>
        <SelectValue placeholder="Pilih Produk..." />
      </SelectTrigger>
      <SelectContent className="min-w-[320px]">
        {products.map(p => (
          <SelectItem key={p.id} value={p.id} className="py-4">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-0.5">
                <span className="text-base font-black">{p.name}</span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Stok: {p.stock}</span>
              </div>
              <span className="text-xs font-black text-primary">Rp {p.baseCost?.toLocaleString('id-ID')}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export const PaymentMethodSelect = (props: Omit<SelectTriggerProps, 'onValueChange'> & { onValueChange?: (val: string | null, details: any) => void }) => {
  const methods = [
    { id: 'CASH', label: 'Tunai (Cash)', icon: <Wallet className="h-4 w-4" /> },
    { id: 'TRANSFER', label: 'Transfer Bank', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'DEBT', label: 'Hutang / Piutang', icon: <Tag className="h-4 w-4" /> },
  ]

  return (
    <Select onValueChange={props.onValueChange}>
      <SelectTrigger icon={<CreditCard className="h-5 w-5" />} {...props}>
        <SelectValue placeholder="Cara Bayar?" />
      </SelectTrigger>
      <SelectContent>
        {methods.map(m => (
          <SelectItem key={m.id} value={m.id} icon={m.icon}>
            {m.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
}
