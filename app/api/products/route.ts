import { type NextRequest, NextResponse } from "next/server"
import { FirebaseService } from "@/lib/firebase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (userId) {
      const products = await FirebaseService.getUserProducts(userId)
      return NextResponse.json({ products })
    } else {
      const products = await FirebaseService.getAllProducts()
      return NextResponse.json({ products })
    }
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const productData = await request.json()

    if (!productData.userId || !productData.name) {
      return NextResponse.json({ error: "User ID and product name are required" }, { status: 400 })
    }

    const productId = await FirebaseService.createProduct(productData.userId, {
      name: productData.name,
      description: productData.description || "",
      price: productData.price || 0,
      category: productData.category || "",
      status: productData.status || "active",
      traits: productData.traits || {},
    })

    return NextResponse.json({
      success: true,
      productId,
      message: "Product created successfully",
    })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
