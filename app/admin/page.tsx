"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Users, LibraryIcon as Catalog, Activity, TrendingUp } from "lucide-react"
import { adminDataStore } from "@/lib/admin-data"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalCatalogues: 0,
    totalProducts: 0,
    recentActivity: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const realStats = await adminDataStore.getStats()
        setStats(realStats)
      } catch (error) {
        console.error("Failed to load admin stats:", error)
        // Keep default stats if loading fails
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers.toString(),
      description: `${stats.activeUsers} active users`,
      icon: Users,
      trend: "up",
    },
    {
      title: "Active Catalogues",
      value: stats.totalCatalogues.toString(),
      description: "Published catalogues",
      icon: Catalog,
      trend: "up",
    },
    {
      title: "Total Products",
      value: stats.totalProducts.toString(),
      description: "Products across all users",
      icon: Activity,
      trend: "up",
    },
    {
      title: "System Status",
      value: "Online",
      description: "All systems operational",
      icon: TrendingUp,
      trend: "up",
    },
  ]

  const handleCreateUser = () => {
    window.location.href = "/admin/users/new"
  }

  const handleExportData = async () => {
    try {
      const users = await adminDataStore.getAllUsers()
      const dataStr = JSON.stringify(users, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = "users-export.json"
      link.click()
    } catch (error) {
      console.error("Failed to export data:", error)
    }
  }

  const handleSystemBackup = async () => {
    try {
      const users = await adminDataStore.getAllUsers()
      const allData = {
        users,
        timestamp: new Date().toISOString(),
      }
      const dataStr = JSON.stringify(allData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `system-backup-${new Date().toISOString().split("T")[0]}.json`
      link.click()
    } catch (error) {
      console.error("Failed to create backup:", error)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-black font-montserrat">Admin Dashboard</h1>
          <p className="text-muted-foreground">Loading dashboard data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black font-montserrat">Admin Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, admin. Here's what's happening with CatalogueHub today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest user actions across the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.isArray(stats.recentActivity) && stats.recentActivity.length > 0 ? (
                stats.recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{activity.user}</p>
                      <p className="text-sm text-muted-foreground">{activity.action}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button variant="ghost" className="w-full justify-start p-3 h-auto" onClick={handleCreateUser}>
              <div className="text-left">
                <div className="font-medium">Create New User</div>
                <div className="text-sm text-muted-foreground">Add a new user account</div>
              </div>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start p-3 h-auto"
              onClick={() => (window.location.href = "/admin/users")}
            >
              <div className="text-left">
                <div className="font-medium">Manage Users</div>
                <div className="text-sm text-muted-foreground">View and edit user accounts</div>
              </div>
            </Button>
            <Button variant="ghost" className="w-full justify-start p-3 h-auto" onClick={handleExportData}>
              <div className="text-left">
                <div className="font-medium">Export User Data</div>
                <div className="text-sm text-muted-foreground">Download user reports</div>
              </div>
            </Button>
            <Button variant="ghost" className="w-full justify-start p-3 h-auto" onClick={handleSystemBackup}>
              <div className="text-left">
                <div className="font-medium">System Backup</div>
                <div className="text-sm text-muted-foreground">Create system backup</div>
              </div>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
