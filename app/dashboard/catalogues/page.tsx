import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Copy, Eye, Share2, FolderOpen } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function CataloguesPage() {
  const catalogues = [
    {
      id: 1,
      name: "Office Furniture Collection",
      description: "Premium office furniture for modern workspaces",
      products: 12,
      views: 342,
      shares: 12,
      status: "Published",
      lastUpdated: "2 hours ago",
      shareUrl: "office-furniture-2024",
    },
    {
      id: 2,
      name: "Tech Accessories",
      description: "Latest technology accessories and gadgets",
      products: 8,
      views: 289,
      shares: 8,
      status: "Published",
      lastUpdated: "1 day ago",
      shareUrl: "tech-accessories",
    },
    {
      id: 3,
      name: "Home Decor Essentials",
      description: "Beautiful home decoration items",
      products: 15,
      views: 156,
      shares: 5,
      status: "Draft",
      lastUpdated: "3 days ago",
      shareUrl: "home-decor-draft",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-montserrat text-foreground">Catalogues</h1>
          <p className="text-muted-foreground mt-2">Create and manage your product catalogues</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/catalogues/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Catalogue
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-marketplace">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search catalogues..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Catalogues Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {catalogues.map((catalogue) => (
          <Card key={catalogue.id} className="shadow-marketplace hover:shadow-marketplace-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <CardTitle className="text-xl font-montserrat">{catalogue.name}</CardTitle>
                    <Badge variant={catalogue.status === "Published" ? "default" : "secondary"}>
                      {catalogue.status}
                    </Badge>
                  </div>
                  <CardDescription className="text-base">{catalogue.description}</CardDescription>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="mr-2 h-4 w-4" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{catalogue.products}</div>
                  <div className="text-sm text-muted-foreground">Products</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-secondary">{catalogue.views}</div>
                  <div className="text-sm text-muted-foreground">Views</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">{catalogue.shares}</div>
                  <div className="text-sm text-muted-foreground">Shares</div>
                </div>
              </div>

              <div className="text-sm text-muted-foreground">
                <span>Updated {catalogue.lastUpdated}</span>
                <span className="mx-2">•</span>
                <span>/{catalogue.shareUrl}</span>
              </div>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                  <Link href={`/dashboard/catalogues/${catalogue.id}/edit`}>
                    <Edit className="mr-2 h-3 w-3" />
                    Edit
                  </Link>
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Share2 className="mr-2 h-3 w-3" />
                  Share
                </Button>
                <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                  <Eye className="mr-2 h-3 w-3" />
                  Preview
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {catalogues.length === 0 && (
        <Card className="shadow-marketplace">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FolderOpen className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold font-montserrat mb-2">No catalogues yet</h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              Create your first catalogue by selecting products from your inventory and customizing the layout.
            </p>
            <Button asChild>
              <Link href="/dashboard/catalogues/new">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Catalogue
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
