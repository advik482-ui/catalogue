// Database utility functions for the marketplace platform
import { FirebaseService } from "./firebase"

export class DatabaseUtils {
  /**
   * Initialize database with sample data if empty
   */
  static async initializeIfEmpty() {
    try {
      const users = await FirebaseService.getAllUsers()
      
      if (!users || users.length === 0) {
        console.log("Database appears empty, initializing with sample data...")
        await this.createSampleData()
      }
    } catch (error) {
      console.error("Error checking database state:", error)
      throw error
    }
  }

  /**
   * Create sample data for demonstration
   */
  static async createSampleData() {
    try {
      // Create demo users
      const demoUserId = await FirebaseService.createUser({
        name: "John Demo",
        email: "john@demo.com",
        password: "password123",
        role: "user",
        status: "active",
        joinDate: new Date().toISOString().split("T")[0],
        lastActive: new Date().toISOString(),
      })

      // Create sample products for demo user
      const products = [
        {
          name: "Premium Office Chair",
          description: "Ergonomic office chair with lumbar support and adjustable height",
          price: 299.99,
          categoryName: "Furniture",
          images: ["https://images.pexels.com/photos/586344/pexels-photo-586344.jpeg?auto=compress&cs=tinysrgb&w=800"],
          tags: ["office", "ergonomic", "furniture"],
          customFields: [
            { fieldName: "Material", fieldType: "text", value: "Mesh and Plastic" },
            { fieldName: "Warranty", fieldType: "text", value: "2 years" }
          ]
        },
        {
          name: "Wireless Bluetooth Headphones",
          description: "High-quality wireless headphones with noise cancellation",
          price: 149.99,
          categoryName: "Electronics",
          images: ["https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg?auto=compress&cs=tinysrgb&w=800"],
          tags: ["electronics", "wireless", "audio"],
          customFields: [
            { fieldName: "Battery Life", fieldType: "text", value: "30 hours" },
            { fieldName: "Connectivity", fieldType: "text", value: "Bluetooth 5.0" }
          ]
        }
      ]

      for (const productData of products) {
        await FirebaseService.createProduct(demoUserId, productData)
      }

      console.log("✅ Sample data created successfully")
    } catch (error) {
      console.error("❌ Error creating sample data:", error)
      throw error
    }
  }

  /**
   * Validate database connection and schema
   */
  static async validateDatabase() {
    try {
      const users = await FirebaseService.getAllUsers()
      const products = await FirebaseService.getAllProducts()
      
      console.log("📊 Database validation:")
      console.log(`   - Users: ${users.length}`)
      console.log(`   - Products: ${products.length}`)
      
      return {
        isValid: true,
        userCount: users.length,
        productCount: products.length
      }
    } catch (error) {
      console.error("❌ Database validation failed:", error)
      return {
        isValid: false,
        error: error.message
      }
    }
  }

  /**
   * Reset database (use with caution!)
   */
  static async resetDatabase() {
    try {
      console.log("⚠️  Resetting database...")
      // This would require admin privileges and careful implementation
      // For now, just log the intent
      console.log("Database reset functionality not implemented for safety")
    } catch (error) {
      console.error("❌ Error resetting database:", error)
      throw error
    }
  }
}