"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, X, GripVertical } from "lucide-react"
import type { CustomField } from "@/lib/field-builder"

interface FieldBuilderProps {
  fields: CustomField[]
  onChange: (fields: CustomField[]) => void
}

export function FieldBuilder({ fields, onChange }: FieldBuilderProps) {
  const [newFieldName, setNewFieldName] = useState("")
  const [newFieldType, setNewFieldType] = useState<CustomField["type"]>("text")

  const addField = () => {
    if (!newFieldName.trim()) return

    const newField: CustomField = {
      id: Date.now().toString(),
      name: newFieldName,
      type: newFieldType,
      required: false,
      placeholder: `Enter ${newFieldName.toLowerCase()}`,
    }

    onChange([...fields, newField])
    setNewFieldName("")
    setNewFieldType("text")
  }

  const updateField = (id: string, updates: Partial<CustomField>) => {
    onChange(fields.map((field) => (field.id === id ? { ...field, ...updates } : field)))
  }

  const removeField = (id: string) => {
    onChange(fields.filter((field) => field.id !== id))
  }

  const addOption = (fieldId: string) => {
    const field = fields.find((f) => f.id === fieldId)
    if (!field) return

    const options = field.options || []
    updateField(fieldId, { options: [...options, ""] })
  }

  const updateOption = (fieldId: string, optionIndex: number, value: string) => {
    const field = fields.find((f) => f.id === fieldId)
    if (!field || !field.options) return

    const newOptions = [...field.options]
    newOptions[optionIndex] = value
    updateField(fieldId, { options: newOptions })
  }

  const removeOption = (fieldId: string, optionIndex: number) => {
    const field = fields.find((f) => f.id === fieldId)
    if (!field || !field.options) return

    const newOptions = field.options.filter((_, index) => index !== optionIndex)
    updateField(fieldId, { options: newOptions })
  }

  return (
    <div className="space-y-6">
      {/* Add New Field */}
      <Card>
        <CardHeader>
          <CardTitle>Add Custom Field</CardTitle>
          <CardDescription>Create fields specific to your products</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Field name (e.g., Brand, Size, Material)"
                value={newFieldName}
                onChange={(e) => setNewFieldName(e.target.value)}
              />
            </div>
            <Select value={newFieldType} onValueChange={(value: CustomField["type"]) => setNewFieldType(value)}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="text">Text</SelectItem>
                <SelectItem value="textarea">Long Text</SelectItem>
                <SelectItem value="number">Number</SelectItem>
                <SelectItem value="select">Dropdown</SelectItem>
                <SelectItem value="multiselect">Multi-Select</SelectItem>
                <SelectItem value="boolean">Yes/No</SelectItem>
                <SelectItem value="date">Date</SelectItem>
                <SelectItem value="url">URL</SelectItem>
                <SelectItem value="email">Email</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={addField}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Existing Fields */}
      {fields.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Custom Fields ({fields.length})</CardTitle>
            <CardDescription>Configure your product fields</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {fields.map((field) => (
              <div key={field.id} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                    <div className="flex-1">
                      <Input
                        value={field.name}
                        onChange={(e) => updateField(field.id, { name: e.target.value })}
                        className="font-medium"
                      />
                    </div>
                    <Badge variant="outline">{field.type}</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeField(field.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Placeholder</Label>
                    <Input
                      value={field.placeholder || ""}
                      onChange={(e) => updateField(field.id, { placeholder: e.target.value })}
                      placeholder="Enter placeholder text"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Input
                      value={field.description || ""}
                      onChange={(e) => updateField(field.id, { description: e.target.value })}
                      placeholder="Field description"
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    checked={field.required}
                    onCheckedChange={(checked) => updateField(field.id, { required: checked })}
                  />
                  <Label>Required field</Label>
                </div>

                {/* Options for select/multiselect */}
                {(field.type === "select" || field.type === "multiselect") && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label>Options</Label>
                      <Button variant="outline" size="sm" onClick={() => addOption(field.id)}>
                        <Plus className="h-3 w-3 mr-1" />
                        Add Option
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {(field.options || []).map((option, index) => (
                        <div key={index} className="flex gap-2">
                          <Input
                            value={option}
                            onChange={(e) => updateOption(field.id, index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                          />
                          <Button variant="ghost" size="sm" onClick={() => removeOption(field.id, index)}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
