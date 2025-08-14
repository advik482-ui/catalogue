import type React from "react"
import { Button } from "@/components/ui/button"
import {
  LibraryIcon as Catalog,
  Home,
  Package,
  FolderOpen,
  Share2,
  Settings,
  User,
  Bell,
  Search,
  Layers,
} from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Suspense } from "react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
      <Suspense fallback={<div>Loading...</div>}>
        <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex h-16 items-center px-6">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center space-x-2">
                <Catalog className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold font-montserrat">CatalogueHub</span>
              </Link>
            </div>

            <div className="flex-1 flex items-center justify-center px-6">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search products, catalogues..." className="pl-10" />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <User className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>
      </Suspense>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-sidebar border-r min-h-[calc(100vh-4rem)]">
          <nav className="p-4 space-y-2">
            <Link
              href="/dashboard"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <Home className="h-4 w-4" />
              <span className="font-medium">Dashboard</span>
            </Link>

            <Link
              href="/dashboard/products"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <Package className="h-4 w-4" />
              <span className="font-medium">Products</span>
            </Link>

            <Link
              href="/dashboard/catalogues"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <FolderOpen className="h-4 w-4" />
              <span className="font-medium">Catalogues</span>
            </Link>

            <Link
              href="/dashboard/field-templates"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <Layers className="h-4 w-4" />
              <span className="font-medium">Field Templates</span>
            </Link>

            <Link
              href="/dashboard/shared"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <Share2 className="h-4 w-4" />
              <span className="font-medium">Shared Links</span>
            </Link>

            <Link
              href="/dashboard/settings"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors"
            >
              <Settings className="h-4 w-4" />
              <span className="font-medium">Settings</span>
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
