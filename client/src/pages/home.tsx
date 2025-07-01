import { Play, Clock, Video } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-teal-500 text-white py-20 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-5xl lg:text-6xl font-display font-bold leading-tight">
                The Film
              </h1>
              <div className="text-xl leading-relaxed opacity-90">
                On March 22, 2020, Annie and Tony checked into the hospital for what should have been a routine delivery of their baby boy.
              </div>
              <div className="text-lg leading-relaxed opacity-80">
                Early the next morning, Annie experienced an Amniotic Fluid Embolism (AFE) -- a rare and often fatal complication of childbirth. This is the story of the heroic efforts of Annie's care team to save her and her baby from near death, the subsequent devastation resulting from birth trauma, and Annie's never-ending determination to find her way to her son.
              </div>
              <div className="pt-4">
                <Button className="bg-white text-teal-700 px-8 py-3 hover:bg-cream-100 transition-colors duration-200 inline-flex items-center space-x-2">
                  <Play className="h-5 w-5" />
                  <span>Watch Trailer</span>
                </Button>
              </div>
            </div>
            <div className="relative">
              <div className="bg-white rounded-lg shadow-2xl max-w-md mx-auto p-6">
                <div className="text-center space-y-4">
                  <div className="text-4xl font-display font-bold text-teal-700">24</div>
                  <div className="text-xl font-medium text-teal-600">DAYS</div>
                  <div className="text-lg tracking-wider text-teal-600">WITHOUT</div>
                  <div className="text-xl italic text-teal-700">YOU</div>
                  <div className="text-sm text-gray-600 mt-4">A FILM BY REBECCA RIZZIO</div>
                  <div className="aspect-video bg-teal-100 rounded-lg flex items-center justify-center">
                    <Play className="h-12 w-12 text-teal-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Film Details */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <Card>
              <CardContent className="pt-6">
                <Clock className="h-12 w-12 text-teal-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">56 Minutes</h3>
                <p className="text-gray-600">Full-length documentary film</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <Video className="h-12 w-12 text-teal-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Vimeo Streaming</h3>
                <p className="text-gray-600">Available for your event</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="h-12 w-12 bg-teal-500 text-white rounded-full flex items-center justify-center mx-auto mb-4 font-bold">
                  AFE
                </div>
                <h3 className="text-xl font-semibold mb-2">Educational Focus</h3>
                <p className="text-gray-600">Maternal health awareness</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 bg-cream-100">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-display font-bold text-center mb-12">What People Are Saying</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6">
                <blockquote className="text-lg italic text-gray-700 mb-4">
                  "24 Days Without You serves as a vital educational tool for both the general public and the medical community. For the public, it sheds light on a rare but life-threatening condition that many may not be aware of, fostering greater understanding and empathy."
                </blockquote>
                <footer className="text-sm font-medium text-gray-600">
                  — Medical Professional
                </footer>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <blockquote className="text-lg italic text-gray-700 mb-4">
                  "This documentary is a powerful testament to the mother-child relationship. It is a crucial contribution to raising awareness about AFE and the broader need for comprehensive support systems for families navigating severe birth complications."
                </blockquote>
                <footer className="text-sm font-medium text-gray-600">
                  — Healthcare Advocate
                </footer>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-teal-500 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-display font-bold mb-6">Ready to Host a Screening?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Contact us to bring 24 Days Without You to your next event and foster meaningful conversations about maternal health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button className="bg-white text-teal-700 px-8 py-3 hover:bg-cream-100 transition-colors duration-200">
              Contact Us
            </Button>
            <Button 
              variant="outline" 
              className="border-2 border-white text-white px-8 py-3 hover:bg-white hover:text-teal-700 transition-colors duration-200"
            >
              Schedule a Call
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
