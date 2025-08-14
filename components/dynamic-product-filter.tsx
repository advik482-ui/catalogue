"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { X, Filter } from "lucide-react"
import type { CustomField } from "@/lib/field-builder"

interface DynamicProduct {
  id: number
  name: string
  description: string
  price: number
  category: string
  customFields: Record<string, any>
  tags: string[]
  inStock: boolean
}

interface FilterState {
  priceRange: [number, number]
  categories: string[]
  tags: string[]
  inStockOnly: boolean
  customFields: Record<string, any>
}

interface DynamicProductFilterProps {
  products: DynamicProduct[]
  fieldDefinitions: CustomField[]
  categories: string[]
  onFilterChange: (filteredProducts: DynamicProduct[]) => void
  children: React.ReactNode
}

export function DynamicProductFilter({
  products,
  fieldDefinitions,
  categories,
  onFilterChange,
  children,
}: DynamicProductFilterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, Math.max(...products.map((p) => p.price), 1000)],
    categories: [],
    tags: [],
    inStockOnly: false,
    customFields: {},
  })

  const allTags = Array.from(new Set(products.flatMap((p) => p.tags)))
  const priceRange = [Math.min(...products.map((p) => p.price)), Math.max(...products.map((p) => p.price))]

  const getFieldOptions = (field: CustomField) => {
    if (field.type === "select" || field.type === "multiselect") {
      return field.options || []
    }

    // For other field types, get unique values from products
    const values = products
      .map((p) => p.customFields[field.id])
      .filter((v) => v !== undefined && v !== null && v !== "")

    if (field.type === "boolean") {
      return ["Yes", "No"]
    }

    return Array.from(new Set(values.map((v) => String(v))))
  }

  const applyFilters = (newFilters: FilterState) => {
    let filtered = products

    // Price range filter
    filtered = filtered.filter((p) => p.price >= newFilters.priceRange[0] && p.price <= newFilters.priceRange[1])

    // Category filter
    if (newFilters.categories.length > 0) {
      filtered = filtered.filter((p) => newFilters.categories.includes(p.category))
    }

    // Tags filter
    if (newFilters.tags.length > 0) {
      filtered = filtered.filter((p) => newFilters.tags.some((tag) => p.tags.includes(tag)))
    }

    // In stock filter
    if (newFilters.inStockOnly) {
      filtered = filtered.filter((p) => p.inStock)
    }

    // Custom fields filters
    Object.entries(newFilters.customFields).forEach(([fieldId, filterValue]) => {
      if (filterValue !== undefined && filterValue !== null && filterValue !== "") {
        const field = fieldDefinitions.find((f) => f.id === fieldId)
        if (field) {
          filtered = filtered.filter((p) => {
            const productValue = p.customFields[fieldId]

            if (field.type === "boolean") {
              const boolValue = filterValue === "Yes"
              return productValue === boolValue
            } else if (field.type === "multiselect") {
              return Array.isArray(productValue) && productValue.includes(filterValue)
            } else {
              return String(productValue).toLowerCase().includes(String(filterValue).toLowerCase())
            }
          })
        }
      }
    })

    onFilterChange(filtered)
  }

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    applyFilters(newFilters)
  }

  const updateCustomFieldFilter = (fieldId: string, value: any) => {
    const newCustomFields = { ...filters.customFields, [fieldId]: value }
    const newFilters = { ...filters, customFields: newCustomFields }
    setFilters(newFilters)
    applyFilters(newFilters)
  }

  const clearFilters = () => {
    const clearedFilters: FilterState = {
      priceRange: [priceRange[0], priceRange[1]],
      categories: [],
      tags: [],
      inStockOnly: false,
      customFields: {},
    }
    setFilters(clearedFilters)
    applyFilters(clearedFilters)
  }

  const activeFilterCount =
    (filters.categories.length > 0 ? 1 : 0) +
    (filters.tags.length > 0 ? 1 : 0) +
    (filters.inStockOnly ? 1 : 0) +
    Object.values(filters.customFields).filter((v) => v !== undefined && v !== null && v !== "").length +
    (filters.priceRange[0] !== priceRange[0] || filters.priceRange[1] !== priceRange[1] ? 1 : 0)

  if (!isOpen) {
    return (
      <Button variant="outline" onClick={() => setIsOpen(true)} className="bg-transparent">
        <Filter className="h-4 w-4 mr-2" />
        Filter
        {activeFilterCount > 0 && (
          <Badge variant="secondary" className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
            {activeFilterCount}
          </Badge>
        )}
      </Button>
    )
  }

  return (
    <Card className="shadow-marketplace">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="font-montserrat">Filters</CardTitle>
          <div className="flex items-center space-x-2">
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear All
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div className="space-y-2">
          <Label className="font-semibold">Price Range</Label>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => updateFilter("priceRange", value)}
            max={priceRange[1]}
            min={priceRange[0]}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>${filters.priceRange[0]}</span>
            <span>${filters.priceRange[1]}</span>
          </div>
        </div>

        {/* Categories */}
        {categories.length > 0 && (
          <div className="space-y-2">
            <Label className="font-semibold">Categories</Label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={filters.categories.includes(category) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const newCategories = filters.categories.includes(category)
                      ? filters.categories.filter((c) => c !== category)
                      : [...filters.categories, category]
                    updateFilter("categories", newCategories)
                  }}
                  className="bg-transparent"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        {allTags.length > 0 && (
          <div className="space-y-2">
            <Label className="font-semibold">Tags</Label>
            <div className="flex flex-wrap gap-2">
              {allTags.slice(0, 10).map((tag) => (
                <Button
                  key={tag}
                  variant={filters.tags.includes(tag) ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    const newTags = filters.tags.includes(tag)
                      ? filters.tags.filter((t) => t !== tag)
                      : [...filters.tags, tag]
                    updateFilter("tags", newTags)
                  }}
                  className="bg-transparent"
                >
                  {tag}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Stock Status */}
        <div className="flex items-center space-x-2">
          <Checkbox
            id="inStock"
            checked={filters.inStockOnly}
            onCheckedChange={(checked) => updateFilter("inStockOnly", checked)}
          />
          <Label htmlFor="inStock">In Stock Only</Label>
        </div>

        {/* Dynamic Custom Fields */}
        {fieldDefinitions.map((field) => {
          const options = getFieldOptions(field)

          if (field.type === "select" && options.length > 0) {
            return (
              <div key={field.id} className="space-y-2">
                <Label className="font-semibold">{field.name}</Label>
                <Select
                  value={filters.customFields[field.id] || "All"}
                  onValueChange={(value) => updateCustomFieldFilter(field.id, value === "All" ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={`Select ${field.name.toLowerCase()}`} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    {options.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )
          }

          if (field.type === "boolean") {
            return (
              <div key={field.id} className="space-y-2">
                <Label className="font-semibold">{field.name}</Label>
                <Select
                  value={filters.customFields[field.id] || "Any"}
                  onValueChange={(value) => updateCustomFieldFilter(field.id, value === "Any" ? undefined : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Any">Any</SelectItem>
                    <SelectItem value="Yes">Yes</SelectItem>
                    <SelectItem value="No">No</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )
          }

          if (field.type === "text" || field.type === "textarea") {
            return (
              <div key={field.id} className="space-y-2">
                <Label className="font-semibold">{field.name}</Label>
                <Input
                  placeholder={`Search by ${field.name.toLowerCase()}`}
                  value={filters.customFields[field.id] || ""}
                  onChange={(e) => updateCustomFieldFilter(field.id, e.target.value)}
                />
              </div>
            )
          }

          return null
        })}
      </CardContent>
    </Card>
  )
}
