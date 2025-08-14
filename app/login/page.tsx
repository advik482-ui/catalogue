"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { LibraryIcon as Catalog, Mail, Lock, ArrowRight, Shield, User } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FirebaseService } from "@/lib/firebase"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleAdminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const username = formData.get("admin-username") as string
    const password = formData.get("admin-password") as string

    if (username === "admin123" && password === "admin123") {
      // Set admin session
      localStorage.setItem("userRole", "admin")
      localStorage.setItem("userId", "admin123")
      localStorage.setItem("userName", "Administrator")
      router.push("/admin")
    } else {
      setError("Invalid admin credentials")
    }

    setIsLoading(false)
  }

  const handleUserLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const users = await FirebaseService.getAllUsers()
      const user = users.find((u: any) => u.email === email && u.status === "active")

      if (user) {
        // In a real app, you'd hash and compare passwords
        // For now, we'll use a simple comparison (not secure for production)
        const storedPassword = user.password || "password123" // Default password for demo

        if (password === storedPassword) {
          // Set user session
          localStorage.setItem("userRole", "user")
          localStorage.setItem("userId", user.id)
          localStorage.setItem("userName", user.name)
          localStorage.setItem("userEmail", user.email)

          // Update last login
          await FirebaseService.updateUser(user.id, {
            lastLogin: Date.now(),
          })

          router.push("/dashboard")
        } else {
          setError("Invalid email or password")
        }
      } else {
        setError("Invalid email or password, or account is suspended")
      }
    } catch (error) {
      console.error("Login error:", error)
      setError("Login failed. Please try again.")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2">
            <Catalog className="h-8 w-8 text-primary" />
            <span className="text-2xl font-black font-montserrat">CatalogueHub</span>
          </Link>
        </div>

        <Card className="shadow-marketplace-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-black font-montserrat">Welcome Back</CardTitle>
            <CardDescription>Sign in to your account to continue</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Tabs defaultValue="user" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="user" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  User Login
                </TabsTrigger>
                <TabsTrigger value="admin" className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Admin Login
                </TabsTrigger>
              </TabsList>

              {/* User Login Tab */}
              <TabsContent value="user" className="space-y-4">
                <form onSubmit={handleUserLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="font-semibold">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="font-semibold">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Enter your password"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <input
                        id="remember"
                        type="checkbox"
                        className="rounded border-border text-primary focus:ring-primary"
                      />
                      <Label htmlFor="remember" className="text-sm">
                        Remember me
                      </Label>
                    </div>
                    <Link href="/forgot-password" className="text-sm text-primary hover:underline">
                      Forgot password?
                    </Link>
                  </div>

                  {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Sign In"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>

                <div className="bg-muted/50 p-3 rounded-md">
                  <p className="text-xs text-muted-foreground text-center">
                    <strong>Demo:</strong> Use any email from admin-created accounts with password "password123"
                  </p>
                </div>
              </TabsContent>

              {/* Admin Login Tab */}
              <TabsContent value="admin" className="space-y-4">
                <form onSubmit={handleAdminLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin-username" className="font-semibold">
                      Admin Username
                    </Label>
                    <div className="relative">
                      <Shield className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin-username"
                        name="admin-username"
                        type="text"
                        placeholder="Enter admin username"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin-password" className="font-semibold">
                      Admin Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="admin-password"
                        name="admin-password"
                        type="password"
                        placeholder="Enter admin password"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  {error && <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">{error}</div>}

                  <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                    {isLoading ? "Signing In..." : "Admin Sign In"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </form>

                <div className="bg-primary/10 p-3 rounded-md">
                  <p className="text-xs text-primary text-center">
                    <strong>Admin Credentials:</strong> Username: admin123, Password: admin123
                  </p>
                </div>
              </TabsContent>
            </Tabs>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Need help?{" "}
                <Link href="/contact" className="text-primary hover:underline font-semibold">
                  Contact Support
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-primary hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
