"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  Eye,
  Share2,
  ExternalLink,
  BarChart3,
  MessageCircle,
  Mail,
  Facebook,
  Linkedin,
} from "lucide-react"
import Link from "next/link"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MobileShareSheet } from "@/components/mobile-share-sheet"

export default function SharedLinksPage() {
  const [copiedId, setCopiedId] = useState<number | null>(null)

  const sharedLinks = [
    {
      id: 1,
      catalogue: "Office Furniture Collection",
      url: "office-furniture-2024",
      fullUrl: "https://cataloguehub.com/c/office-furniture-2024",
      views: 342,
      shares: 12,
      clicks: 89,
      status: "Active",
      createdAt: "2 days ago",
      lastViewed: "1 hour ago",
    },
    {
      id: 2,
      catalogue: "Tech Accessories",
      url: "tech-accessories",
      fullUrl: "https://cataloguehub.com/c/tech-accessories",
      views: 289,
      shares: 8,
      clicks: 67,
      status: "Active",
      createdAt: "1 week ago",
      lastViewed: "3 hours ago",
    },
    {
      id: 3,
      catalogue: "Home Decor Essentials",
      url: "home-decor-draft",
      fullUrl: "https://cataloguehub.com/c/home-decor-draft",
      views: 156,
      shares: 5,
      clicks: 34,
      status: "Private",
      createdAt: "2 weeks ago",
      lastViewed: "1 day ago",
    },
  ]

  const copyToClipboard = async (url: string, id: number) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = url
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    }
  }

  const quickShare = (platform: string, link: (typeof sharedLinks)[0]) => {
    const encodedUrl = encodeURIComponent(link.fullUrl)
    const encodedText = encodeURIComponent(`Check out this catalogue: ${link.catalogue}`)
    const encodedTitle = encodeURIComponent(link.catalogue)

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
    }

    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], "_blank", "width=600,height=400")
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-montserrat text-foreground">Shared Links</h1>
          <p className="text-muted-foreground mt-2">Manage and track your catalogue sharing links</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/catalogues/new">
            <Plus className="mr-2 h-4 w-4" />
            Create New Link
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-marketplace">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">787</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-marketplace">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Shares</CardTitle>
            <Share2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">25</div>
            <p className="text-xs text-muted-foreground">+8% from last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-marketplace">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click-through Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24.1%</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>

        <Card className="shadow-marketplace">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Links</CardTitle>
            <ExternalLink className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 public, 1 private</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-marketplace">
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search shared links..." className="pl-10" />
            </div>
            <Button variant="outline">
              <Filter className="mr-2 h-4 w-4" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shared Links List */}
      <div className="space-y-4">
        {sharedLinks.map((link) => (
          <Card key={link.id} className="shadow-marketplace hover:shadow-marketplace-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold font-montserrat">{link.catalogue}</h3>
                    <Badge variant={link.status === "Active" ? "default" : "secondary"}>{link.status}</Badge>
                  </div>

                  <div className="flex items-center space-x-2 mb-4">
                    <code className="bg-muted px-2 py-1 rounded text-sm font-mono">{link.fullUrl}</code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(link.fullUrl, link.id)}>
                      {copiedId === link.id ? <Eye className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={link.fullUrl} target="_blank">
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary">{link.views}</div>
                      <div className="text-sm text-muted-foreground">Views</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary">{link.shares}</div>
                      <div className="text-sm text-muted-foreground">Shares</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent">{link.clicks}</div>
                      <div className="text-sm text-muted-foreground">Clicks</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-chart-4">
                        {((link.clicks / link.views) * 100).toFixed(1)}%
                      </div>
                      <div className="text-sm text-muted-foreground">CTR</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Created {link.createdAt}</span>
                    <span>Last viewed {link.lastViewed}</span>
                  </div>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="mr-2 h-4 w-4" />
                      View Analytics
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Settings
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => copyToClipboard(link.fullUrl, link.id)}>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <MobileShareSheet
                        catalogueUrl={link.fullUrl}
                        catalogueName={link.catalogue}
                        catalogueDescription={`View ${link.catalogue} catalogue`}
                      >
                        <div className="flex items-center w-full">
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </div>
                      </MobileShareSheet>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Share Actions */}
      <Card className="shadow-marketplace">
        <CardHeader>
          <CardTitle className="font-montserrat">Quick Share</CardTitle>
          <CardDescription>Share your catalogues across different platforms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "WhatsApp", icon: MessageCircle, color: "text-green-600", platform: "whatsapp" },
              { name: "Email", icon: Mail, color: "text-blue-600", platform: "email" },
              { name: "LinkedIn", icon: Linkedin, color: "text-blue-800", platform: "linkedin" },
              { name: "Facebook", icon: Facebook, color: "text-blue-700", platform: "facebook" },
            ].map((social) => (
              <Button
                key={social.name}
                variant="outline"
                className="h-16 flex-col space-y-2 bg-transparent"
                onClick={() => quickShare(social.platform, sharedLinks[0])} // Share first catalogue as example
              >
                <social.icon className={`h-6 w-6 ${social.color}`} />
                <span>{social.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
