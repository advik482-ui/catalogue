import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Package, FolderOpen, Share2, Eye } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-montserrat text-foreground">Welcome back, John!</h1>
          <p className="text-muted-foreground mt-2">Here's what's happening with your catalogues today.</p>
        </div>
        <div className="flex space-x-3">
          <Button asChild>
            <Link href="/dashboard/products/new">
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard/catalogues/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Catalogue
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="shadow-marketplace">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">+3 from last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-marketplace">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Catalogues</CardTitle>
            <FolderOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">+2 from last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-marketplace">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,247</div>
            <p className="text-xs text-muted-foreground">+18% from last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-marketplace">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Shared Links</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+4 from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-marketplace">
          <CardHeader>
            <CardTitle className="font-montserrat">Recent Products</CardTitle>
            <CardDescription>Your latest product additions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Premium Office Chair", category: "Furniture", date: "2 hours ago" },
              { name: "Wireless Headphones", category: "Electronics", date: "1 day ago" },
              { name: "Coffee Table Set", category: "Furniture", date: "3 days ago" },
            ].map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">{product.category}</p>
                </div>
                <p className="text-xs text-muted-foreground">{product.date}</p>
              </div>
            ))}
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/dashboard/products">View All Products</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="shadow-marketplace">
          <CardHeader>
            <CardTitle className="font-montserrat">Popular Catalogues</CardTitle>
            <CardDescription>Your most viewed catalogues this month</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Office Furniture Collection", views: 342, shares: 12 },
              { name: "Tech Accessories", views: 289, shares: 8 },
              { name: "Home Decor Essentials", views: 156, shares: 5 },
            ].map((catalogue, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div>
                  <p className="font-medium">{catalogue.name}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span className="flex items-center">
                      <Eye className="h-3 w-3 mr-1" />
                      {catalogue.views}
                    </span>
                    <span className="flex items-center">
                      <Share2 className="h-3 w-3 mr-1" />
                      {catalogue.shares}
                    </span>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  View
                </Button>
              </div>
            ))}
            <Button variant="outline" className="w-full bg-transparent" asChild>
              <Link href="/dashboard/catalogues">View All Catalogues</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="shadow-marketplace">
        <CardHeader>
          <CardTitle className="font-montserrat">Quick Actions</CardTitle>
          <CardDescription>Get started with these common tasks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
              <Link href="/dashboard/products/new">
                <Package className="h-6 w-6" />
                <span>Add New Product</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
              <Link href="/dashboard/catalogues/new">
                <FolderOpen className="h-6 w-6" />
                <span>Create Catalogue</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-transparent" asChild>
              <Link href="/dashboard/shared">
                <Share2 className="h-6 w-6" />
                <span>Share Catalogue</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
