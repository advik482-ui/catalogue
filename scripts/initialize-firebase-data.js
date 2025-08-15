// Initialize Firebase Realtime Database with proper schema
import { initializeApp } from "firebase/app"
import { getDatabase, ref, set, get } from "firebase/database"

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

const app = initializeApp(firebaseConfig)
const database = getDatabase(app)

async function initializeDatabase() {
  try {
    console.log("Checking Firebase database schema...")
    
    // Check if schema already exists
    const schemaCheck = await get(ref(database, "schema_version"))
    
    if (schemaCheck.exists()) {
      console.log("Database schema already exists, skipping initialization")
      return
    }

    console.log("Initializing Firebase database schema with sample data...")

    const initialData = {
      schema_version: "1.0.0",
      schema_created: Date.now(),
      
      // Admin and demo users
      users: {
        "admin-001": {
          id: "admin-001",
          name: "Admin User",
          email: "admin@cataloguehub.com",
          password: "admin123",
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
        },
        "demo-user-002": {
          id: "demo-user-002",
          name: "Sarah Wilson",
          email: "sarah@demo.com",
          password: "password123",
          role: "user",
          status: "active",
          joinDate: "2024-01-20",
          lastActive: new Date().toISOString(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        }
      },
      
      // Sample products organized by user
      products: {
        "demo-user-001": {
          "prod-001": {
            id: "prod-001",
            userId: "demo-user-001",
            name: "Premium Office Chair",
            description: "Ergonomic office chair with lumbar support, adjustable height, and premium materials. Perfect for long work sessions.",
            price: 299.99,
            currency: "USD",
            categoryId: "furniture",
            categoryName: "Furniture",
            images: [
              "https://images.pexels.com/photos/586344/pexels-photo-586344.jpeg?auto=compress&cs=tinysrgb&w=800"
            ],
            status: "active",
            tags: ["office", "ergonomic", "furniture", "premium"],
            customFields: [
              {
                fieldId: "material",
                fieldName: "Material",
                fieldType: "text",
                value: "Mesh and High-Grade Plastic"
              },
              {
                fieldId: "warranty",
                fieldName: "Warranty",
                fieldType: "text",
                value: "2 years"
              },
              {
                fieldId: "weight_capacity",
                fieldName: "Weight Capacity",
                fieldType: "text",
                value: "150 kg"
              }
            ],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          "prod-002": {
            id: "prod-002",
            userId: "demo-user-001",
            name: "Wireless Bluetooth Headphones",
            description: "High-quality wireless headphones with active noise cancellation and 30-hour battery life.",
            price: 149.99,
            currency: "USD",
            categoryId: "electronics",
            categoryName: "Electronics",
            images: [
              "https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800"
            ],
            status: "active",
            tags: ["electronics", "wireless", "audio", "bluetooth"],
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
              },
              {
                fieldId: "noise_cancellation",
                fieldName: "Noise Cancellation",
                fieldType: "boolean",
                value: true
              }
            ],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          "prod-003": {
            id: "prod-003",
            userId: "demo-user-001",
            name: "Standing Desk Converter",
            description: "Adjustable standing desk converter that transforms any desk into a sit-stand workstation.",
            price: 199.99,
            currency: "USD",
            categoryId: "furniture",
            categoryName: "Furniture",
            images: [
              "https://images.pexels.com/photos/7688336/pexels-photo-7688336.jpeg?auto=compress&cs=tinysrgb&w=800"
            ],
            status: "active",
            tags: ["office", "standing", "desk", "health"],
            customFields: [
              {
                fieldId: "height_range",
                fieldName: "Height Range",
                fieldType: "text",
                value: "15cm - 50cm"
              },
              {
                fieldId: "surface_area",
                fieldName: "Surface Area",
                fieldType: "text",
                value: "80cm x 60cm"
              }
            ],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }
        },
        "demo-user-002": {
          "prod-004": {
            id: "prod-004",
            userId: "demo-user-002",
            name: "Smart Home Security Camera",
            description: "WiFi-enabled security camera with night vision and mobile app control.",
            price: 89.99,
            currency: "USD",
            categoryId: "electronics",
            categoryName: "Electronics",
            images: [
              "https://images.pexels.com/photos/430208/pexels-photo-430208.jpeg?auto=compress&cs=tinysrgb&w=800"
            ],
            status: "active",
            tags: ["security", "smart-home", "camera", "wifi"],
            customFields: [
              {
                fieldId: "resolution",
                fieldName: "Resolution",
                fieldType: "text",
                value: "1080p HD"
              },
              {
                fieldId: "night_vision",
                fieldName: "Night Vision",
                fieldType: "boolean",
                value: true
              }
            ],
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }
        }
      },
      
      // Sample catalogues
      catalogues: {
        "demo-user-001": {
          "cat-001": {
            id: "cat-001",
            userId: "demo-user-001",
            name: "Office Essentials Collection",
            description: "Everything you need for a modern, productive office setup",
            slug: "office-essentials-demo",
            selectedProducts: ["prod-001", "prod-002", "prod-003"],
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
          description: "Office and home furniture items",
          createdAt: Date.now(),
        },
        "electronics": {
          id: "electronics",
          name: "Electronics",
          description: "Electronic devices and gadgets",
          createdAt: Date.now(),
        },
        "home-decor": {
          id: "home-decor",
          name: "Home Decor",
          description: "Decorative items for home and office",
          createdAt: Date.now(),
        }
      },
      
      // Field templates for reusable field definitions
      field_templates: {
        "demo-user-001": {
          "template-001": {
            id: "template-001",
            userId: "demo-user-001",
            name: "Electronics Template",
            description: "Standard fields for electronic products",
            category: "Electronics",
            fields: [
              {
                id: "battery_life",
                name: "Battery Life",
                type: "text",
                required: false,
                placeholder: "Enter battery life"
              },
              {
                id: "connectivity",
                name: "Connectivity",
                type: "select",
                required: false,
                options: ["Bluetooth", "WiFi", "USB", "Wireless"]
              },
              {
                id: "warranty",
                name: "Warranty",
                type: "text",
                required: false,
                placeholder: "Enter warranty period"
              }
            ],
            isPublic: false,
            usageCount: 0,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          },
          "template-002": {
            id: "template-002",
            userId: "demo-user-001",
            name: "Furniture Template",
            description: "Standard fields for furniture items",
            category: "Furniture",
            fields: [
              {
                id: "material",
                name: "Material",
                type: "text",
                required: false,
                placeholder: "Enter material type"
              },
              {
                id: "dimensions",
                name: "Dimensions",
                type: "text",
                required: false,
                placeholder: "Enter dimensions"
              },
              {
                id: "weight_capacity",
                name: "Weight Capacity",
                type: "text",
                required: false,
                placeholder: "Enter weight capacity"
              }
            ],
            isPublic: false,
            usageCount: 0,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          }
        }
      },
      
      // Catalogue tables for public access
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

    // Initialize the database with the complete structure
    await set(ref(database, "/"), initialData)
    console.log("✅ Database schema initialized successfully with sample data!")
    console.log("📊 Created:")
    console.log("   - 3 users (1 admin, 2 demo users)")
    console.log("   - 4 sample products")
    console.log("   - 1 demo catalogue")
    console.log("   - 3 categories")
    console.log("   - 2 field templates")
    
  } catch (error) {
    console.error("❌ Error initializing database:", error)
    throw error
  }
}

// Run the initialization
initializeDatabase()
  .then(() => {
    console.log("🎉 Database initialization completed!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("💥 Database initialization failed:", error)
    process.exit(1)
  })