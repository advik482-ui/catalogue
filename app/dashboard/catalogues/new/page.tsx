"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Save, Eye, Search, Loader2 } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { FirebaseService } from "@/lib/firebase"
import type { Product, Catalogue, CatalogueSettings } from "@/lib/database-schema"
import { useToast } from "@/hooks/use-toast"

export default function NewCataloguePage() {
  const router = useRouter()
  const { toast } = useToast()

  const [products, setProducts] = useState<Product[]>([])
  const [selectedProducts, setSelectedProducts] = useState<string[]>([])
  const [catalogueName, setCatalogueName] = useState("")
  const [catalogueDescription, setCatalogueDescription] = useState("")
  const [visibleFields, setVisibleFields] = useState<string[]>(["name", "price", "description"])
  const [settings, setSettings] = useState<CatalogueSettings>({
    theme: "modern",
    primaryColor: "#2563eb",
    showPrices: true,
    showContactInfo: true,
    allowComparison: true,
    showFilters: true,
    showSearch: true,
    itemsPerPage: 12,
    sortBy: "name",
    sortOrder: "asc",
  })
  const [isPublic, setIsPublic] = useState(true)
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        // Get current user ID (in real app, this would come from auth context)
        const userId = "current-user-id" // TODO: Replace with real user ID from auth
        const userProducts = await FirebaseService.getUserProducts(userId)
        setProducts(userProducts)
      } catch (error) {
        console.error("Error loading products:", error)
        toast({
          title: "Error",
          description: "Failed to load products. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadProducts()
  }, [toast])

  const toggleProduct = (productId: string) => {
    setSelectedProducts((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }

  const toggleField = (fieldId: string) => {
    setVisibleFields((prev) => (prev.includes(fieldId) ? prev.filter((id) => id !== fieldId) : [...prev, fieldId]))
  }

  const handleSave = async () => {
    if (!catalogueName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a catalogue name.",
        variant: "destructive",
      })
      return
    }

    if (selectedProducts.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one product.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const userId = "current-user-id" // TODO: Replace with real user ID from auth
      const slug = catalogueName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")

      const catalogueData: Partial<Catalogue> = {
        name: catalogueName,
        description: catalogueDescription,
        slug: `${slug}-${Date.now()}`, // Make unique
        selectedProducts,
        visibleFields,
        settings,
        isPublic,
        password: password || undefined,
        status: "active",
        views: 0,
        shares: 0,
      }

      const catalogueId = await FirebaseService.createCatalogue(userId, catalogueData)

      toast({
        title: "Success",
        description: "Catalogue saved successfully!",
      })

      router.push(`/dashboard/catalogues`)
    } catch (error) {
      console.error("Error saving catalogue:", error)
      toast({
        title: "Error",
        description: "Failed to save catalogue. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePreview = async () => {
    if (!catalogueName.trim() || selectedProducts.length === 0) {
      toast({
        title: "Error",
        description: "Please enter a name and select products before previewing.",
        variant: "destructive",
      })
      return
    }

    // Create a temporary preview URL with current data
    const previewData = {
      name: catalogueName,
      description: catalogueDescription,
      selectedProducts,
      visibleFields,
      settings,
      products: products.filter((p) => selectedProducts.includes(p.id)),
    }

    // Store preview data in sessionStorage for the preview page
    sessionStorage.setItem("cataloguePreview", JSON.stringify(previewData))

    // Open preview in new tab
    window.open("/preview/catalogue", "_blank")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/catalogues">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Catalogues
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-black font-montserrat text-foreground">Create Catalogue</h1>
            <p className="text-muted-foreground mt-2">Build a dynamic catalogue from your products</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handlePreview}>
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Catalogue
          </Button>
        </div>
      </div>

      <Tabs defaultValue="setup" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="setup">Setup</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="design">Design</TabsTrigger>
          <TabsTrigger value="sharing">Sharing</TabsTrigger>
        </TabsList>

        {/* Setup Tab */}
        <TabsContent value="setup" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="shadow-marketplace">
                <CardHeader>
                  <CardTitle className="font-montserrat">Catalogue Information</CardTitle>
                  <CardDescription>Basic details about your catalogue</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="font-semibold">
                      Catalogue Name *
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter catalogue name"
                      value={catalogueName}
                      onChange={(e) => setCatalogueName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description" className="font-semibold">
                      Description
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your catalogue..."
                      rows={3}
                      value={catalogueDescription}
                      onChange={(e) => setCatalogueDescription(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="url" className="font-semibold">
                      Custom URL
                    </Label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-input bg-muted text-muted-foreground text-sm">
                        cataloguehub.com/c/
                      </span>
                      <Input
                        id="url"
                        placeholder="my-catalogue"
                        className="rounded-l-none"
                        value={catalogueName
                          .toLowerCase()
                          .replace(/[^a-z0-9\s-]/g, "")
                          .replace(/\s+/g, "-")}
                        readOnly
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card className="shadow-marketplace">
                <CardHeader>
                  <CardTitle className="font-montserrat">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary">{selectedProducts.length}</div>
                    <div className="text-sm text-muted-foreground">Products Selected</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-secondary">{products.length}</div>
                    <div className="text-sm text-muted-foreground">Total Products</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-accent">Draft</div>
                    <div className="text-sm text-muted-foreground">Status</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-6">
          <Card className="shadow-marketplace">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="font-montserrat">Select Products</CardTitle>
                  <CardDescription>Choose which products to include in your catalogue</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Search products..." className="pl-10 w-64" />
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {products.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">No products found. Create some products first.</p>
                  <Button asChild className="mt-4">
                    <Link href="/dashboard/products/new">Create Product</Link>
                  </Button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {products.map((product) => (
                      <Card
                        key={product.id}
                        className={`cursor-pointer transition-all ${
                          selectedProducts.includes(product.id)
                            ? "ring-2 ring-primary shadow-marketplace-lg"
                            : "shadow-marketplace hover:shadow-marketplace-lg"
                        }`}
                        onClick={() => toggleProduct(product.id)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <Checkbox
                              checked={selectedProducts.includes(product.id)}
                              onChange={() => toggleProduct(product.id)}
                              className="mt-1"
                            />
                            <Image
                              src={product.images?.[0] || "/placeholder.svg?height=60&width=60"}
                              alt={product.name}
                              width={60}
                              height={60}
                              className="rounded-lg object-cover"
                            />
                            <div className="flex-1">
                              <h3 className="font-semibold font-montserrat">{product.name}</h3>
                              <p className="text-sm text-muted-foreground">{product.categoryName}</p>
                              {product.price && (
                                <p className="text-lg font-bold text-primary mt-1">
                                  {product.currency || "$"}
                                  {product.price}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {selectedProducts.length > 0 && (
                    <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold">
                          {selectedProducts.length} product{selectedProducts.length !== 1 ? "s" : ""} selected
                        </span>
                        <Button variant="outline" size="sm" onClick={() => setSelectedProducts([])}>
                          Clear Selection
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Design Tab */}
        <TabsContent value="design" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="shadow-marketplace">
              <CardHeader>
                <CardTitle className="font-montserrat">Field Visibility</CardTitle>
                <CardDescription>Control which product information to show</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { id: "name", label: "Product Name" },
                  { id: "price", label: "Price" },
                  { id: "description", label: "Description" },
                  { id: "category", label: "Category" },
                  { id: "images", label: "Images" },
                  { id: "customFields", label: "Custom Fields" },
                ].map((field) => (
                  <div key={field.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={field.id}
                      checked={visibleFields.includes(field.id)}
                      onCheckedChange={() => toggleField(field.id)}
                    />
                    <Label htmlFor={field.id}>{field.label}</Label>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="shadow-marketplace">
              <CardHeader>
                <CardTitle className="font-montserrat">Layout Settings</CardTitle>
                <CardDescription>Customize the display options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Show Prices</Label>
                  <Checkbox
                    checked={settings.showPrices}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, showPrices: !!checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Allow Comparison</Label>
                  <Checkbox
                    checked={settings.allowComparison}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, allowComparison: !!checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Show Filters</Label>
                  <Checkbox
                    checked={settings.showFilters}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, showFilters: !!checked }))}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label>Show Search</Label>
                  <Checkbox
                    checked={settings.showSearch}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, showSearch: !!checked }))}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Sharing Tab */}
        <TabsContent value="sharing" className="space-y-6">
          <Card className="shadow-marketplace">
            <CardHeader>
              <CardTitle className="font-montserrat">Sharing Settings</CardTitle>
              <CardDescription>Control how your catalogue can be accessed and shared</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-semibold">Public Access</Label>
                    <p className="text-sm text-muted-foreground">Anyone with the link can view this catalogue</p>
                  </div>
                  <Checkbox checked={isPublic} onCheckedChange={(checked) => setIsPublic(!!checked)} />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-semibold">Contact Information</Label>
                    <p className="text-sm text-muted-foreground">Show your contact details on the catalogue</p>
                  </div>
                  <Checkbox
                    checked={settings.showContactInfo}
                    onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, showContactInfo: !!checked }))}
                  />
                </div>
              </div>

              {password && (
                <div className="space-y-2">
                  <Label htmlFor="password" className="font-semibold">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
