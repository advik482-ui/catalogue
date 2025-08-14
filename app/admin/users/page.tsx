"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, MoreHorizontal, Edit, Trash2, Ban, CheckCircle, Mail, Calendar } from "lucide-react"
import Link from "next/link"
import { adminDataStore, type User } from "@/lib/admin-data"

export default function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const realUsers = adminDataStore.getAllUsers()
        setUsers(Array.isArray(realUsers) ? realUsers : [])
      } catch (error) {
        console.error("Failed to load users:", error)
        setUsers([]) // Fallback to empty array
      }
    }

    loadUsers()
  }, [])

  const filteredUsers = Array.isArray(users)
    ? users.filter(
        (user) =>
          user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : []

  const handleSuspendUser = async (userId: string) => {
    try {
      const updatedUser = adminDataStore.updateUser(userId, { status: "suspended" })
      if (updatedUser) {
        const refreshedUsers = adminDataStore.getAllUsers()
        setUsers(Array.isArray(refreshedUsers) ? refreshedUsers : [])
      }
    } catch (error) {
      console.error("Failed to suspend user:", error)
    }
  }

  const handleActivateUser = async (userId: string) => {
    try {
      const updatedUser = adminDataStore.updateUser(userId, { status: "active" })
      if (updatedUser) {
        const refreshedUsers = adminDataStore.getAllUsers()
        setUsers(Array.isArray(refreshedUsers) ? refreshedUsers : [])
      }
    } catch (error) {
      console.error("Failed to activate user:", error)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      try {
        adminDataStore.deleteUser(userId)
        const refreshedUsers = adminDataStore.getAllUsers()
        setUsers(Array.isArray(refreshedUsers) ? refreshedUsers : [])
      } catch (error) {
        console.error("Failed to delete user:", error)
      }
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Suspended</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-montserrat">User Management</h1>
          <p className="text-muted-foreground">Manage all user accounts and their resources</p>
        </div>
        <Link href="/admin/users/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add User
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Users</CardTitle>
          <CardDescription>Find users by name or email address</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
          <CardDescription>Complete list of platform users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-primary">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold">{user.name}</h3>
                        {getStatusBadge(user.status)}
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span className="flex items-center">
                          <Mail className="mr-1 h-3 w-3" />
                          {user.email}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          Joined {user.joinDate}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="text-right text-sm">
                      <div className="font-medium">{user.catalogues.length} Catalogues</div>
                      <div className="text-muted-foreground">{user.products.length} Products</div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="text-muted-foreground">Last active</div>
                      <div className="font-medium">{user.lastActive}</div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/users/${user.id}`}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit User
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/users/${user.id}`}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            View Resources
                          </Link>
                        </DropdownMenuItem>
                        {user.status === "active" ? (
                          <DropdownMenuItem className="text-orange-600" onClick={() => handleSuspendUser(user.id)}>
                            <Ban className="mr-2 h-4 w-4" />
                            Suspend User
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-600" onClick={() => handleActivateUser(user.id)}>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Activate User
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteUser(user.id)}>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete User
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No users found</p>
                <Link href="/admin/users/new">
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Create First User
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
