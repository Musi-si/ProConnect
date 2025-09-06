import { Header } from "@/components/layout/header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import {
  SearchIcon,
  CheckIcon,
  HandshakeIcon,
  ArrowRightIcon,
  UsersIcon,
  TrendingUpIcon,
  ShieldCheckIcon,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--primary)]/10 via-background to-[var(--primary)]/10 dark:from-gray-900 dark:via-background dark:to-gray-900"></div>
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23b76d12\\' fill-opacity=\\'0.07\\'%3E%3Ccircle cx=\\'30\\' cy=\\'30\\' r=\\'2\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-40"></div>
        <div className="relative container mx-auto px-4 py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-sm">
                  Find the perfect
                  <span className="text-primary"> freelancer</span>
                  {" "}for your project
                </h1>
                <p className="text-lg text-muted-foreground max-w-xl drop-shadow">
                  Connect with skilled professionals worldwide. Post your project, receive competitive bids, and get quality work delivered on time.
                </p>
              </div>
              {/* Quick Search */}
              <Card className="p-6 shadow-2xl bg-white/90 dark:bg-card/90 border border-border">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 relative">
                    <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="What service are you looking for?"
                      className="pl-10 bg-muted/60 dark:bg-muted/40 border border-border shadow"
                      data-testid="hero-search-input"
                      aria-label="Search for services"
                    />
                  </div>
                  <Link href="/projects/browse">
                    <Button className="whitespace-nowrap shadow-md" data-testid="hero-search-button" aria-label="Search Now">
                      Search Now
                    </Button>
                  </Link>
                </div>
              </Card>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-8">
                <div className="text-center bg-muted/60 dark:bg-muted/30 rounded-lg py-4 shadow">
                  <div className="text-2xl font-bold text-primary">10K+</div>
                  <div className="text-sm text-muted-foreground">Active Freelancers</div>
                </div>
                <div className="text-center bg-muted/60 dark:bg-muted/30 rounded-lg py-4 shadow">
                  <div className="text-2xl font-bold text-primary">5K+</div>
                  <div className="text-sm text-muted-foreground">Projects Completed</div>
                </div>
                <div className="text-center bg-muted/60 dark:bg-muted/30 rounded-lg py-4 shadow">
                  <div className="text-2xl font-bold text-primary">98%</div>
                  <div className="text-sm text-muted-foreground">Client Satisfaction</div>
                </div>
              </div>
            </div>
            {/* Hero Image */}
            <div className="lg:order-last">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600"
                  alt="Modern office workspace with laptops and collaboration tools"
                  className="rounded-2xl shadow-2xl w-full h-auto bg-muted/70"
                />
                {/* Floating Elements */}
                <Card className="absolute -top-6 -right-6 p-4 shadow-xl bg-white/95 dark:bg-card/95 border border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow">
                      <CheckIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">Project Completed!</div>
                      <div className="text-xs text-muted-foreground">$2,500 earned</div>
                    </div>
                  </div>
                </Card>
                <Card className="absolute -bottom-6 -left-6 p-4 shadow-xl bg-white/95 dark:bg-card/95 border border-border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center shadow">
                      <HandshakeIcon className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <div className="font-medium text-sm">New Match Found!</div>
                      <div className="text-xs text-muted-foreground">95% skill match</div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-muted/70 dark:bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-sm">Why Choose ProConnect?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto drop-shadow">
              We provide everything you need to succeed in the freelance marketplace.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6 text-center bg-white/90 dark:bg-card/90 border border-border shadow-lg transition-transform hover:scale-105 hover:shadow-2xl">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Verified Professionals</h3>
              <p className="text-muted-foreground">
                All freelancers are thoroughly vetted and verified for quality assurance.
              </p>
            </Card>
            <Card className="p-6 text-center bg-white/90 dark:bg-card/90 border border-border shadow-lg transition-transform hover:scale-105 hover:shadow-2xl">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <ShieldCheckIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Payments</h3>
              <p className="text-muted-foreground">
                Payments are processed securely through Stripe with milestone-based releases.
              </p>
            </Card>
            <Card className="p-6 text-center bg-white/90 dark:bg-card/90 border border-border shadow-lg transition-transform hover:scale-105 hover:shadow-2xl">
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUpIcon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Project Tracking</h3>
              <p className="text-muted-foreground">
                Track progress with real-time updates and milestone management.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-sm">Popular Categories</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto drop-shadow">
              Browse projects by category or find the right freelancer for your needs.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "Web Development", count: "1,200+ projects", skills: ["React.js", "Node.js", "Python"] },
              { name: "Mobile Development", count: "800+ projects", skills: ["React Native", "Flutter", "iOS"] },
              { name: "Design & Creative", count: "950+ projects", skills: ["UI/UX", "Graphic Design", "Branding"] },
              { name: "Writing & Translation", count: "600+ projects", skills: ["Content Writing", "Copywriting", "SEO"] },
            ].map((category, index) => (
              <Card
                key={index}
                className="p-6 bg-muted/60 dark:bg-muted/30 border border-border hover:shadow-2xl hover:-translate-y-1 transition-all cursor-pointer group shadow"
              >
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">{category.count}</p>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, skillIndex) => (
                    <Badge key={skillIndex} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/projects/browse">
              <Button variant="outline" className="shadow" data-testid="browse-all-categories" aria-label="Browse All Categories">
                Browse All Categories
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground shadow-inner">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow">Ready to Get Started?</h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8 drop-shadow">
            Join thousands of successful freelancers and clients who trust ProConnect for their projects.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button size="lg" variant="secondary" className="shadow-md" data-testid="cta-join-freelancer" aria-label="Join as Freelancer">
                Join as Freelancer
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground shadow-md"
                data-testid="cta-hire-talent"
                aria-label="Hire Talent"
              >
                Hire Talent
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-auto shadow-inner">
        <div className="container mx-auto px-4 py-16">
          <div className="grid lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="bg-primary rounded-lg p-2 shadow">
                  <HandshakeIcon className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">ProConnect</span>
              </div>
              <p className="text-muted-foreground">
                The world's largest marketplace for connecting clients with talented freelancers.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">For Clients</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/projects/create" className="hover:text-primary">
                    Post a Project
                  </Link>
                </li>
                <li>
                  <Link href="/freelancers/browse" className="hover:text-primary">
                    Find Freelancers
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">For Freelancers</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="/projects/browse" className="hover:text-primary">
                    Find Work
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Resources
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="font-semibold">Support</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Link href="#" className="hover:text-primary">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="text-xs text-muted-foreground mt-8 text-center">
            © {new Date().getFullYear()} ProConnect. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
