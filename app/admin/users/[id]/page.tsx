"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  ArrowLeft,
  MoreHorizontal,
  LibraryIcon as Catalog,
  Package,
  Eye,
  Edit,
  Trash2,
  Ban,
  CheckCircle,
  Share2,
} from "lucide-react"
import Link from "next/link"
import { useParams } from "next/navigation"

export default function UserDetailPage() {
  const params = useParams()
  const userId = params.id as string

  // Mock user data - in real app, this would come from API
  const user = {
    id: userId,
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    joinDate: "2024-01-15",
    lastActive: "2 hours ago",
    totalCatalogues: 3,
    totalProducts: 45,
    totalViews: 1234,
    totalShares: 89,
  }

  const catalogues = [
    {
      id: "1",
      title: "Summer Collection 2024",
      description: "Latest summer fashion trends and styles",
      products: 15,
      views: 456,
      shares: 23,
      status: "published",
      createdAt: "2024-03-01",
      lastModified: "2024-03-15",
    },
    {
      id: "2",
      title: "Tech Gadgets Showcase",
      description: "Cutting-edge technology products and accessories",
      products: 20,
      views: 678,
      shares: 45,
      status: "published",
      createdAt: "2024-02-15",
      lastModified: "2024-03-10",
    },
    {
      id: "3",
      title: "Home Decor Ideas",
      description: "Beautiful home decoration items and furniture",
      products: 10,
      views: 234,
      shares: 12,
      status: "draft",
      createdAt: "2024-03-20",
      lastModified: "2024-03-22",
    },
  ]

  const products = [
    {
      id: "1",
      name: "Wireless Bluetooth Headphones",
      category: "Electronics",
      price: "$99.99",
      status: "active",
      catalogues: ["Tech Gadgets Showcase"],
      createdAt: "2024-02-20",
    },
    {
      id: "2",
      name: "Summer Dress - Blue",
      category: "Fashion",
      price: "$49.99",
      status: "active",
      catalogues: ["Summer Collection 2024"],
      createdAt: "2024-03-01",
    },
    {
      id: "3",
      name: "Modern Table Lamp",
      category: "Home Decor",
      price: "$79.99",
      status: "active",
      catalogues: ["Home Decor Ideas"],
      createdAt: "2024-03-20",
    },
    {
      id: "4",
      name: "Smartphone Case",
      category: "Electronics",
      price: "$19.99",
      status: "inactive",
      catalogues: ["Tech Gadgets Showcase"],
      createdAt: "2024-02-25",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "draft":
        return <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">Draft</Badge>
      case "inactive":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Inactive</Badge>
      case "suspended":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Suspended</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Link href="/admin/users">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Users
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-black font-montserrat">{user.name}</h1>
          <p className="text-muted-foreground">User resources and activity management</p>
        </div>
      </div>

      {/* User Overview */}
      <Card>
        <CardHeader>
          <CardTitle>User Overview</CardTitle>
          <CardDescription>Basic information and account status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-sm">{user.email}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Status</p>
              {getStatusBadge(user.status)}
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Join Date</p>
              <p className="text-sm">{user.joinDate}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Last Active</p>
              <p className="text-sm">{user.lastActive}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Catalogues</CardTitle>
            <Catalog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.totalCatalogues}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Products</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.totalViews.toLocaleString()}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shares</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user.totalShares}</div>
          </CardContent>
        </Card>
      </div>

      {/* Resources Tabs */}
      <Tabs defaultValue="catalogues" className="space-y-4">
        <TabsList>
          <TabsTrigger value="catalogues">Catalogues ({catalogues.length})</TabsTrigger>
          <TabsTrigger value="products">Products ({products.length})</TabsTrigger>
          <TabsTrigger value="activity">Activity Log</TabsTrigger>
        </TabsList>

        <TabsContent value="catalogues" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Catalogues</CardTitle>
              <CardDescription>All catalogues created by this user</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {catalogues.map((catalogue) => (
                  <div
                    key={catalogue.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Catalog className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{catalogue.title}</h3>
                          {getStatusBadge(catalogue.status)}
                        </div>
                        <p className="text-sm text-muted-foreground">{catalogue.description}</p>
                        <div className="flex items-center space-x-4 text-xs text-muted-foreground mt-1">
                          <span>{catalogue.products} products</span>
                          <span>{catalogue.views} views</span>
                          <span>{catalogue.shares} shares</span>
                          <span>Created {catalogue.createdAt}</span>
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Catalogue
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Details
                        </DropdownMenuItem>
                        {catalogue.status === "published" ? (
                          <DropdownMenuItem className="text-orange-600">
                            <Ban className="mr-2 h-4 w-4" />
                            Unpublish
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-600">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Publish
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Catalogue
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Products</CardTitle>
              <CardDescription>All products created by this user</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {products.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                        <Package className="h-5 w-5 text-secondary" />
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <h3 className="font-semibold">{product.name}</h3>
                          {getStatusBadge(product.status)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{product.category}</span>
                          <span className="font-medium text-foreground">{product.price}</span>
                          <span>Created {product.createdAt}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          In catalogues: {product.catalogues.join(", ")}
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          View Product
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Product
                        </DropdownMenuItem>
                        {product.status === "active" ? (
                          <DropdownMenuItem className="text-orange-600">
                            <Ban className="mr-2 h-4 w-4" />
                            Deactivate
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-green-600">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Activate
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem className="text-red-600">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Product
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Activity Log</CardTitle>
              <CardDescription>Recent user activity and system events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { action: "Created new catalogue", details: "Summer Collection 2024", time: "2 hours ago" },
                  { action: "Added product", details: "Wireless Bluetooth Headphones", time: "1 day ago" },
                  { action: "Shared catalogue", details: "Tech Gadgets Showcase", time: "2 days ago" },
                  { action: "Updated profile", details: "Changed profile picture", time: "1 week ago" },
                  { action: "Login", details: "Successful login from Chrome", time: "2 weeks ago" },
                ].map((activity, index) => (
                  <div key={index} className="flex items-center space-x-4 p-3 rounded-lg bg-accent/30">
                    <div className="w-2 h-2 bg-primary rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">{activity.details}</p>
                    </div>
                    <div className="text-xs text-muted-foreground">{activity.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
