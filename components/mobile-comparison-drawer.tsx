"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Star, ShoppingCart, Eye, Minus } from "lucide-react"
import Image from "next/image"

interface Product {
  id: number
  name: string
  category: string
  price: number
  originalPrice?: number
  description: string
  image: string
  rating: number
  reviews: number
  features?: string[]
  inStock: boolean
  specifications?: Record<string, string>
}

interface MobileComparisonDrawerProps {
  products: Product[]
  onRemoveProduct: (productId: number) => void
  children: React.ReactNode
}

export function MobileComparisonDrawer({ products, onRemoveProduct, children }: MobileComparisonDrawerProps) {
  const getAllSpecificationKeys = () => {
    const allKeys = new Set<string>()
    products.forEach((product) => {
      if (product.specifications) {
        Object.keys(product.specifications).forEach((key) => allKeys.add(key))
      }
    })
    return Array.from(allKeys)
  }

  const specKeys = getAllSpecificationKeys()

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
            {products.map((product, index) => (
              <Card key={product.id} className="shadow-marketplace">
                <CardContent className="p-4">
                  <div className="flex items-start space-x-4">
                    {/* Product Image */}
                    <div className="relative w-20 h-20 flex-shrink-0">
                      <Image
                        src={product.image || "/placeholder.svg"}
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

                      <div className="flex items-center space-x-2 mb-2">
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

                  {/* Expandable Details */}
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Description</h4>
                      <p className="text-xs text-muted-foreground">{product.description}</p>
                    </div>

                    {product.features && (
                      <div>
                        <h4 className="font-semibold text-sm mb-1">Features</h4>
                        <div className="flex flex-wrap gap-1">
                          {product.features.map((feature, featureIndex) => (
                            <Badge key={featureIndex} variant="secondary" className="text-xs">
                              {feature}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {product.specifications && (
                      <div>
                        <h4 className="font-semibold text-sm mb-2">Specifications</h4>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          {Object.entries(product.specifications).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground capitalize">
                                {key.replace(/([A-Z])/g, " $1").trim()}:
                              </span>
                              <span className="font-medium">{value}</span>
                            </div>
                          ))}
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

          {/* Comparison Summary */}
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
                <div>
                  <span className="text-muted-foreground">Avg Rating:</span>
                  <div className="font-semibold">
                    {(products.reduce((sum, p) => sum + p.rating, 0) / products.length).toFixed(1)}
                  </div>
                </div>
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
        </div>
      </SheetContent>
    </Sheet>
  )
}
