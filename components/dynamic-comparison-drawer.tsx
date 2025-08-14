"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Star, ShoppingCart, Eye, Minus } from "lucide-react"
import Image from "next/image"
import type { CustomField } from "@/lib/field-builder"

interface DynamicProduct {
  id: number
  name: string
  description: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  customFields: Record<string, any>
  tags: string[]
  status: "active" | "draft" | "archived"
  inStock: boolean
  rating?: number
  reviews?: number
}

interface DynamicComparisonDrawerProps {
  products: DynamicProduct[]
  fieldDefinitions: CustomField[]
  onRemoveProduct: (productId: number) => void
  children: React.ReactNode
}

export function DynamicComparisonDrawer({
  products,
  fieldDefinitions,
  onRemoveProduct,
  children,
}: DynamicComparisonDrawerProps) {
  const getFieldValue = (product: DynamicProduct, fieldId: string) => {
    return product.customFields[fieldId] || "—"
  }

  const formatFieldValue = (value: any, fieldType: CustomField["type"]) => {
    if (value === "—" || value === null || value === undefined) return "—"

    switch (fieldType) {
      case "boolean":
        return value ? "Yes" : "No"
      case "number":
        return typeof value === "number" ? value.toLocaleString() : value
      case "date":
        return value ? new Date(value).toLocaleDateString() : "—"
      case "url":
        return value ? (
          <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
            View Link
          </a>
        ) : (
          "—"
        )
      case "email":
        return value ? (
          <a href={`mailto:${value}`} className="text-primary hover:underline">
            {value}
          </a>
        ) : (
          "—"
        )
      case "multiselect":
        return Array.isArray(value) ? value.join(", ") : value
      default:
        return value
    }
  }

  const getAvailableFields = () => {
    const fieldsWithData = fieldDefinitions.filter((field) =>
      products.some(
        (product) =>
          product.customFields[field.id] !== undefined &&
          product.customFields[field.id] !== null &&
          product.customFields[field.id] !== "",
      ),
    )
    return fieldsWithData
  }

  const availableFields = getAvailableFields()

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="h-[90vh] overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle className="font-montserrat">Compare Products</SheetTitle>
          <SheetDescription>Compare {products.length} products side by side</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Mobile Comparison Cards */}
          <div className="space-y-4">
            {products.map((product) => (
              <Card key={product.id} className="shadow-marketplace">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover rounded-lg"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 bg-background shadow-md"
                        onClick={() => onRemoveProduct(product.id)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold font-montserrat text-sm leading-tight truncate pr-2">
                          {product.name}
                        </h3>
                        <Badge variant="outline" className="flex-shrink-0 text-xs">
                          {product.category}
                        </Badge>
                      </div>

                      {product.rating && (
                        <div className="flex items-center space-x-2 mb-2">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-3 w-3 ${
                                  i < Math.floor(product.rating!)
                                    ? "fill-teal-400 text-teal-400"
                                    : "text-muted-foreground"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-xs text-muted-foreground">{product.rating}</span>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-primary">${product.price}</span>
                          {product.originalPrice && (
                            <span className="text-xs text-muted-foreground line-through">${product.originalPrice}</span>
                          )}
                        </div>
                        <Badge variant={product.inStock ? "default" : "secondary"} className="text-xs">
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Custom Fields */}
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Description</h4>
                      <p className="text-xs text-muted-foreground">{product.description}</p>
                    </div>

                    {product.tags && product.tags.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Tags</h4>
                        <div className="flex flex-wrap gap-1">
                          {product.tags.map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {availableFields.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Product Details</h4>
                        <div className="grid grid-cols-1 gap-2 text-xs">
                          {availableFields.map((field) => {
                            const value = getFieldValue(product, field.id)
                            if (value === "—") return null

                            return (
                              <div key={field.id} className="flex justify-between">
                                <span className="text-muted-foreground">{field.name}:</span>
                                <span className="font-medium">{formatFieldValue(value, field.type)}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )}

                    <div className="flex space-x-2 pt-2">
                      <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" className="flex-1" disabled={!product.inStock}>
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        {product.inStock ? "Inquire" : "Unavailable"}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Dynamic Comparison Summary */}
          <Card className="shadow-marketplace bg-primary/5">
            <CardContent className="p-4">
              <h3 className="font-semibold font-montserrat mb-3">Quick Comparison</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Price Range:</span>
                  <div className="font-semibold">
                    ${Math.min(...products.map((p) => p.price))} - ${Math.max(...products.map((p) => p.price))}
                  </div>
                </div>
                {products.some((p) => p.rating) && (
                  <div>
                    <span className="text-muted-foreground">Avg Rating:</span>
                    <div className="font-semibold">
                      {(
                        products.filter((p) => p.rating).reduce((sum, p) => sum + (p.rating || 0), 0) /
                        products.filter((p) => p.rating).length
                      ).toFixed(1)}
                    </div>
                  </div>
                )}
                <div>
                  <span className="text-muted-foreground">In Stock:</span>
                  <div className="font-semibold">
                    {products.filter((p) => p.inStock).length} of {products.length}
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Categories:</span>
                  <div className="font-semibold">{new Set(products.map((p) => p.category)).size}</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Field-by-Field Comparison */}
          {availableFields.length > 0 && (
            <Card className="shadow-marketplace">
              <CardContent className="p-4">
                <h3 className="font-semibold font-montserrat mb-3">Detailed Comparison</h3>
                <div className="space-y-3">
                  {availableFields.map((field) => (
                    <div key={field.id} className="border-b pb-2 last:border-b-0">
                      <h4 className="font-medium text-sm mb-2">{field.name}</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {products.map((product) => {
                          const value = getFieldValue(product, field.id)
                          return (
                            <div key={product.id} className="flex justify-between text-xs">
                              <span className="text-muted-foreground truncate pr-2">{product.name}:</span>
                              <span className="font-medium">{formatFieldValue(value, field.type)}</span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
