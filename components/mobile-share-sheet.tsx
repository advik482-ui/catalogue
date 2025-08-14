"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Share2, Copy, MessageCircle, Mail, Facebook, Twitter, Linkedin, QrCode, Download, Check } from "lucide-react"

interface MobileShareSheetProps {
  catalogueUrl: string
  catalogueName: string
  catalogueDescription: string
  children: React.ReactNode
}

export function MobileShareSheet({
  catalogueUrl,
  catalogueName,
  catalogueDescription,
  children,
}: MobileShareSheetProps) {
  const [copied, setCopied] = useState(false)
  const [customMessage, setCustomMessage] = useState(`Check out this amazing catalogue: ${catalogueName}`)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(catalogueUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
      // Fallback for older browsers
      const textArea = document.createElement("textarea")
      textArea.value = catalogueUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand("copy")
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareVia = (platform: string) => {
    const encodedUrl = encodeURIComponent(catalogueUrl)
    const encodedText = encodeURIComponent(customMessage)
    const encodedTitle = encodeURIComponent(catalogueName)
    const encodedDescription = encodeURIComponent(catalogueDescription)

    const shareUrls = {
      whatsapp: `https://wa.me/?text=${encodedText}%20${encodedUrl}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedText}%0A%0A${encodedUrl}%0A%0A${encodedDescription}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}&quote=${encodedText}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDescription}`,
      instagram: `https://www.instagram.com/`, // Instagram doesn't support direct URL sharing
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`,
      reddit: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      pinterest: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedText}`,
    }

    if (shareUrls[platform as keyof typeof shareUrls]) {
      window.open(shareUrls[platform as keyof typeof shareUrls], "_blank", "width=600,height=400")
    }
  }

  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: catalogueName,
          text: catalogueDescription,
          url: catalogueUrl,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    }
  }

  const generateQRCode = () => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(catalogueUrl)}`
    const newWindow = window.open("", "_blank")
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>QR Code - ${catalogueName}</title></head>
          <body style="display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; font-family: Arial, sans-serif;">
            <h2>${catalogueName}</h2>
            <img src="${qrUrl}" alt="QR Code" style="border: 1px solid #ccc; padding: 20px; border-radius: 8px;" />
            <p style="margin-top: 20px; text-align: center; max-width: 400px;">Scan this QR code to view the catalogue</p>
            <button onclick="window.print()" style="margin-top: 20px; padding: 10px 20px; background: #2563eb; color: white; border: none; border-radius: 4px; cursor: pointer;">Print QR Code</button>
          </body>
        </html>
      `)
    }
  }

  const downloadPDF = () => {
    // Create a simple PDF download link
    const pdfContent = `
      Catalogue: ${catalogueName}
      Description: ${catalogueDescription}
      Link: ${catalogueUrl}
      
      Generated on: ${new Date().toLocaleDateString()}
    `

    const blob = new Blob([pdfContent], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = `${catalogueName.replace(/[^a-z0-9]/gi, "_").toLowerCase()}_catalogue.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent side="bottom" className="h-[80vh] overflow-y-auto">
        <SheetHeader className="text-left">
          <SheetTitle className="font-montserrat">Share Catalogue</SheetTitle>
          <SheetDescription>Share this catalogue with your network</SheetDescription>
        </SheetHeader>

        <div className="space-y-6 mt-6">
          {/* Native Share (if supported) */}
          {typeof navigator !== "undefined" && navigator.share && (
            <Button onClick={nativeShare} className="w-full" size="lg">
              <Share2 className="mr-2 h-5 w-5" />
              Share via Device
            </Button>
          )}

          {/* Copy Link */}
          <Card className="shadow-marketplace">
            <CardHeader>
              <CardTitle className="text-lg font-montserrat">Copy Link</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex space-x-2">
                <Input value={catalogueUrl} readOnly className="flex-1" />
                <Button onClick={copyToClipboard} variant="outline">
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              {copied && <p className="text-sm text-green-600">Link copied to clipboard!</p>}
            </CardContent>
          </Card>

          {/* Custom Message */}
          <Card className="shadow-marketplace">
            <CardHeader>
              <CardTitle className="text-lg font-montserrat">Customize Message</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                placeholder="Add a personal message..."
                rows={3}
              />
            </CardContent>
          </Card>

          {/* Social Platforms */}
          <Card className="shadow-marketplace">
            <CardHeader>
              <CardTitle className="text-lg font-montserrat">Share on Social Media</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => shareVia("whatsapp")}
                  className="h-16 flex-col space-y-2 bg-transparent"
                >
                  <MessageCircle className="h-6 w-6 text-green-600" />
                  <span className="text-sm">WhatsApp</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => shareVia("email")}
                  className="h-16 flex-col space-y-2 bg-transparent"
                >
                  <Mail className="h-6 w-6 text-blue-600" />
                  <span className="text-sm">Email</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => shareVia("facebook")}
                  className="h-16 flex-col space-y-2 bg-transparent"
                >
                  <Facebook className="h-6 w-6 text-blue-700" />
                  <span className="text-sm">Facebook</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => shareVia("twitter")}
                  className="h-16 flex-col space-y-2 bg-transparent"
                >
                  <Twitter className="h-6 w-6 text-blue-500" />
                  <span className="text-sm">Twitter</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => shareVia("linkedin")}
                  className="h-16 flex-col space-y-2 bg-transparent"
                >
                  <Linkedin className="h-6 w-6 text-blue-800" />
                  <span className="text-sm">LinkedIn</span>
                </Button>

                <Button
                  variant="outline"
                  onClick={() => shareVia("telegram")}
                  className="h-16 flex-col space-y-2 bg-transparent"
                >
                  <MessageCircle className="h-6 w-6 text-blue-500" />
                  <span className="text-sm">Telegram</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Additional Options */}
          <Card className="shadow-marketplace">
            <CardHeader>
              <CardTitle className="text-lg font-montserrat">More Options</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="h-16 flex-col space-y-2 bg-transparent" onClick={generateQRCode}>
                  <QrCode className="h-6 w-6" />
                  <span className="text-sm">QR Code</span>
                </Button>

                <Button variant="outline" className="h-16 flex-col space-y-2 bg-transparent" onClick={downloadPDF}>
                  <Download className="h-6 w-6" />
                  <span className="text-sm">Download Info</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  )
}
