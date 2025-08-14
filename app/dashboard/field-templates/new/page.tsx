"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Save, Eye } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { FieldBuilder } from "@/components/field-builder"
import { CategoryBuilder } from "@/components/category-builder"
import { fieldTemplateStore } from "@/lib/admin-data"
import type { CustomField } from "@/lib/field-builder"

export default function NewFieldTemplatePage() {
  const [templateName, setTemplateName] = useState("")
  const [templateDescription, setTemplateDescription] = useState("")
  const [fields, setFields] = useState<CustomField[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const router = useRouter()

  const handleSave = () => {
    if (!templateName.trim()) {
      alert("Template name is required")
      return
    }

    if (fields.length === 0) {
      alert("At least one field is required")
      return
    }

    const userId = localStorage.getItem("userId") || "current-user"

    fieldTemplateStore.createTemplate({
      name: templateName,
      description: templateDescription,
      fields,
      categories,
      userId,
    })

    router.push("/dashboard/field-templates")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/field-templates">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Templates
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-black font-montserrat text-foreground">Create Field Template</h1>
            <p className="text-muted-foreground mt-2">Define reusable fields for your products</p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="mr-2 h-4 w-4" />
            Save Template
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <Card className="shadow-marketplace">
            <CardHeader>
              <CardTitle className="font-montserrat">Template Information</CardTitle>
              <CardDescription>Basic details about your field template</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="font-semibold">
                  Template Name *
                </Label>
                <Input
                  id="name"
                  placeholder="e.g., Electronics Template, Clothing Template"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="font-semibold">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe what this template is for..."
                  rows={3}
                  value={templateDescription}
                  onChange={(e) => setTemplateDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card className="shadow-marketplace">
            <CardHeader>
              <CardTitle className="font-montserrat">Categories</CardTitle>
              <CardDescription>Define categories that products using this template can belong to</CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryBuilder categories={categories} onCategoriesChange={setCategories} />
            </CardContent>
          </Card>

          {/* Fields */}
          <Card className="shadow-marketplace">
            <CardHeader>
              <CardTitle className="font-montserrat">Custom Fields</CardTitle>
              <CardDescription>Define the fields that products using this template will have</CardDescription>
            </CardHeader>
            <CardContent>
              <FieldBuilder fields={fields} onFieldsChange={setFields} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Template Summary */}
          <Card className="shadow-marketplace">
            <CardHeader>
              <CardTitle className="font-montserrat">Template Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{fields.length}</div>
                <div className="text-sm text-muted-foreground">Custom Fields</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-secondary">{categories.length}</div>
                <div className="text-sm text-muted-foreground">Categories</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-accent">Draft</div>
                <div className="text-sm text-muted-foreground">Status</div>
              </div>
            </CardContent>
          </Card>

          {/* Field Types Used */}
          {fields.length > 0 && (
            <Card className="shadow-marketplace">
              <CardHeader>
                <CardTitle className="font-montserrat">Field Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from(new Set(fields.map((f) => f.type))).map((type) => (
                    <div key={type} className="flex justify-between text-sm">
                      <span className="capitalize">{type}</span>
                      <span className="text-muted-foreground">{fields.filter((f) => f.type === type).length}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
