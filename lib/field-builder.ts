export interface CustomField {
  id: string
  name: string
  type: "text" | "number" | "boolean" | "select" | "multiselect" | "date" | "url" | "email" | "textarea"
  required: boolean
  options?: string[] // for select/multiselect
  defaultValue?: any
  placeholder?: string
  description?: string
}

export interface UserFieldTemplate {
  id: string
  userId: string
  name: string
  description: string
  fields: CustomField[]
  categories: string[]
  createdAt: string
  updatedAt: string
}

// In-memory storage for user field templates
class FieldTemplateStore {
  private templates: Map<string, UserFieldTemplate> = new Map()

  createTemplate(
    userId: string,
    templateData: Omit<UserFieldTemplate, "id" | "userId" | "createdAt" | "updatedAt">,
  ): UserFieldTemplate {
    const id = Date.now().toString()
    const template: UserFieldTemplate = {
      ...templateData,
      id,
      userId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.templates.set(id, template)
    return template
  }

  getTemplatesByUserId(userId: string): UserFieldTemplate[] {
    return Array.from(this.templates.values()).filter((t) => t.userId === userId)
  }

  getTemplateById(id: string): UserFieldTemplate | undefined {
    return this.templates.get(id)
  }

  updateTemplate(id: string, updates: Partial<UserFieldTemplate>): UserFieldTemplate | null {
    const template = this.templates.get(id)
    if (!template) return null

    const updatedTemplate = {
      ...template,
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    this.templates.set(id, updatedTemplate)
    return updatedTemplate
  }

  deleteTemplate(id: string): boolean {
    return this.templates.delete(id)
  }
}

export const fieldTemplateStore = new FieldTemplateStore()
