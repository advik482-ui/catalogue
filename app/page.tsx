import { ArrowRight, LibraryIcon as Catalog, Share2, Users, Zap, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Catalog className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold font-montserrat">CatalogueHub</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-foreground hover:text-primary font-medium transition-colors">
                Features
              </Link>
              <Link href="#pricing" className="text-foreground hover:text-primary font-medium transition-colors">
                Pricing
              </Link>
              <Link href="#about" className="text-foreground hover:text-primary font-medium transition-colors">
                About
              </Link>
              <Button variant="outline" asChild>
                <Link href="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Get Started</Link>
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-montserrat text-foreground mb-6 leading-tight">
              Transform Your Offerings Into{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Captivating Catalogues
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 leading-relaxed">
              Create dynamic, shareable sales catalogues that convert viewers into customers. Perfect for brokers, small
              businesses, and professionals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-6" asChild>
                <Link href="/signup">
                  Create Your Catalogue Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent" asChild>
                <Link href="#demo">See Demo</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black font-montserrat text-foreground mb-4">
              Everything You Need to Sell More
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful tools designed to help you create compelling sales experiences
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-marketplace hover:shadow-marketplace-lg transition-shadow">
              <CardHeader>
                <Zap className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="font-montserrat">Dynamic Catalogues</CardTitle>
                <CardDescription>
                  Build interactive catalogues with custom fields, unlimited images, and rich content
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-marketplace hover:shadow-marketplace-lg transition-shadow">
              <CardHeader>
                <Share2 className="h-12 w-12 text-secondary mb-4" />
                <CardTitle className="font-montserrat">Instant Sharing</CardTitle>
                <CardDescription>
                  Share anywhere with one click - WhatsApp, email, social media, and more
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="shadow-marketplace hover:shadow-marketplace-lg transition-shadow">
              <CardHeader>
                <Users className="h-12 w-12 text-accent mb-4" />
                <CardTitle className="font-montserrat">Smart Viewing</CardTitle>
                <CardDescription>
                  Visitors can filter, sort, and compare products with intelligent navigation
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl md:text-5xl font-black font-montserrat text-foreground mb-6">
                Showcase Your Products With Style
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                Create professional catalogues that make your offerings irresistible. Control what information to show
                and reach more customers effortlessly.
              </p>

              <div className="space-y-4">
                {[
                  "Unlimited product uploads with rich media",
                  "Custom fields for any industry",
                  "Selective visibility controls",
                  "Mobile-optimized viewing experience",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-6 w-6 text-primary flex-shrink-0" />
                    <span className="text-lg font-medium">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-8">
                <div className="bg-card rounded-xl shadow-marketplace-lg p-6">
                  <div className="space-y-4">
                    <div className="h-4 bg-primary/20 rounded w-3/4"></div>
                    <div className="h-32 bg-muted rounded-lg"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-muted rounded w-full"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </div>
                    <div className="flex space-x-2">
                      <div className="h-8 bg-primary/20 rounded flex-1"></div>
                      <div className="h-8 bg-secondary/20 rounded flex-1"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-5xl font-black font-montserrat text-primary-foreground mb-6">
            Ready to Transform Your Sales?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8">
            Join thousands of professionals who are already creating compelling catalogues
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
            <Link href="/signup">
              Start Creating Today
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <Catalog className="h-6 w-6 text-primary" />
                <span className="text-lg font-bold font-montserrat">CatalogueHub</span>
              </div>
              <p className="text-muted-foreground">Transform your offerings into captivating catalogues.</p>
            </div>

            <div>
              <h3 className="font-semibold font-montserrat mb-4">Product</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#features" className="hover:text-foreground transition-colors">
                    Features
                  </Link>
                </li>
                <li>
                  <Link href="#pricing" className="hover:text-foreground transition-colors">
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link href="#demo" className="hover:text-foreground transition-colors">
                    Demo
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold font-montserrat mb-4">Company</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#about" className="hover:text-foreground transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="#contact" className="hover:text-foreground transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="#support" className="hover:text-foreground transition-colors">
                    Support
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold font-montserrat mb-4">Legal</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#privacy" className="hover:text-foreground transition-colors">
                    Privacy
                  </Link>
                </li>
                <li>
                  <Link href="#terms" className="hover:text-foreground transition-colors">
                    Terms
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 CatalogueHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
