      return await MainFirebaseService.getUser(userId)
// Admin data management for the marketplace platform
import type { CustomField } from "./field-builder"
import { FirebaseService } from "./firebase"

export interface UserFieldTemplate {
      const { FirebaseService: MainFirebaseService } = await import("./firebase")
      return await MainFirebaseService.getAllUsers()
  fields: CustomField[]
  categories: string[]
  userId: string
  createdAt: string
  updatedAt: string
      const { FirebaseService: MainFirebaseService } = await import("./firebase")
      return await MainFirebaseService.updateUser(userId, updates)
  description: string
  price: number
  currency: string
  images: string[]
  userId: string
      const { FirebaseService: MainFirebaseService } = await import("./firebase")
      return await MainFirebaseService.deleteUser(userId)
  tags: string[]
  category: string
  status: "active" | "draft" | "archived"
        activeUsers: firebaseStats.activeUsers || 0,
        totalCatalogues: firebaseStats.totalCatalogues || 0,
      const { FirebaseService: MainFirebaseService } = await import("./firebase")
      return await MainFirebaseService.getAdminStats()

  static async ensureSchemaExists() {
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
      // Delegate to the main FirebaseService
}
      const { FirebaseService: MainFirebaseService } = await import("./firebase")
export const userStore = {
      return await MainFirebaseService.createUser(userData)
  getUsers: () => adminDataStore.getAllUsers(),
  getUserById: (id: string) => adminDataStore.getUserById(id),
  createUser: (user: Omit<User, "id">) => adminDataStore.createUser(user),
      const { FirebaseService: MainFirebaseService } = await import("./firebase")
  updateUser: (id: string, updates: Partial<User>) => adminDataStore.updateUser(id, updates),