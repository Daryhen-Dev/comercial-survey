'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Building2, Users, ClipboardList, LogOut } from 'lucide-react'

import { logoutAction } from '@/lib/actions/auth'
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'

const navItems = [
  {
    label: 'Sucursales',
    href: '/admin/branches',
    icon: Building2,
  },
  {
    label: 'Empleados',
    href: '/admin/employees',
    icon: Users,
  },
  {
    label: 'Actividades',
    href: '/admin/surveys',
    icon: ClipboardList,
  },
]

export function NavMain() {
  const pathname = usePathname()

  return (
    <SidebarGroup className="flex flex-col flex-1">
      <SidebarGroupContent className="flex-1">
        <SidebarMenu>
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton asChild isActive={isActive} tooltip={item.label}>
                  <Link href={item.href}>
                    <item.icon className="size-4" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>

      <SidebarGroupContent className="mt-auto pt-4 border-t border-sidebar-border">
        <form action={logoutAction}>
          <Button
            type="submit"
            variant="ghost"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-foreground"
          >
            <LogOut className="size-4" />
            <span>Cerrar sesión</span>
          </Button>
        </form>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
