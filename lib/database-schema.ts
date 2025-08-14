// Database Schema Types for Firebase Realtime Database

export interface User {
  id: string
  email: string
  name: string
  role: "user" | "admin"
  status: "active" | "suspended" | "pending"
  avatar?: string
  company?: string
  phone?: string
  address?: string
  bio?: string
  createdAt: number
  updatedAt: number
  lastLogin?: number
}

export interface FieldType {
  id: string
  name: string
  type:
    | "text"
    | "number"
    | "percentage"
    | "category"
    | "boolean"
    | "date"
    | "url"
    | "email"
    | "phone"
    | "textarea"
    | "select"
  required: boolean
  options?: string[] // For select and category types
  unit?: string // For number types (e.g., "kg", "$", "cm")
  min?: number // For number types
  max?: number // For number types
  placeholder?: string
  description?: string
}

export interface FieldTemplate {
  id: string
  userId: string
  name: string
  description?: string
  fields: FieldType[]
  category: string
  isPublic: boolean
  usageCount: number
  createdAt: number
  updatedAt: number
}

export interface Category {
  id: string
  userId: string
  name: string
  description?: string
  color?: string
  icon?: string
  parentId?: string // For nested categories
  createdAt: number
}

export interface ProductField {
  fieldId: string
  fieldName: string
  fieldType: string
  value: any
  unit?: string
}

export interface Product {
  id: string
  userId: string
  name: string
  description?: string
  images: string[]
  categoryId: string
  categoryName: string
  templateId?: string
  customFields: ProductField[]
  price?: number
  currency?: string
  sku?: string
  status: "active" | "draft" | "archived"
  tags: string[]
  createdAt: number
  updatedAt: number
}

export interface CatalogueSettings {
  theme: "modern" | "classic" | "minimal" | "bold"
  primaryColor: string
  showPrices: boolean
  showContactInfo: boolean
  allowComparison: boolean
  showFilters: boolean
  showSearch: boolean
  itemsPerPage: number
  sortBy: "name" | "price" | "date" | "category"
  sortOrder: "asc" | "desc"
}

export interface Catalogue {
  id: string
  userId: string
  name: string
  description?: string
  slug: string
  coverImage?: string
  selectedProducts: string[] // Product IDs
  visibleFields: string[] // Field IDs to show
  settings: CatalogueSettings
  isPublic: boolean
  password?: string
  expiresAt?: number
  views: number
  shares: number
  status: "active" | "draft" | "archived"
  createdAt: number
  updatedAt: number
}

export interface CatalogueTable {
  catalogueId: string
  userId: string
  products: Product[]
  visibleFields: string[]
  settings: CatalogueSettings
  ownerInfo: {
    name: string
    email?: string
    phone?: string
    company?: string
    avatar?: string
  }
  createdAt: number
  updatedAt?: number
}

export interface ShareLink {
  id: string
  catalogueId: string
  userId: string
  url: string
  clicks: number
  lastAccessed?: number
  createdAt: number
  expiresAt?: number
}

export interface Analytics {
  catalogueId: string
  userId: string
  views: number
  uniqueViews: number
  shares: number
  comparisons: number
  topProducts: string[]
  referrers: Record<string, number>
  countries: Record<string, number>
  devices: Record<string, number>
  lastUpdated: number
}

// Database Structure
export interface DatabaseSchema {
  users: Record<string, User>
  products: Record<string, Record<string, Product>> // userId -> productId -> Product
  catalogues: Record<string, Record<string, Catalogue>> // userId -> catalogueId -> Catalogue
  catalogue_tables: Record<string, CatalogueTable> // catalogueId -> CatalogueTable
  field_templates: Record<string, Record<string, FieldTemplate>> // userId -> templateId -> FieldTemplate
  categories: Record<string, Record<string, Category>> // userId -> categoryId -> Category
  share_links: Record<string, ShareLink> // linkId -> ShareLink
  analytics: Record<string, Analytics> // catalogueId -> Analytics
}

// Validation functions
export const validateUser = (user: Partial<User>): string[] => {
  const errors: string[] = []
  if (!user.email) errors.push("Email is required")
  if (!user.name) errors.push("Name is required")
  if (user.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    errors.push("Invalid email format")
  }
  return errors
}

export const validateProduct = (product: Partial<Product>): string[] => {
  const errors: string[] = []
  if (!product.name) errors.push("Product name is required")
  if (!product.categoryId) errors.push("Category is required")
  if (!product.userId) errors.push("User ID is required")
  return errors
}

export const validateCatalogue = (catalogue: Partial<Catalogue>): string[] => {
  const errors: string[] = []
  if (!catalogue.name) errors.push("Catalogue name is required")
  if (!catalogue.slug) errors.push("Catalogue slug is required")
  if (!catalogue.userId) errors.push("User ID is required")
  if (catalogue.slug && !/^[a-z0-9-]+$/.test(catalogue.slug)) {
    errors.push("Slug can only contain lowercase letters, numbers, and hyphens")
  }
  return errors
}

export const validateFieldTemplate = (template: Partial<FieldTemplate>): string[] => {
  const errors: string[] = []
  if (!template.name) errors.push("Template name is required")
  if (!template.userId) errors.push("User ID is required")
  if (!template.fields || template.fields.length === 0) {
    errors.push("At least one field is required")
  }
  return errors
}

// Helper functions
export const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim()
}

export const generateUniqueSlug = async (baseName: string, userId: string): Promise<string> => {
  const slug = generateSlug(baseName)
  const counter = 1

  // This would need to be implemented with actual Firebase queries
  // For now, just return the base slug with timestamp
  return `${slug}-${Date.now()}`
}

export const formatFieldValue = (field: ProductField): string => {
  switch (field.fieldType) {
    case "number":
      return field.unit ? `${field.value} ${field.unit}` : field.value.toString()
    case "percentage":
      return `${field.value}%`
    case "boolean":
      return field.value ? "Yes" : "No"
    case "date":
      return new Date(field.value).toLocaleDateString()
    case "url":
      return `<a href="${field.value}" target="_blank" rel="noopener">${field.value}</a>`
    default:
      return field.value.toString()
  }
}

export const getFieldTypeIcon = (type: string): string => {
  const icons: Record<string, string> = {
    text: "📝",
    number: "🔢",
    percentage: "📊",
    category: "🏷️",
    boolean: "✅",
    date: "📅",
    url: "🔗",
    email: "📧",
    phone: "📞",
    textarea: "📄",
    select: "📋",
  }
  return icons[type] || "📝"
}
