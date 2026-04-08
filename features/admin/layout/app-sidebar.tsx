import { Sidebar, SidebarContent, SidebarFooter } from '@/components/ui/sidebar'
import { NavHeader } from '@/features/admin/layout/nav-header'
import { NavMain } from '@/features/admin/layout/nav-main'
import { ThemeToggle } from '@/components/shared/theme-toggle'

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <NavHeader />
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  )
}
