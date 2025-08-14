"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from "lucide-react"

interface CategoryBuilderProps {
  categories: string[]
  onChange: (categories: string[]) => void
}

export function CategoryBuilder({ categories, onChange }: CategoryBuilderProps) {
  const [newCategory, setNewCategory] = useState("")

  const addCategory = () => {
    if (!newCategory.trim() || categories.includes(newCategory.trim())) return

    onChange([...categories, newCategory.trim()])
    setNewCategory("")
  }

  const removeCategory = (categoryToRemove: string) => {
    onChange(categories.filter((cat) => cat !== categoryToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      addCategory()
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Product Categories</CardTitle>
        <CardDescription>Define categories for organizing your products</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add category (e.g., Electronics, Furniture)"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button onClick={addCategory}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Badge key={category} variant="secondary" className="text-sm">
                {category}
                <button onClick={() => removeCategory(category)} className="ml-2 hover:text-red-600">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}

        {categories.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No categories defined. Add categories to help organize your products.
          </p>
        )}
      </CardContent>
    </Card>
  )
}
