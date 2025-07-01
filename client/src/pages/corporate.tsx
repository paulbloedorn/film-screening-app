import { Building2, Clock, Video } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ScreeningForm from "@/components/screening-form";
import { Card, CardContent } from "@/components/ui/card";

export default function Corporate() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-teal-500 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <Building2 className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-5xl font-display font-bold mb-6">Corporate Screenings</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            24 Days Without You is an inspiring and informative centerpiece to bring awareness 
            and foster an open conversation on maternal health at your corporate event.
          </p>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="pt-8">
              <blockquote className="text-2xl font-display italic text-center text-gray-700 mb-6">
                "Equal parts heart, courage, and cinematic sparkle. Your film doesn't just tell a story; 
                it breaks stigma, builds bridges, and teaches compassion in a world sorely needing all three."
              </blockquote>
              <footer className="text-center text-gray-600 font-medium">
                — Glynne Barber Bassi, CFP
              </footer>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-cream-100">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
            <div className="space-y-6">
              <h2 className="text-3xl font-display font-bold">Corporate Wellness & Awareness</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                24 Days Without You is an inspiring and informative centerpiece to bring awareness 
                and foster an open conversation on maternal health at your corporate event.
              </p>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center space-x-3">
                  <Clock className="h-6 w-6 text-teal-500" />
                  <span className="text-gray-700">56 minutes long</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Video className="h-6 w-6 text-teal-500" />
                  <span className="text-gray-700">Vimeo streaming</span>
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold text-teal-800 mb-4">Morgan Stanley Event</h3>
                <p className="text-gray-700 leading-relaxed">
                  24 Days Without You was hosted by one of Morgan Stanley's women's wellness groups 
                  in honor of Maternal Mental Health Awareness Day. They rented a theater and provided 
                  snacks and beverages. Conversation with Annie and Rebecca followed the film.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Form Section */}
          <div className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display font-bold mb-4">Inquire About Corporate Screening</h2>
              <p className="text-xl text-gray-600">
                Include 24 Days Without You at your corporate event!
              </p>
            </div>
            <ScreeningForm screeningType="corporate" title="Corporate" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
