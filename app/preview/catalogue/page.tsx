"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Image from "next/image"

export default function CataloguePreviewPage() {
  const [previewData, setPreviewData] = useState<any>(null)

  useEffect(() => {
    const data = sessionStorage.getItem("cataloguePreview")
    if (data) {
      setPreviewData(JSON.parse(data))
    }
  }, [])

  if (!previewData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>No preview data found. Please go back and try again.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => window.close()}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Close Preview
          </Button>
          <div className="text-center">
            <h1 className="text-3xl font-bold font-montserrat">{previewData.name}</h1>
            {previewData.description && <p className="text-muted-foreground mt-2">{previewData.description}</p>}
          </div>
          <div></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewData.products.map((product: any) => (
            <Card key={product.id} className="shadow-marketplace">
              <CardContent className="p-4">
                {previewData.visibleFields.includes("images") && product.images?.[0] && (
                  <Image
                    src={product.images[0] || "/placeholder.svg"}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}

                {previewData.visibleFields.includes("name") && (
                  <h3 className="font-semibold font-montserrat text-lg mb-2">{product.name}</h3>
                )}

                {previewData.visibleFields.includes("category") && (
                  <p className="text-sm text-muted-foreground mb-2">{product.categoryName}</p>
                )}

                {previewData.visibleFields.includes("description") && product.description && (
                  <p className="text-sm text-muted-foreground mb-3">{product.description}</p>
                )}

                {previewData.visibleFields.includes("price") && product.price && previewData.settings.showPrices && (
                  <p className="text-xl font-bold text-primary">
                    {product.currency || "$"}
                    {product.price}
                  </p>
                )}

                {previewData.visibleFields.includes("customFields") && product.customFields?.length > 0 && (
                  <div className="mt-3 space-y-1">
                    {product.customFields.map((field: any, index: number) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">{field.fieldName}:</span> {field.value}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
