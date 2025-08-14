// Admin data management for the marketplace platform
import type { CustomField } from "./field-builder"
import { FirebaseService } from "./firebase"

export interface UserFieldTemplate {
  id: string
  name: string
  description: string
  fields: CustomField[]
  categories: string[]
  userId: string
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  currency: string
  images: string[]
  userId: string
  catalogueIds: string[]
  customFields: Record<string, any>
  tags: string[]
  category: string
  status: "active" | "draft" | "archived"
  createdAt: string
  updatedAt: string
  catalogues: string[]
  products: string[]
}

export interface User {
  id: string
  name: string
  email: string
  status: "active" | "suspended" | "inactive"
  role: string
  joinDate: string
  lastActive: string
  catalogues: string[]
  products: string[]
}

export interface Catalogue {
  id: string
  name: string
  description: string
  userId: string
  productIds: string[]
  isPublic: boolean
  shareUrl: string
  createdAt: string
  updatedAt: string
}

// Field Template Store
class FieldTemplateStore {
  private templates: UserFieldTemplate[] = []

  createTemplate(template: Omit<UserFieldTemplate, "id" | "createdAt" | "updatedAt">): UserFieldTemplate {
    const newTemplate: UserFieldTemplate = {
      ...template,
      id: `template_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    this.templates.push(newTemplate)
    return newTemplate
  }

  getTemplatesByUserId(userId: string): UserFieldTemplate[] {
    return this.templates.filter((template) => template.userId === userId)
  }

  getTemplateById(id: string): UserFieldTemplate | undefined {
    return this.templates.find((template) => template.id === id)
  }

  updateTemplate(id: string, updates: Partial<UserFieldTemplate>): UserFieldTemplate | null {
    const index = this.templates.findIndex((template) => template.id === id)
    if (index === -1) return null

    this.templates[index] = {
      ...this.templates[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    return this.templates[index]
  }

  deleteTemplate(id: string): boolean {
    const index = this.templates.findIndex((template) => template.id === id)
    if (index === -1) return false

    this.templates.splice(index, 1)
    return true
  }

  getAllTemplates(): UserFieldTemplate[] {
    return this.templates
  }
}

// Admin Data Store
class AdminDataStore {
  private users: User[] = [
    {
      id: "user_1",
      name: "John Doe",
      email: "john@example.com",
      status: "active",
      role: "user",
      joinDate: "2024-01-15",
      lastActive: "2024-01-20",
      catalogues: ["cat_1", "cat_2"],
      products: ["prod_1", "prod_2", "prod_3"],
    },
    {
      id: "user_2",
      name: "Jane Smith",
      email: "jane@example.com",
      status: "active",
      role: "user",
      joinDate: "2024-01-10",
      lastActive: "2024-01-19",
      catalogues: ["cat_3"],
      products: ["prod_4"],
    },
  ]
  private products: Product[] = []
  private catalogues: Catalogue[] = []

  async getStats() {
    try {
      const firebaseStats = await FirebaseService.getAdminStats()
      return {
        totalUsers: firebaseStats.totalUsers || 0,
        activeUsers: firebaseStats.activeUsers || 0,
        totalCatalogues: firebaseStats.totalCatalogues || 0,
        totalProducts: firebaseStats.totalProducts || 0,
        recentActivity: Array.isArray(firebaseStats.recentActivity) ? firebaseStats.recentActivity : [],
      }
    } catch (error) {
      console.error("Failed to get stats from Firebase, using fallback:", error)
      const activeUsers = Array.isArray(this.users)
        ? this.users.filter((user) => {
            const lastActive = new Date(user.lastActive || new Date().toISOString())
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            return lastActive > thirtyDaysAgo
          }).length
        : 0

      const recentActivity = Array.isArray(this.users)
        ? this.users.slice(0, 5).map((user) => ({
            user: user.name || user.email || "Unknown User",
            action: "Recent activity",
            time: new Date(user.lastActive || new Date().toISOString()).toLocaleDateString(),
          }))
        : []

      return {
        totalUsers: Array.isArray(this.users) ? this.users.length : 0,
        activeUsers,
        totalCatalogues: Array.isArray(this.catalogues) ? this.catalogues.length : 0,
        totalProducts: Array.isArray(this.products) ? this.products.length : 0,
        recentActivity,
      }
    }
  }

  // User Management
  createUser(user: Omit<User, "id">): User {
    const newUser: User = {
      ...user,
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      catalogues: user.catalogues || [],
      products: user.products || [],
    }
    this.users.push(newUser)
    return newUser
  }

  getAllUsers(): User[] {
    try {
      // Try to get from Firebase first, but don't await to keep it synchronous
      FirebaseService.getAllUsers()
        .then((firebaseUsers) => {
          if (Array.isArray(firebaseUsers) && firebaseUsers.length > 0) {
            this.users = firebaseUsers.map((user) => ({
              ...user,
              catalogues: user.catalogues || [],
              products: user.products || [],
            }))
          }
        })
        .catch((error) => {
          console.error("Failed to sync users from Firebase:", error)
        })
    } catch (error) {
      console.error("Failed to get users from Firebase:", error)
    }

    // Always return current in-memory users immediately
    return Array.isArray(this.users) ? this.users : []
  }

  getUserById(id: string): User | undefined {
    return Array.isArray(this.users) ? this.users.find((user) => user.id === id) : undefined
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    if (!Array.isArray(this.users)) return null

    const index = this.users.findIndex((user) => user.id === id)
    if (index === -1) return null

    this.users[index] = {
      ...this.users[index],
      ...updates,
      catalogues: updates.catalogues || this.users[index].catalogues || [],
      products: updates.products || this.users[index].products || [],
    }
    return this.users[index]
  }

  deleteUser(id: string): boolean {
    if (!Array.isArray(this.users)) return false

    const index = this.users.findIndex((user) => user.id === id)
    if (index === -1) return false

    this.users.splice(index, 1)
    return true
  }

  // Product Management
  createProduct(product: Omit<Product, "id">): Product {
    const newProduct: Product = {
      ...product,
      id: `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      catalogues: product.catalogues || [],
      products: product.products || [],
    }
    this.products.push(newProduct)
    return newProduct
  }

  getAllProducts(): Product[] {
    return Array.isArray(this.products) ? this.products : []
  }

  getProductsByUserId(userId: string): Product[] {
    return Array.isArray(this.products) ? this.products.filter((product) => product.userId === userId) : []
  }

  getProductById(id: string): Product | undefined {
    return Array.isArray(this.products) ? this.products.find((product) => product.id === id) : undefined
  }

  updateProduct(id: string, updates: Partial<Product>): Product | null {
    if (!Array.isArray(this.products)) return null

    const index = this.products.findIndex((product) => product.id === id)
    if (index === -1) return null

    this.products[index] = {
      ...this.products[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    return this.products[index]
  }

  deleteProduct(id: string): boolean {
    if (!Array.isArray(this.products)) return false

    const index = this.products.findIndex((product) => product.id === id)
    if (index === -1) return false

    this.products.splice(index, 1)
    return true
  }

  // Catalogue Management
  createCatalogue(catalogue: Omit<Catalogue, "id">): Catalogue {
    const newCatalogue: Catalogue = {
      ...catalogue,
      id: `catalogue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    }
    this.catalogues.push(newCatalogue)
    return newCatalogue
  }

  getAllCatalogues(): Catalogue[] {
    return Array.isArray(this.catalogues) ? this.catalogues : []
  }

  getCataloguesByUserId(userId: string): Catalogue[] {
    return Array.isArray(this.catalogues) ? this.catalogues.filter((catalogue) => catalogue.userId === userId) : []
  }

  getCatalogueById(id: string): Catalogue | undefined {
    return Array.isArray(this.catalogues) ? this.catalogues.find((catalogue) => catalogue.id === id) : undefined
  }

  updateCatalogue(id: string, updates: Partial<Catalogue>): Catalogue | null {
    if (!Array.isArray(this.catalogues)) return null

    const index = this.catalogues.findIndex((catalogue) => catalogue.id === id)
    if (index === -1) return null

    this.catalogues[index] = {
      ...this.catalogues[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    }
    return this.catalogues[index]
  }

  deleteCatalogue(id: string): boolean {
    if (!Array.isArray(this.catalogues)) return false

    const index = this.catalogues.findIndex((catalogue) => catalogue.id === id)
    if (index === -1) return false

    this.catalogues.splice(index, 1)
    return true
  }
}

// Export singleton instances
export const fieldTemplateStore = new FieldTemplateStore()
export const adminDataStore = new AdminDataStore()

// Individual store exports for easier access
export const catalogueStore = {
  getCatalogues: () => adminDataStore.getAllCatalogues(),
  getCatalogueById: (id: string) => adminDataStore.getCatalogueById(id),
  getCataloguesByUserId: (userId: string) => adminDataStore.getCataloguesByUserId(userId),
  createCatalogue: (catalogue: Omit<Catalogue, "id">) => adminDataStore.createCatalogue(catalogue),
  updateCatalogue: (id: string, updates: Partial<Catalogue>) => adminDataStore.updateCatalogue(id, updates),
  deleteCatalogue: (id: string) => adminDataStore.deleteCatalogue(id),
}

export const productStore = {
  getProducts: () => adminDataStore.getAllProducts(),
  getProductById: (id: string) => adminDataStore.getProductById(id),
  getProductsByUserId: (userId: string) => adminDataStore.getProductsByUserId(userId),
  createProduct: (product: Omit<Product, "id">) => adminDataStore.createProduct(product),
  updateProduct: (id: string, updates: Partial<Product>) => adminDataStore.updateProduct(id, updates),
  deleteProduct: (id: string) => adminDataStore.deleteProduct(id),
}

export const userStore = {
  getUsers: () => adminDataStore.getAllUsers(),
  getUserById: (id: string) => adminDataStore.getUserById(id),
  createUser: (user: Omit<User, "id">) => adminDataStore.createUser(user),
  updateUser: (id: string, updates: Partial<User>) => adminDataStore.updateUser(id, updates),
  deleteUser: (id: string) => adminDataStore.deleteUser(id),
}
