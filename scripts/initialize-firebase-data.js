// Initialize Firebase Realtime Database with sample data
import { initializeApp } from "firebase/app"
import { getDatabase, ref, set } from "firebase/database"

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
    console.log("Initializing Firebase database schema...")

    // Initialize users structure
    await set(ref(database, "users"), {
      admin_001: {
        name: "Admin User",
        email: "admin@catalog.com",
        password: "hashed_password_here",
        role: "admin",
        status: "active",
        joinDate: "2024-01-01",
        lastActive: new Date().toISOString(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
        profile: {
          avatar: "",
          phone: "+1234567890",
          address: "Admin Address",
        },
      },
    })

    // Initialize catalogues structure
    await set(ref(database, "catalogues"), {
      cat_001: {
        name: "Sample Catalogue",
        description: "A sample catalogue for testing",
        slug: "sample-catalogue",
        shareUrl: "sample-catalogue-share",
        ownerId: "admin_001",
        status: "active",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        settings: {
          isPublic: true,
          allowComments: true,
          theme: "default",
        },
        products: {
          prod_001: true,
        },
      },
    })

    // Initialize products structure
    await set(ref(database, "products"), {
      prod_001: {
        name: "Sample Product",
        description: "A sample product for testing",
        price: 99.99,
        currency: "USD",
        category: "electronics",
        images: ["/generic-product-display.png"],
        status: "active",
        ownerId: "admin_001",
        createdAt: Date.now(),
        updatedAt: Date.now(),
        attributes: {
          color: "black",
          size: "medium",
          material: "plastic",
        },
      },
    })

    // Initialize categories structure
    await set(ref(database, "categories"), {
      cat_electronics: {
        name: "Electronics",
        description: "Electronic products and gadgets",
        parentId: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      cat_clothing: {
        name: "Clothing",
        description: "Apparel and fashion items",
        parentId: null,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    })

    console.log("Database schema initialized successfully!")
  } catch (error) {
    console.error("Error initializing database:", error)
  }
}

// Run the initialization
initializeDatabase()
