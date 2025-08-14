"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MobileShareSheet } from "@/components/mobile-share-sheet"
import { DynamicComparisonDrawer } from "@/components/dynamic-comparison-drawer"
import {
  Search,
  Grid,
  List,
  Heart,
  Share2,
  Phone,
  Mail,
  MapPin,
  Star,
  Eye,
  ShoppingCart,
  ArrowUpDown,
  Plus,
  Minus,
  GitCompare,
  Filter,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { FirebaseService } from "@/lib/firebase"

export default function PublicCataloguePage({ params }: { params: { slug: string } }) {
  const [catalogue, setCatalogue] = useState<any>(null)
  const [products, setProducts] = useState<any[]>([])
  const [owner, setOwner] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("name")
  const [favorites, setFavorites] = useState<number[]>([])
  const [compareProducts, setCompareProducts] = useState<number[]>([])
  const [showComparison, setShowComparison] = useState(false)
  const [showMobileFilters, setShowMobileFilters] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadCatalogue = async () => {
      try {
        setLoading(true)
        setError(null)

        const catalogueData = await FirebaseService.getCatalogueWithDetails(params.slug)

        if (!catalogueData) {
          setError("Catalogue not found")
          setLoading(false)
          return
        }

        setCatalogue(catalogueData.catalogue)
        setProducts(catalogueData.products || [])
        setOwner(catalogueData.owner)
      } catch (error) {
        console.error("Error loading catalogue:", error)
        setError("Failed to load catalogue. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadCatalogue()
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading catalogue...</p>
        </div>
      </div>
    )
  }

  if (error || !catalogue) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="shadow-marketplace max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <h1 className="text-2xl font-bold font-montserrat mb-4">
              {error === "Catalogue not found" ? "Catalogue Not Found" : "Error Loading Catalogue"}
            </h1>
            <p className="text-muted-foreground mb-6">
              {error || "The catalogue you're looking for doesn't exist or has been removed."}
            </p>
            <Link href="/">
              <Button>Go to CatalogueHub</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))]

  const filteredProducts = products
    .filter((product) => {
      const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.price || 0) - (b.price || 0)
        case "price-high":
          return (b.price || 0) - (a.price || 0)
        case "rating":
          return (b.rating || 0) - (a.rating || 0)
        default:
          return a.name.localeCompare(b.name)
      }
    })

  const toggleFavorite = (productId: number) => {
    setFavorites((prev) => (prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]))
  }

  const toggleCompare = (productId: number) => {
    setCompareProducts((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId)
      } else if (prev.length < 4) {
        return [...prev, productId]
      }
      return prev
    })
  }

  const getComparedProducts = () => {
    return products.filter((product) => compareProducts.includes(product.id))
  }

  const catalogueUrl = `${typeof window !== "undefined" ? window.location.origin : "https://cataloguehub.com"}/c/${params.slug}`

  if (showComparison && compareProducts.length > 0) {
    return (
      <DynamicComparisonDrawer
        products={getComparedProducts()}
        onRemoveProduct={toggleCompare}
        onBackToCatalogue={() => setShowComparison(false)}
        catalogueName={catalogue.name}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile-Optimized Header */}
      <header className="bg-background border-b sticky top-0 z-50 backdrop-blur-sm bg-background/95">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-xl font-black font-montserrat text-foreground truncate pr-2">{catalogue.name}</h1>
            <div className="flex items-center space-x-2 flex-shrink-0">
              <MobileShareSheet
                catalogueUrl={catalogueUrl}
                catalogueName={catalogue.name}
                catalogueDescription={catalogue.description}
              >
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4" />
                </Button>
              </MobileShareSheet>
              <Button variant="outline" size="sm">
                <Heart className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Search */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Mobile Toolbar */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="bg-transparent"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              {compareProducts.length > 0 && (
                <Button variant="outline" size="sm" className="bg-transparent" onClick={() => setShowComparison(true)}>
                  <GitCompare className="h-4 w-4 mr-2" />
                  Compare ({compareProducts.length})
                </Button>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="name">Name A-Z</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Category Filter */}
          {showMobileFilters && (
            <div className="mt-3 pt-3 border-t">
              <div className="flex space-x-2 overflow-x-auto pb-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="whitespace-nowrap flex-shrink-0 bg-transparent"
                  >
                    {category === "all" ? "All" : category}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="px-4 py-4">
        {/* Catalogue Description */}
        {catalogue.description && (
          <Card className="shadow-marketplace mb-4">
            <CardContent className="p-4">
              <p className="text-muted-foreground text-sm">{catalogue.description}</p>
            </CardContent>
          </Card>
        )}

        {/* Mobile Products Grid */}
        <div className={viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 gap-4" : "space-y-4"}>
          {filteredProducts.map((product) => (
            <Card
              key={product.id}
              className={`shadow-marketplace hover:shadow-marketplace-lg transition-all group ${
                viewMode === "list" ? "flex" : ""
              } ${compareProducts.includes(product.id) ? "ring-2 ring-primary" : ""}`}
            >
              <div className={viewMode === "list" ? "flex w-full" : ""}>
                {/* Product Image */}
                <div className={`relative ${viewMode === "list" ? "w-24 h-24 flex-shrink-0" : "aspect-square"}`}>
                  <Image
                    src={product.images?.[0] || "/placeholder.svg?height=300&width=300&query=product"}
                    alt={product.name}
                    fill
                    className="object-cover rounded-t-lg group-hover:scale-105 transition-transform"
                  />
                  {product.status === "out-of-stock" && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-lg">
                      <Badge variant="secondary" className="text-xs">
                        Out of Stock
                      </Badge>
                    </div>
                  )}
                  <div className="absolute top-2 right-2 flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 bg-background/80 hover:bg-background"
                      onClick={() => toggleFavorite(product.id)}
                    >
                      <Heart
                        className={`h-3 w-3 ${favorites.includes(product.id) ? "fill-red-500 text-red-500" : ""}`}
                      />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`h-8 w-8 p-0 bg-background/80 hover:bg-background ${
                        compareProducts.includes(product.id) ? "bg-primary text-primary-foreground" : ""
                      }`}
                      onClick={() => toggleCompare(product.id)}
                      disabled={!compareProducts.includes(product.id) && compareProducts.length >= 4}
                    >
                      {compareProducts.includes(product.id) ? (
                        <Minus className="h-3 w-3" />
                      ) : (
                        <Plus className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <CardContent className={`p-3 ${viewMode === "list" ? "flex-1" : ""}`}>
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold font-montserrat text-sm leading-tight">{product.name}</h3>
                      {product.category && (
                        <Badge variant="outline" className="ml-2 flex-shrink-0 text-xs">
                          {product.category}
                        </Badge>
                      )}
                    </div>

                    {product.rating && (
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < Math.floor(product.rating) ? "fill-teal-400 text-teal-400" : "text-muted-foreground"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">{product.rating}</span>
                      </div>
                    )}

                    <p className="text-muted-foreground text-xs line-clamp-2">{product.description}</p>

                    {product.customFields && viewMode === "grid" && (
                      <div className="flex flex-wrap gap-1">
                        {Object.entries(product.customFields)
                          .slice(0, 2)
                          .map(([key, value]) => (
                            <Badge key={key} variant="secondary" className="text-xs">
                              {key}: {String(value)}
                            </Badge>
                          ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center space-x-2">
                        {product.price && <span className="text-lg font-bold text-primary">${product.price}</span>}
                      </div>
                      <div className="flex space-x-1">
                        <Button variant="outline" size="sm" className="text-xs px-2 bg-transparent">
                          <Eye className="h-3 w-3 mr-1" />
                          View
                        </Button>
                        <Button size="sm" disabled={product.status === "out-of-stock"} className="text-xs px-2">
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          {product.status === "out-of-stock" ? "N/A" : "Inquire"}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <Card className="shadow-marketplace">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Search className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold font-montserrat mb-2">No products found</h3>
              <p className="text-muted-foreground text-center mb-6 text-sm">
                Try adjusting your search or filter criteria
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                  setShowMobileFilters(false)
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Mobile Contact Footer */}
      {owner && (
        <div className="bg-muted p-4 mt-8">
          <Card className="shadow-marketplace">
            <CardContent className="p-4">
              <h3 className="font-semibold font-montserrat mb-3 text-center">Contact {owner.name}</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-4">
                  <Link
                    href={`mailto:${owner.email}`}
                    className="flex items-center space-x-2 text-primary hover:underline"
                  >
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">Email</span>
                  </Link>
                  {owner.phone && (
                    <Link
                      href={`tel:${owner.phone}`}
                      className="flex items-center space-x-2 text-primary hover:underline"
                    >
                      <Phone className="h-4 w-4" />
                      <span className="text-sm">Call</span>
                    </Link>
                  )}
                </div>
                {owner.location && (
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{owner.location}</span>
                  </div>
                )}
                <Button className="w-full" size="sm">
                  <Mail className="h-4 w-4 mr-2" />
                  Get Quote
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-background border-t py-6 px-4">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-sm text-muted-foreground">Powered by</span>
            <Link href="/" className="text-primary font-semibold hover:underline">
              CatalogueHub
            </Link>
          </div>
          <Button variant="ghost" size="sm" className="text-xs">
            Create Your Own Catalogue
          </Button>
        </div>
      </footer>
    </div>
  )
}
