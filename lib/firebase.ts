import { initializeApp, getApps, getApp } from "firebase/app"
import { getDatabase, ref, set, get, push, remove, update } from "firebase/database"

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
let isSchemaInitialized = false

function initializeFirebase() {
  try {
    if (typeof window === "undefined") {
      // Server-side: return null to prevent SSR issues
      return { app: null, database: null }
    }

    if (isInitialized && app && database) {
      return { app, database }
    }

    // Check if Firebase app is already initialized
    if (getApps().length === 0) {
      console.log("Initializing Firebase app...")
      app = initializeApp(firebaseConfig)
    } else {
      app = getApp()
    }

    // Initialize Realtime Database
    if (!database && app) {
      console.log("Initializing Firebase Realtime Database...")
      database = getDatabase(app)

      initializeDatabaseSchema().catch((error) => {
        console.error("Schema initialization failed:", error)
      })

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
    throw error // Don't create fallback, throw error to force proper Firebase connection
  }
}

async function initializeDatabaseSchema() {
  if (isSchemaInitialized) return

  try {
    if (!database) {
      initializeFirebase()
    }

    const db = database
    if (!db) {
      throw new Error("Database not available for schema initialization")
    }

    // Check if database structure exists
    const rootSnapshot = await get(ref(db, "schema_initialized"))

    if (!rootSnapshot.exists()) {
      console.log("Database schema not found, creating Firebase schema...")

      const initialData = {
        schema_initialized: {
          timestamp: Date.now(),
          version: "1.0.0",
        },
        users: {
          "admin-001": {
            id: "admin-001",
            name: "Admin User",
            email: "admin@catalog.com",
            role: "admin",
            username: "admin123",
            password: "admin123",
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
        },
        catalogues: {},
        products: {},
        categories: {
          default: {
            id: "default",
            name: "Default Category",
            description: "Default product category",
            createdAt: Date.now(),
          },
        },
        catalogue_tables: {},
        field_templates: {
          basic: {
            id: "basic",
            name: "Basic Product Fields",
            fields: [
              { name: "name", type: "text", required: true },
              { name: "description", type: "textarea", required: false },
              { name: "price", type: "number", required: true },
              { name: "category", type: "select", required: false },
            ],
            createdAt: Date.now(),
          },
        },
      }

      await set(ref(db, "/"), initialData)
      console.log("Firebase Realtime Database schema created successfully")
    } else {
      console.log("Firebase database schema already exists")
    }

    isSchemaInitialized = true
  } catch (error) {
    console.error("Failed to initialize Firebase database schema:", error)
    console.log("Continuing without schema initialization...")
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
      throw error // Remove fallback operations, force Firebase usage
    }
  }

  static async createUser(userData: any) {
    return this.handleDatabaseOperation(async () => {
      const db = ensureDatabaseAvailable()
      const userRef = push(ref(db, "users"))
      const userId = userRef.key
      await set(userRef, {
        ...userData,
        id: userId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      return userId
    })
  }

  static async getUser(userId: string) {
    return this.handleDatabaseOperation(async () => {
      const db = ensureDatabaseAvailable()
      const snapshot = await get(ref(db, `users/${userId}`))
      return snapshot.exists() ? snapshot.val() : null
    })
  }

  static async getAllUsers() {
    return this.handleDatabaseOperation(async () => {
      const db = ensureDatabaseAvailable()
      const snapshot = await get(ref(db, "users"))
      return snapshot.exists() ? Object.values(snapshot.val()) : []
    })
  }

  static async updateUser(userId: string, updates: any) {
    return this.handleDatabaseOperation(async () => {
      const db = ensureDatabaseAvailable()
      await update(ref(db, `users/${userId}`), {
        ...updates,
        updatedAt: Date.now(),
      })
    })
  }

  static async deleteUser(userId: string) {
    return this.handleDatabaseOperation(async () => {
      const db = ensureDatabaseAvailable()
      await remove(ref(db, `users/${userId}`))
    })
  }

  // Product operations
  static async createProduct(userId: string, productData: any) {
    return this.handleDatabaseOperation(async () => {
      const db = ensureDatabaseAvailable()
      const productRef = push(ref(db, `products/${userId}`))
      await set(productRef, {
        ...productData,
        id: productRef.key,
        userId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })
      return productRef.key
    })
  }

  static async getUserProducts(userId: string) {
    return this.handleDatabaseOperation(async () => {
      const db = ensureDatabaseAvailable()
      const snapshot = await get(ref(db, `products/${userId}`))
      return snapshot.exists() ? Object.values(snapshot.val()) : []
    })
  }

  static async getAllProducts() {
    return this.handleDatabaseOperation(async () => {
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
      const db = ensureDatabaseAvailable()
      await update(ref(db, `products/${userId}/${productId}`), {
        ...updates,
        updatedAt: Date.now(),
      })
    })
  }

  static async deleteUserProduct(userId: string, productId: string) {
    return this.handleDatabaseOperation(async () => {
      const db = ensureDatabaseAvailable()
      await remove(ref(db, `products/${userId}/${productId}`))
    })
  }

  // Catalogue operations
  static async createCatalogue(userId: string, catalogueData: any) {
    return this.handleDatabaseOperation(async () => {
      const db = ensureDatabaseAvailable()
      const catalogueRef = push(ref(db, `catalogues/${userId}`))
      const catalogueId = catalogueRef.key

      await set(catalogueRef, {
        ...catalogueData,
        id: catalogueId,
        userId,
        slug: catalogueData.slug || catalogueId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      })

      await set(ref(db, `catalogue_tables/${catalogueId}`), {
        catalogueId,
        userId,
        products: catalogueData.selectedProducts || [],
        visibleFields: catalogueData.visibleFields || [],
        settings: catalogueData.settings || {},
        createdAt: Date.now(),
      })

      return catalogueId
    })
  }

  static async getAllCatalogues() {
    return this.handleDatabaseOperation(async () => {
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

  static async getAdminStats() {
    return this.handleDatabaseOperation(async () => {
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

  static async getCatalogueBySlug(slug: string) {
    return this.handleDatabaseOperation(async () => {
      const db = ensureDatabaseAvailable()
      const snapshot = await get(ref(db, "catalogues"))
      if (!snapshot.exists()) return null

      const userCatalogues = snapshot.val()

      // Search through all user catalogues to find matching slug
      for (const userId in userCatalogues) {
        const catalogues = userCatalogues[userId]
        if (catalogues && typeof catalogues === "object") {
          for (const catalogueId in catalogues) {
            const catalogue = catalogues[catalogueId]
            if (catalogue.slug === slug || catalogue.shareUrl === slug) {
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
      const catalogue = await this.getCatalogueBySlug(slug)
      if (!catalogue) return null

      // Get the catalogue owner
      const owner = await this.getUser(catalogue.userId)

      // Get the products for this catalogue
      const allProducts = await this.getUserProducts(catalogue.userId)
      const catalogueProducts = allProducts.filter((product: any) => catalogue.selectedProducts?.includes(product.id))

      return {
        catalogue,
        products: catalogueProducts,
        owner,
      }
    })
  }

  static async updateCatalogue(userId: string, catalogueId: string, updates: any) {
    return this.handleDatabaseOperation(async () => {
      const db = ensureDatabaseAvailable()
      await update(ref(db, `catalogues/${userId}/${catalogueId}`), {
        ...updates,
        updatedAt: Date.now(),
      })
    })
  }

  static async deleteCatalogue(userId: string, catalogueId: string) {
    return this.handleDatabaseOperation(async () => {
      const db = ensureDatabaseAvailable()
      await remove(ref(db, `catalogues/${userId}/${catalogueId}`))
      await remove(ref(db, `catalogue_tables/${catalogueId}`))
    })
  }
}
