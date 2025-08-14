"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, Filter, MoreHorizontal, Edit, Trash2, Copy, Eye, Layers } from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { fieldTemplateStore } from "@/lib/admin-data"
import type { UserFieldTemplate } from "@/lib/admin-data"

export default function FieldTemplatesPage() {
  const [templates, setTemplates] = useState<UserFieldTemplate[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const userId = localStorage.getItem("userId") || "current-user"
    const userTemplates = fieldTemplateStore.getTemplatesByUserId(userId)
    setTemplates(userTemplates)
  }, [])

  const filteredTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm("Are you sure you want to delete this template?")) {
      fieldTemplateStore.deleteTemplate(templateId)
      setTemplates(templates.filter((t) => t.id !== templateId))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-montserrat text-foreground">Field Templates</h1>
          <p className="text-muted-foreground mt-2">Create reusable field templates for your products</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/field-templates/new">
            <Plus className="mr-2 h-4 w-4" />
            Create Template
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <Card className="shadow-marketplace">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search templates..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Templates Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="shadow-marketplace hover:shadow-marketplace-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Layers className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-montserrat">{template.name}</CardTitle>
                      <CardDescription>{template.description}</CardDescription>
                    </div>
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
                        <Eye className="mr-2 h-4 w-4" />
                        Preview
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteTemplate(template.id)}>
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{template.fields.length} fields</span>
                  <div className="flex flex-wrap gap-1">
                    {template.categories.slice(0, 2).map((category) => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                    {template.categories.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{template.categories.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Created {new Date(template.createdAt).toLocaleDateString()}</span>
                  <span>Updated {new Date(template.updatedAt).toLocaleDateString()}</span>
                </div>

                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                    <Link href={`/dashboard/field-templates/${template.id}/edit`}>
                      <Edit className="mr-2 h-3 w-3" />
                      Edit
                    </Link>
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
      ) : (
        <Card className="shadow-marketplace">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Layers className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold font-montserrat mb-2">
              {searchQuery ? "No templates found" : "No field templates yet"}
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-md">
              {searchQuery
                ? "Try adjusting your search terms or clear the search to see all templates."
                : "Create your first field template to define custom fields for your products. Templates make it easy to maintain consistent product information."}
            </p>
            {searchQuery ? (
              <Button variant="outline" onClick={() => setSearchQuery("")}>
                Clear Search
              </Button>
            ) : (
              <Button asChild>
                <Link href="/dashboard/field-templates/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Your First Template
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
