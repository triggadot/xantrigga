import React from "react"
import { Link, useLocation } from "react-router-dom"
import {
  BarChart3,
  ChevronUp, 
  ClipboardList,
  Database,
  FileCog,
  FileText,
  LayoutDashboard,
  Menu,
  Package,
  Receipt,
  Settings,
  ShoppingCart,
  Table,
  User2,
  Users,
} from "lucide-react"

import {
  Sidebar as SidebarComponent,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  useSidebar,
} from "@/components/blocks/sidebar"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function Sidebar() {
  const location = useLocation()
  const { isOpen, isMobile, toggleSidebar, setSidebarOpen } = useSidebar()
  
  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/"
    }
    return location.pathname.startsWith(path)
  }

  const mainItems = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Accounts",
      url: "/accounts",
      icon: Users,
    },
    {
      title: "Products",
      url: "/products",
      icon: Package,
    },
  ]

  const documentItems = [
    {
      title: "Purchase Orders",
      url: "/purchase-orders",
      icon: ShoppingCart,
    },
    {
      title: "Estimates",
      url: "/estimates",
      icon: FileCog,
    },
    {
      title: "Invoices",
      url: "/invoices",
      icon: Receipt,
    },
  ]

  const reportItems = [
    {
      title: "Reports",
      url: "/reports",
      icon: FileText,
    },
    {
      title: "Activity",
      url: "/activity",
      icon: ClipboardList,
    },
  ]

  const adminItems = [
    {
      title: "Glide Sync",
      url: "/sync",
      icon: BarChart3,
    },
    {
      title: "Database Management",
      url: "/data-management",
      icon: Database,
    },
    {
      title: "Table Demo",
      url: "/table-demo",
      icon: Table,
    },
  ]
  
  const renderMenuItem = (item: { title: string, url: string, icon: React.ElementType }, isActive: boolean) => {
    const Icon = item.icon;
    return (
      <SidebarMenuItem key={item.title}>
        <SidebarMenuButton
          asChild
          className={isActive(item.url) ? "bg-accent text-accent-foreground" : ""}
        >
          <Link to={item.url} className="flex items-center">
            <Icon className="h-5 w-5" />
            <span className={`ml-2 ${isOpen ? 'opacity-100' : 'opacity-0 absolute'}`}>
              {item.title}
            </span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };
  
  return (
    <SidebarComponent
      open={isOpen}
      onOpenChange={setSidebarOpen}
      variant="float"
      collapsible="icon"
      className={`hidden md:flex fixed inset-y-0 left-0 z-20 flex-col border-r shadow-sm transition-all duration-300 ${
        isOpen ? 'w-64' : 'w-20'
      }`}
    >
      <SidebarContent>
        <div className="flex h-14 items-center border-b px-4">
          <Link to="/" className="flex items-center gap-2 text-primary font-semibold text-xl">
            <BarChart3 className="h-6 w-6" />
            <span className={`transition-opacity duration-200 ${isOpen ? 'opacity-100' : 'opacity-0 w-0 h-0 overflow-hidden'}`}>
              Billow
            </span>
          </Link>
          <div className="flex-1" />
          <SidebarMenuButton onClick={toggleSidebar} variant="icon" className="md:flex">
            <Menu className="h-5 w-5" />
          </SidebarMenuButton>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className={isOpen ? '' : 'sr-only'}>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={isActive(item.url) ? "bg-accent text-accent-foreground" : ""}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span className={`ml-2 ${isOpen ? 'opacity-100' : 'opacity-0 absolute'}`}>
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className={isOpen ? '' : 'sr-only'}>Documents</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {documentItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={isActive(item.url) ? "bg-accent text-accent-foreground" : ""}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span className={`ml-2 ${isOpen ? 'opacity-100' : 'opacity-0 absolute'}`}>
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel className={isOpen ? '' : 'sr-only'}>Reports</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {reportItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={isActive(item.url) ? "bg-accent text-accent-foreground" : ""}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span className={`ml-2 ${isOpen ? 'opacity-100' : 'opacity-0 absolute'}`}>
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className={isOpen ? '' : 'sr-only'}>Administration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    className={isActive(item.url) ? "bg-accent text-accent-foreground" : ""}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span className={`ml-2 ${isOpen ? 'opacity-100' : 'opacity-0 absolute'}`}>
                        {item.title}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className={isOpen ? '' : 'items-center'}>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link to="/settings">
                <Settings className="h-5 w-5" />
                <span className={`ml-2 ${isOpen ? 'opacity-100' : 'opacity-0 absolute'}`}>
                  Settings
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className={isOpen ? '' : 'hidden md:hidden'}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 className="h-5 w-5" />
                  <span className="ml-2">User Profile</span>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <Link to="/profile" className="w-full">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/account" className="w-full">Account</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <span>Sign out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
          <SidebarMenuItem className={isOpen ? 'hidden' : 'md:flex'}>
            <SidebarMenuButton asChild>
              <Link to="/profile">
                <User2 className="h-5 w-5" />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </SidebarComponent>
  )
}

export default Sidebar
