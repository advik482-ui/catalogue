import { type NextRequest, NextResponse } from "next/server"
import { FirebaseService } from "@/lib/firebase"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (userId) {
      const catalogues = await FirebaseService.getUserCatalogues(userId)
      return NextResponse.json({ catalogues })
    } else {
      const catalogues = await FirebaseService.getAllCatalogues()
      return NextResponse.json({ catalogues })
    }
  } catch (error) {
    console.error("Error fetching catalogues:", error)
    return NextResponse.json({ error: "Failed to fetch catalogues" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const catalogueData = await request.json()

    if (!catalogueData.userId || !catalogueData.name) {
      return NextResponse.json({ error: "User ID and catalogue name are required" }, { status: 400 })
    }

    const catalogueId = await FirebaseService.createCatalogue(catalogueData.userId, {
      name: catalogueData.name,
      description: catalogueData.description || "",
      slug: catalogueData.slug || catalogueData.name.toLowerCase().replace(/\s+/g, "-"),
      selectedProducts: catalogueData.selectedProducts || [],
      visibleFields: catalogueData.visibleFields || [],
      settings: catalogueData.settings || {},
    })

    return NextResponse.json({
      success: true,
      catalogueId,
      message: "Catalogue created successfully",
    })
  } catch (error) {
    console.error("Error creating catalogue:", error)
    return NextResponse.json({ error: "Failed to create catalogue" }, { status: 500 })
  }
}
