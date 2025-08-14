"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Upload, Plus, X, Save, Eye, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FirebaseService } from "@/lib/firebase"
import type { FieldTemplate, Product, ProductField } from "@/lib/database-schema"
import { useToast } from "@/hooks/use-toast"

export default function NewProductPage() {
  const [selectedTemplate, setSelectedTemplate] = useState<FieldTemplate | null>(null)
  const [templates, setTemplates] = useState<FieldTemplate[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    categoryId: "",
    categoryName: "",
    tags: [] as string[],
    status: "draft" as "active" | "draft" | "archived",
    customFields: [] as ProductField[],
    images: [] as string[],
  })
  const [newTag, setNewTag] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const loadData = async () => {
      try {
        const userId = "current-user-id" // TODO: Replace with real user ID from auth

        // Load field templates
        const userTemplates = await FirebaseService.getUserFieldTemplates(userId)
        setTemplates(userTemplates)

        // Load categories
        const userCategories = await FirebaseService.getUserCategories(userId)
        setCategories(userCategories.map((cat) => cat.name))

        // Auto-select first template if available
        if (userTemplates.length > 0) {
          setSelectedTemplate(userTemplates[0])
          // Initialize custom fields from template
          const initialFields = userTemplates[0].fields.map((field) => ({
            fieldId: field.id,
            fieldName: field.name,
            fieldType: field.type,
            value: getDefaultValue(field.type),
            unit: field.unit,
          }))
          setProductData((prev) => ({ ...prev, customFields: initialFields }))
        }
      } catch (error) {
        console.error("Error loading data:", error)
        toast({
          title: "Error",
          description: "Failed to load templates and categories.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [toast])

  const getDefaultValue = (fieldType: string) => {
    switch (fieldType) {
      case "number":
      case "percentage":
        return 0
      case "boolean":
        return false
      case "date":
        return new Date().toISOString().split("T")[0]
      default:
        return ""
    }
  }

  const handleSave = async () => {
    if (!productData.name.trim()) {
      toast({
        title: "Error",
        description: "Product name is required.",
        variant: "destructive",
      })
      return
    }

    if (!productData.categoryName.trim()) {
      toast({
        title: "Error",
        description: "Category is required.",
        variant: "destructive",
      })
      return
    }

    setSaving(true)
    try {
      const userId = "current-user-id" // TODO: Replace with real user ID from auth

      const newProduct: Partial<Product> = {
        name: productData.name,
        description: productData.description,
        price: productData.price,
        currency: "USD",
        images: productData.images,
        categoryId: productData.categoryId || `cat-${Date.now()}`,
        categoryName: productData.categoryName,
        templateId: selectedTemplate?.id,
        customFields: productData.customFields,
        tags: productData.tags,
        status: productData.status,
        sku: `SKU-${Date.now()}`,
      }

      await FirebaseService.createProduct(userId, newProduct)

      toast({
        title: "Success",
        description: "Product created successfully!",
      })

      router.push("/dashboard/products")
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const addTag = () => {
    if (newTag.trim() && !productData.tags.includes(newTag.trim())) {
      setProductData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setProductData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const updateCustomField = (fieldId: string, value: any) => {
    setProductData((prev) => ({
      ...prev,
      customFields: prev.customFields.map((field) => (field.fieldId === fieldId ? { ...field, value } : field)),
    }))
  }

  const handleTemplateChange = (templateId: string) => {
    const template = templates.find((t) => t.id === templateId)
    setSelectedTemplate(template || null)

    if (template) {
      // Initialize custom fields from new template
      const initialFields = template.fields.map((field) => ({
        fieldId: field.id,
        fieldName: field.name,
        fieldType: field.type,
        value: getDefaultValue(field.type),
        unit: field.unit,
      }))
      setProductData((prev) => ({
        ...prev,
        customFields: initialFields,
        categoryName: template.category || prev.categoryName,
      }))
    }
  }

  const renderCustomField = (field: ProductField, templateField: any) => {
    const value = field.value

    switch (field.fieldType) {
      case "text":
        return (
          <Input
            value={value || ""}
            onChange={(e) => updateCustomField(field.fieldId, e.target.value)}
            placeholder={templateField?.placeholder}
          />
        )
      case "textarea":
        return (
          <Textarea
            value={value || ""}
            onChange={(e) => updateCustomField(field.fieldId, e.target.value)}
            placeholder={templateField?.placeholder}
            rows={3}
          />
        )
      case "number":
        return (
          <div className="flex space-x-2">
            <Input
              type="number"
              value={value || ""}
              onChange={(e) => updateCustomField(field.fieldId, Number.parseFloat(e.target.value) || 0)}
              placeholder={templateField?.placeholder}
              min={templateField?.min}
              max={templateField?.max}
            />
            {field.unit && <span className="flex items-center text-sm text-muted-foreground">{field.unit}</span>}
          </div>
        )
      case "percentage":
        return (
          <div className="flex space-x-2">
            <Input
              type="number"
              value={value || ""}
              onChange={(e) => updateCustomField(field.fieldId, Number.parseFloat(e.target.value) || 0)}
              placeholder={templateField?.placeholder}
              min={0}
              max={100}
            />
            <span className="flex items-center text-sm text-muted-foreground">%</span>
          </div>
        )
      case "select":
      case "category":
        return (
          <Select value={value || ""} onValueChange={(val) => updateCustomField(field.fieldId, val)}>
            <SelectTrigger>
              <SelectValue placeholder={templateField?.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {templateField?.options?.map((option: string) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      case "boolean":
        return (
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={value === true}
              onChange={(e) => updateCustomField(field.fieldId, e.target.checked)}
              className="rounded"
            />
            <Label>Yes</Label>
          </div>
        )
      case "date":
        return (
          <Input type="date" value={value || ""} onChange={(e) => updateCustomField(field.fieldId, e.target.value)} />
        )
      case "url":
        return (
          <Input
            type="url"
            value={value || ""}
            onChange={(e) => updateCustomField(field.fieldId, e.target.value)}
            placeholder={templateField?.placeholder || "https://example.com"}
          />
        )
      case "email":
        return (
          <Input
            type="email"
            value={value || ""}
            onChange={(e) => updateCustomField(field.fieldId, e.target.value)}
            placeholder={templateField?.placeholder || "email@example.com"}
          />
        )
      case "phone":
        return (
          <Input
            type="tel"
            value={value || ""}
            onChange={(e) => updateCustomField(field.fieldId, e.target.value)}
            placeholder={templateField?.placeholder || "+1 (555) 123-4567"}
          />
        )
      default:
        return (
          <Input
            value={value || ""}
            onChange={(e) => updateCustomField(field.fieldId, e.target.value)}
            placeholder={templateField?.placeholder}
          />
        )
    }
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
            <Link href="/dashboard/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-black font-montserrat text-foreground">Add New Product</h1>
            <p className="text-muted-foreground mt-2">Create a new product with custom fields</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Save Product
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Template Selection */}
          <Card className="shadow-marketplace">
            <CardHeader>
              <CardTitle className="font-montserrat">Field Template</CardTitle>
              <CardDescription>Choose a template to define your product fields</CardDescription>
            </CardHeader>
            <CardContent>
              {templates.length > 0 ? (
                <Select value={selectedTemplate?.id || ""} onValueChange={handleTemplateChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a field template" />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name} ({template.fields.length} fields)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <div className="text-center py-4">
                  <p className="text-muted-foreground mb-3">No field templates found.</p>
                  <Button asChild>
                    <Link href="/dashboard/field-templates/new">Create Field Template</Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Basic Information */}
          <Card className="shadow-marketplace">
            <CardHeader>
              <CardTitle className="font-montserrat">Basic Information</CardTitle>
              <CardDescription>Essential details about your product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="font-semibold">
                    Product Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="Enter product name"
                    value={productData.name}
                    onChange={(e) => setProductData((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category" className="font-semibold">
                    Category *
                  </Label>
                  {categories.length > 0 ? (
                    <Select
                      value={productData.categoryName}
                      onValueChange={(value) =>
                        setProductData((prev) => ({
                          ...prev,
                          categoryName: value,
                          categoryId: `cat-${value.toLowerCase().replace(/\s+/g, "-")}`,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input
                      id="category"
                      placeholder="Enter category"
                      value={productData.categoryName}
                      onChange={(e) =>
                        setProductData((prev) => ({
                          ...prev,
                          categoryName: e.target.value,
                          categoryId: `cat-${e.target.value.toLowerCase().replace(/\s+/g, "-")}`,
                        }))
                      }
                    />
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-semibold">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your product in detail..."
                  rows={4}
                  value={productData.description}
                  onChange={(e) => setProductData((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price" className="font-semibold">
                    Price (USD)
                  </Label>
                  <Input
                    id="price"
                    type="number"
                    placeholder="0.00"
                    step="0.01"
                    value={productData.price || ""}
                    onChange={(e) =>
                      setProductData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 }))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status" className="font-semibold">
                    Status
                  </Label>
                  <Select
                    value={productData.status}
                    onValueChange={(value: "active" | "draft" | "archived") =>
                      setProductData((prev) => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card className="shadow-marketplace">
            <CardHeader>
              <CardTitle className="font-montserrat">Product Images</CardTitle>
              <CardDescription>Upload multiple images to showcase your product</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Upload Images</h3>
                <p className="text-muted-foreground mb-4">Drag and drop images here, or click to browse</p>
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Files
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Dynamic Custom Fields */}
          {selectedTemplate && productData.customFields.length > 0 && (
            <Card className="shadow-marketplace">
              <CardHeader>
                <CardTitle className="font-montserrat">Custom Fields</CardTitle>
                <CardDescription>Product-specific information from your template</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {productData.customFields.map((field) => {
                  const templateField = selectedTemplate.fields.find((f) => f.id === field.fieldId)
                  return (
                    <div key={field.fieldId} className="space-y-2">
                      <Label className="font-semibold">
                        {field.fieldName}
                        {templateField?.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {renderCustomField(field, templateField)}
                      {templateField?.description && (
                        <p className="text-sm text-muted-foreground">{templateField.description}</p>
                      )}
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Tags */}
          <Card className="shadow-marketplace">
            <CardHeader>
              <CardTitle className="font-montserrat">Tags</CardTitle>
              <CardDescription>Add tags to help organize your products</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Add tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                />
                <Button onClick={addTag}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {productData.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                    <button onClick={() => removeTag(tag)} className="ml-1 hover:text-red-600">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Template Info */}
          {selectedTemplate && (
            <Card className="shadow-marketplace">
              <CardHeader>
                <CardTitle className="font-montserrat">Template Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <span className="font-semibold">Template:</span> {selectedTemplate.name}
                </div>
                <div>
                  <span className="font-semibold">Fields:</span> {selectedTemplate.fields.length}
                </div>
                <div>
                  <span className="font-semibold">Category:</span> {selectedTemplate.category}
                </div>
                {selectedTemplate.description && (
                  <div>
                    <span className="font-semibold">Description:</span>
                    <p className="text-sm text-muted-foreground mt-1">{selectedTemplate.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
