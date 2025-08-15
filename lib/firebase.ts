import { initializeApp, getApps, getApp } from "firebase/app"
import { getDatabase, ref, set, get, push, remove, update, child } from "firebase/database"

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyC7KaDbhXn3CPBfbpJ8WJxapYGYmSvYziU",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "catalog-9951b.firebaseapp.com",
  databaseURL:
    process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL ||
    "https://catalog-9951b-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "catalog-9951b",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "catalog-9951b.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "98167800863",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:98167800863:web:9d51c31a1a447303a7412a",
}

let app: any = null
let database: any = null
let isInitialized = false

function initializeFirebase() {
  try {
    if (typeof window === "undefined") {
      return { app: null, database: null }
    }

    if (isInitialized && app && database) {
      return { app, database }
    }

    if (getApps().length === 0) {
      console.log("Initializing Firebase app...")
      app = initializeApp(firebaseConfig)
    } else {
      app = getApp()
    }

    if (!database && app) {
      console.log("Initializing Firebase Realtime Database...")
      database = getDatabase(app)
      console.log("Firebase Realtime Database initialized successfully")
    }

    isInitialized = true
    return { app, database }
  } catch (error) {
    console.error("Firebase initialization error:", error)
    throw error
  }
}

function ensureDatabaseAvailable() {
  try {
    if (!database || !isInitialized) {
      const { database: db } = initializeFirebase()
      if (!db) {
        throw new Error("Firebase Realtime Database failed to initialize")
      }
      database = db
    }
    return database
  } catch (error) {
    console.error("Database operation failed:", error)
    throw error
  }
}

async function initializeDatabaseSchema() {
  try {
    const db = ensureDatabaseAvailable()
    
    // Check if schema is already initialized
    const schemaCheck = await get(ref(db, "schema_version"))
    
    if (!schemaCheck.exists()) {
      console.log("Creating initial database schema...")
      
      const initialData = {
        schema_version: "1.0.0",
        schema_created: Date.now(),
        
        // Users structure
        users: {
          "admin-001": {
            id: "admin-001",
            name: "Admin User",
            email: "admin@cataloguehub.com",
            password: "admin123", // In production, this should be hashed
            role: "admin",
            status: "active",
            joinDate: "2024-01-01",
            lastActive: new Date().toISOString(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          "demo-user-001": {
            id: "demo-user-001",
            name: "John Demo",
            email: "john@demo.com",
            password: "password123",
            role: "user",
            status: "active",
            joinDate: "2024-01-15",
            lastActive: new Date().toISOString(),
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }
        },
        
        // Products structure (nested by userId)
        products: {
          "demo-user-001": {
            "prod-001": {
              id: "prod-001",
              userId: "demo-user-001",
              name: "Premium Office Chair",
              description: "Ergonomic office chair with lumbar support and adjustable height",
              price: 299.99,
              currency: "USD",
              categoryId: "furniture",
              categoryName: "Furniture",
              images: [
                "https://images.pexels.com/photos/586344/pexels-photo-586344.jpeg?auto=compress&cs=tinysrgb&w=800"
              ],
              status: "active",
              tags: ["office", "ergonomic", "furniture"],
              customFields: [
                {
                  fieldId: "material",
                  fieldName: "Material",
                  fieldType: "text",
                  value: "Mesh and Plastic"
                },
                {
                  fieldId: "warranty",
                  fieldName: "Warranty",
                  fieldType: "text",
                  value: "2 years"
                }
              ],
              createdAt: Date.now(),
              updatedAt: Date.now(),
            },
            "prod-002": {
              id: "prod-002",
              userId: "demo-user-001",
              name: "Wireless Bluetooth Headphones",
              description: "High-quality wireless headphones with noise cancellation",
              price: 149.99,
              currency: "USD",
              categoryId: "electronics",
              categoryName: "Electronics",
              images: [
                "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800"
              ],
              status: "active",
              tags: ["electronics", "wireless", "audio"],
              customFields: [
                {
                  fieldId: "battery_life",
                  fieldName: "Battery Life",
                  fieldType: "text",
                  value: "30 hours"
                },
                {
                  fieldId: "connectivity",
                  fieldName: "Connectivity",
                  fieldType: "text",
                  value: "Bluetooth 5.0"
                }
              ],
              createdAt: Date.now(),
              updatedAt: Date.now(),
            }
          }
        },
        
        // Catalogues structure (nested by userId)
        catalogues: {
          "demo-user-001": {
            "cat-001": {
              id: "cat-001",
              userId: "demo-user-001",
              name: "Office Essentials Collection",
              description: "Everything you need for a modern office setup",
              slug: "office-essentials-demo",
              selectedProducts: ["prod-001", "prod-002"],
              visibleFields: ["name", "price", "description", "images", "customFields"],
              settings: {
                theme: "modern",
                primaryColor: "#14b8a6",
                showPrices: true,
                showContactInfo: true,
                allowComparison: true,
                showFilters: true,
                showSearch: true,
                itemsPerPage: 12,
                sortBy: "name",
                sortOrder: "asc"
              },
              isPublic: true,
              status: "active",
              views: 0,
              shares: 0,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            }
          }
        },
        
        // Categories
        categories: {
          "furniture": {
            id: "furniture",
            name: "Furniture",
            description: "Office and home furniture",
            createdAt: Date.now(),
          },
          "electronics": {
            id: "electronics",
            name: "Electronics",
            description: "Electronic devices and gadgets",
            createdAt: Date.now(),
          }
        },
        
        // Field templates
        field_templates: {
          "demo-user-001": {
            "template-001": {
              id: "template-001",
              userId: "demo-user-001",
              name: "Basic Product Template",
              description: "Standard fields for most products",
              category: "General",
              fields: [
                {
                  id: "material",
                  name: "Material",
                  type: "text",
                  required: false,
                  placeholder: "Enter material type"
                },
                {
                  id: "warranty",
                  name: "Warranty",
                  type: "text",
                  required: false,
                  placeholder: "Enter warranty period"
                },
                {
                  id: "dimensions",
                  name: "Dimensions",
                  type: "text",
                  required: false,
                  placeholder: "Enter dimensions"
                }
              ],
              isPublic: false,
              usageCount: 0,
              createdAt: Date.now(),
              updatedAt: Date.now(),
            }
          }
        },
        
        // Catalogue tables for public viewing
        catalogue_tables: {
          "cat-001": {
            catalogueId: "cat-001",
            userId: "demo-user-001",
            products: [], // Will be populated dynamically
            visibleFields: ["name", "price", "description", "images", "customFields"],
            settings: {
              theme: "modern",
              primaryColor: "#14b8a6",
              showPrices: true,
              showContactInfo: true,
              allowComparison: true,
              showFilters: true,
              showSearch: true,
              itemsPerPage: 12,
              sortBy: "name",
              sortOrder: "asc"
            },
            ownerInfo: {
              name: "John Demo",
              email: "john@demo.com",
              company: "Demo Company"
            },
            createdAt: Date.now(),
          }
        }
      }
      
      // Set the entire initial structure
      await set(ref(db, "/"), initialData)
      console.log("Database schema initialized successfully with sample data")
      
      return true
    } else {
      console.log("Database schema already exists")
      return true
    }
  } catch (error) {
    console.error("Failed to initialize database schema:", error)
    throw error
  }
}

export const getFirebaseDatabase = () => {
  return ensureDatabaseAvailable()
}

export class FirebaseService {
  private static async handleDatabaseOperation<T>(operation: () => Promise<T>): Promise<T> {
    try {
      const db = ensureDatabaseAvailable()
      return await operation()
    } catch (error) {
      console.error("Database operation failed:", error)
      throw error
    }
  }

  // Initialize database schema when service is first used
  static async ensureSchemaExists() {
    try {
      await initializeDatabaseSchema()
    } catch (error) {
      console.error("Schema initialization failed:", error)
      throw new Error("Database schema initialization failed. Please check your Firebase configuration.")
    }
  }

  // User operations
  static async createUser(userData: any) {
    return this.handleDatabaseOperation(async () => {
      await this.ensureSchemaExists()
      const db = ensureDatabaseAvailable()
      const userRef = push(ref(db, "users"))
      const userId = userRef.key
      
      const newUser = {
        ...userData,
        id: userId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      
      await set(userRef, newUser)
      return userId
    })
  }

  static async getUser(userId: string) {
    return this.handleDatabaseOperation(async () => {
      await this.ensureSchemaExists()
      const db = ensureDatabaseAvailable()
      const snapshot = await get(ref(db, `users/${userId}`))
      return snapshot.exists() ? snapshot.val() : null
    })
  }

  static async getAllUsers() {
    return this.handleDatabaseOperation(async () => {
      await this.ensureSchemaExists()
      const db = ensureDatabaseAvailable()
      const snapshot = await get(ref(db, "users"))
      return snapshot.exists() ? Object.values(snapshot.val()) : []
    })
  }

  static async updateUser(userId: string, updates: any) {
    return this.handleDatabaseOperation(async () => {
      await this.ensureSchemaExists()
      const db = ensureDatabaseAvailable()
      await update(ref(db, `users/${userId}`), {
        ...updates,
        updatedAt: Date.now(),
      })
    })
  }

  static async deleteUser(userId: string) {
    return this.handleDatabaseOperation(async () => {
      await this.ensureSchemaExists()
      const db = ensureDatabaseAvailable()
      
      // Also clean up user's products and catalogues
      await remove(ref(db, `users/${userId}`))
      await remove(ref(db, `products/${userId}`))
      await remove(ref(db, `catalogues/${userId}`))
      await remove(ref(db, `field_templates/${userId}`))
    })
  }

  // Product operations
  static async createProduct(userId: string, productData: any) {
    return this.handleDatabaseOperation(async () => {
      await this.ensureSchemaExists()
      const db = ensureDatabaseAvailable()
      const productRef = push(ref(db, `products/${userId}`))
      const productId = productRef.key
      
      const newProduct = {
        ...productData,
        id: productId,
        userId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      
      await set(productRef, newProduct)
      return productId
    })
  }

  static async getUserProducts(userId: string) {
    return this.handleDatabaseOperation(async () => {
      await this.ensureSchemaExists()
      const db = ensureDatabaseAvailable()
      const snapshot = await get(ref(db, `products/${userId}`))
      return snapshot.exists() ? Object.values(snapshot.val()) : []
    })
  }

  static async getAllProducts() {
    return this.handleDatabaseOperation(async () => {
      await this.ensureSchemaExists()
      const db = ensureDatabaseAvailable()
      const snapshot = await get(ref(db, "products"))
      if (!snapshot.exists()) return []

      const allProducts: any[] = []
      const userProducts = snapshot.val()

      Object.values(userProducts).forEach((products: any) => {
        if (products && typeof products === "object") {
          Object.values(products).forEach((product: any) => {
            allProducts.push(product)
          })
        }
      })

      return allProducts
    })
  }

  static async updateUserProduct(userId: string, productId: string, updates: any) {
    return this.handleDatabaseOperation(async () => {
      await this.ensureSchemaExists()
      const db = ensureDatabaseAvailable()
      await update(ref(db, `products/${userId}/${productId}`), {
        ...updates,
        updatedAt: Date.now(),
      })
    })
  }

  static async deleteUserProduct(userId: string, productId: string) {
    return this.handleDatabaseOperation(async () => {
      await this.ensureSchemaExists()
      const db = ensureDatabaseAvailable()
      await remove(ref(db, `products/${userId}/${productId}`))
    })
  }

  // Catalogue operations
  static async createCatalogue(userId: string, catalogueData: any) {
    return this.handleDatabaseOperation(async () => {
      await this.ensureSchemaExists()
      const db = ensureDatabaseAvailable()
      const catalogueRef = push(ref(db, `catalogues/${userId}`))
      const catalogueId = catalogueRef.key

      const newCatalogue = {
        ...catalogueData,
        id: catalogueId,
        userId,
        slug: catalogueData.slug || `${catalogueId}`,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      await set(catalogueRef, newCatalogue)

      // Create catalogue table for public access
      await set(ref(db, `catalogue_tables/${catalogueId}`), {
        catalogueId,
        userId,
        products: [], // Will be populated when catalogue is accessed
        visibleFields: catalogueData.visibleFields || [],
        settings: catalogueData.settings || {},
        ownerInfo: {
          name: "User", // Will be updated with real user info
          email: "",
        },
        createdAt: Date.now(),
      })

      return catalogueId
    })
  }

  static async getAllCatalogues() {
    return this.handleDatabaseOperation(async () => {
      await this.ensureSchemaExists()
      const db = ensureDatabaseAvailable()
      const snapshot = await get(ref(db, "catalogues"))
      if (!snapshot.exists()) return []

      const allCatalogues: any[] = []
      const userCatalogues = snapshot.val()

      Object.values(userCatalogues).forEach((catalogues: any) => {
        if (catalogues && typeof catalogues === "object") {
          Object.values(catalogues).forEach((catalogue: any) => {
            allCatalogues.push(catalogue)
          })
        }
      })

      return allCatalogues
    })
  }

  static async getUserCatalogues(userId: string) {
    return this.handleDatabaseOperation(async () => {
      await this.ensureSchemaExists()
      const db = ensureDatabaseAvailable()
      const snapshot = await get(ref(db, `catalogues/${userId}`))
      return snapshot.exists() ? Object.values(snapshot.val()) : []
    })
  }

  static async getCatalogueBySlug(slug: string) {
    return this.handleDatabaseOperation(async () => {
      await this.ensureSchemaExists()
      const db = ensureDatabaseAvailable()
      const snapshot = await get(ref(db, "catalogues"))
      if (!snapshot.exists()) return null

      const userCatalogues = snapshot.val()

      for (const userId in userCatalogues) {
        const catalogues = userCatalogues[userId]
        if (catalogues && typeof catalogues === "object") {
          for (const catalogueId in catalogues) {
            const catalogue = catalogues[catalogueId]
            if (catalogue.slug === slug) {
              return catalogue
            }
          }
        }
      }

      return null
    })
  }

  static async getCatalogueWithDetails(slug: string) {
    return this.handleDatabaseOperation(async () => {
      await this.ensureSchemaExists()
      const catalogue = await this.getCatalogueBySlug(slug)
      if (!catalogue) return null

      // Get the catalogue owner
      const owner = await this.getUser(catalogue.userId)

      // Get the products for this catalogue
      const allProducts = await this.getUserProducts(catalogue.userId)
      const catalogueProducts = allProducts.filter((product: any) => 
        catalogue.selectedProducts?.includes(product.id)
      )

      return {
        catalogue,
        products: catalogueProducts,
        owner,
      }
    })
  }

  static async updateCatalogue(userId: string, catalogueId: string, updates: any) {
    return this.handleDatabaseOperation(async () => {
      await this.ensureSchemaExists()
      const db = ensureDatabaseAvailable()
      await update(ref(db, `catalogues/${userId}/${catalogueId}`), {
        ...updates,
        updatedAt: Date.now(),
      })
    })
  }

  static async deleteCatalogue(userId: string, catalogueId: string) {
    return this.handleDatabaseOperation(async () => {
      await this.ensureSchemaExists()
      const db = ensureDatabaseAvailable()
      await remove(ref(db, `catalogues/${userId}/${catalogueId}`))
      await remove(ref(db, `catalogue_tables/${catalogueId}`))
    })
  }

  // Field template operations
  static async createFieldTemplate(userId: string, templateData: any) {
    return this.handleDatabaseOperation(async () => {
      await this.ensureSchemaExists()
      const db = ensureDatabaseAvailable()
      const templateRef = push(ref(db, `field_templates/${userId}`))
      const templateId = templateRef.key
      
      const newTemplate = {
        ...templateData,
        id: templateId,
        userId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      
      await set(templateRef, newTemplate)
      return templateId
    })
  }

  static async getUserFieldTemplates(userId: string) {
    return this.handleDatabaseOperation(async () => {
      await this.ensureSchemaExists()
      const db = ensureDatabaseAvailable()
      const snapshot = await get(ref(db, `field_templates/${userId}`))
      return snapshot.exists() ? Object.values(snapshot.val()) : []
    })
  }

  static async getUserCategories(userId: string) {
    return this.handleDatabaseOperation(async () => {
      await this.ensureSchemaExists()
      const db = ensureDatabaseAvailable()
      
      // Get categories from user's products
      const products = await this.getUserProducts(userId)
      const categories = Array.from(new Set(
        products.map((p: any) => p.categoryName).filter(Boolean)
      )).map(name => ({ id: name.toLowerCase(), name }))
      
      return categories
    })
  }

  static async getAdminStats() {
    return this.handleDatabaseOperation(async () => {
      await this.ensureSchemaExists()
      const [users, products, catalogues] = await Promise.all([
        this.getAllUsers(),
        this.getAllProducts(),
        this.getAllCatalogues(),
      ])

      const activeUsers = Array.isArray(users)
        ? users.filter((user: any) => {
            const lastActive = new Date(user.lastActive || user.createdAt || 0)
            const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
            return lastActive > thirtyDaysAgo
          }).length
        : 0

      const recentActivity = Array.isArray(users)
        ? users.slice(0, 5).map((user: any) => ({
            user: user.name || user.email || "Unknown User",
            action: "Recent activity",
            time: new Date(user.updatedAt || user.createdAt || Date.now()).toLocaleDateString(),
          }))
        : []

      return {
        totalUsers: Array.isArray(users) ? users.length : 0,
        activeUsers,
        totalCatalogues: Array.isArray(catalogues) ? catalogues.length : 0,
        totalProducts: Array.isArray(products) ? products.length : 0,
        recentActivity,
      }
    })
  }
}