import { Calendar, Stethoscope, GraduationCap, Play, Users, CheckCircle, Star } from "lucide-react";
import { useEffect, useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import FAQ from "@/components/faq";
import ConsultationModal from "@/components/consultation-modal";
import TrailerModal from "@/components/trailer-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TinaErrorBoundary } from "@/components/tina-provider";
import { getHomepageContent } from "@tina/queries";
import type { Homepage } from "@tina/__generated__/types";

// Icon mapping for dynamic icon rendering
const iconMap = {
  Calendar,
  Stethoscope,
  GraduationCap,
  Users,
  Star,
};

// Helper function to render rich text content
const renderRichText = (content: any) => {
  if (!content || !content.children) return "";
  
  return content.children.map((child: any, index: number) => {
    if (child.type === "p" && child.children) {
      return child.children.map((textNode: any) => textNode.text || "").join("");
    }
    return "";
  }).join("");
};

export default function Home() {
  const [content, setContent] = useState<Homepage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Get the homepage content
        const homepageData = await getHomepageContent();
        setContent(homepageData);
      } catch (err) {
        console.error("Failed to load homepage content:", err);
        setError(err instanceof Error ? err.message : "Failed to load content");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading content...</p>
        </div>
      </div>
    );
  }

  if (error || !content) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600">Failed to load content: {error || "Content not found"}</p>
          <p className="text-sm text-gray-500 mt-2">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }
  return (
    <TinaErrorBoundary>
      <div className="min-h-screen">
        <Header />

      {/* Hero Section with Movie Poster */}
      <section className="py-20 bg-cream-100 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-5xl font-display font-bold leading-tight text-gray-800">
                {content.hero?.headline || "We all take childbirth for granted..."}
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                {renderRichText(content.hero?.subtitle)}
              </p>
              <div className="pt-4">
                <TrailerModal videoUrl={content.hero?.trailerButton?.videoUrl}>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg font-semibold inline-flex items-center space-x-2 shadow-lg">
                    <Play className="h-6 w-6" />
                    <span>{content.hero?.trailerButton?.text || "Watch Trailer"}</span>
                  </Button>
                </TrailerModal>
              </div>
            </div>
            <div className="relative">
              <div className="max-w-lg mx-auto">
                <img 
                  src={content.hero?.posterImage || "/assets/poster_24_days_1752421477308.png"} 
                  alt="24 Days Without You movie poster featuring Annie and her baby" 
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Screenings and Speaking Engagements CTA */}
      <section className="bg-teal-500 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-display font-bold mb-6">
            {content.screeningsCta?.headline || "Screenings and Speaking Engagements"}
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            {renderRichText(content.screeningsCta?.description)}
          </p>
          <ConsultationModal>
            <Button className="bg-white text-teal-700 px-12 py-4 hover:bg-cream-100 transition-colors duration-200 text-lg font-semibold">
              {content.screeningsCta?.buttonText || "Schedule a Consult"}
            </Button>
          </ConsultationModal>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-16 bg-cream-100">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-display font-bold text-center mb-12">
            {content.testimonials?.headline || "What People Are Saying"}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {content.testimonials?.items?.map((testimonial, index) => {
              const IconComponent = iconMap[testimonial?.icon as keyof typeof iconMap] || Calendar;
              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-4">
                      <IconComponent className="h-6 w-6 text-teal-600 mr-2" />
                      <Badge variant="secondary" className="bg-teal-100 text-teal-800">
                        {testimonial?.category}
                      </Badge>
                    </div>
                    <blockquote className="text-lg italic text-gray-700 mb-4">
                      "{renderRichText(testimonial?.quote)}"
                    </blockquote>
                    <footer className="text-sm font-medium text-gray-600">
                      — {testimonial?.author}, {testimonial?.title}
                    </footer>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Audience Cards Section */}
      <section className="bg-teal-500 text-white py-20 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold leading-tight mb-6">
              {content.audienceCards?.headline || "Award-winning maternal-health documentary with turnkey education packages"}
            </h2>
            <p className="text-xl lg:text-2xl opacity-90 max-w-4xl mx-auto">
              {renderRichText(content.audienceCards?.subtitle)}
            </p>
          </div>

          {/* Dynamic Audience Cards */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {content.audienceCards?.cards?.map((card, index) => {
              const IconComponent = iconMap[card?.icon as keyof typeof iconMap] || Calendar;
              return (
                <Card key={index} className="bg-white text-gray-800 shadow-2xl border-0 hover:shadow-3xl transition-shadow duration-300">
                  <CardContent className="p-8">
                    <div className="text-center mb-6">
                      <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="h-8 w-8 text-teal-600" />
                      </div>
                      <h3 className="text-2xl font-display font-bold text-teal-800 mb-2">
                        {card?.title}
                      </h3>
                    </div>
                    <div className="space-y-4 mb-8">
                      {card?.features?.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm">{feature?.text}</span>
                        </div>
                      ))}
                    </div>
                    <ConsultationModal defaultRole={card?.defaultRole}>
                      <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 text-lg font-semibold">
                        {card?.buttonText || "Schedule a Consult"}
                      </Button>
                    </ConsultationModal>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Impact Metrics Bar */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-12 text-center">
            {content.impactMetrics?.metrics?.map((metric, index) => {
              const IconComponent = iconMap[metric?.icon as keyof typeof iconMap] || Users;
              return (
                <div key={index} className="flex items-center space-x-2">
                  <IconComponent className="h-8 w-8 text-teal-600" />
                  <div>
                    <div className="text-3xl font-bold text-teal-800">{metric?.value}</div>
                    <div className="text-sm text-gray-600">{metric?.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-display font-bold text-center mb-12">
            {content.howItWorks?.headline || "How It Works"}
          </h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {content.howItWorks?.steps?.map((step, index) => (
              <div key={index} className="space-y-4">
                <div className="bg-teal-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                  {step?.number}
                </div>
                <h3 className="text-2xl font-semibold">{step?.title}</h3>
                <p className="text-gray-600">{step?.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <section className="bg-teal-500 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-display font-bold mb-6">
            {content.finalCta?.headline || "Ready to Transform Your Practice?"}
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            {renderRichText(content.finalCta?.description)}
          </p>
          <ConsultationModal>
            <Button className="bg-white text-teal-700 px-12 py-4 hover:bg-cream-100 transition-colors duration-200 text-lg font-semibold">
              {content.finalCta?.buttonText || "Schedule a Consult"}
            </Button>
          </ConsultationModal>
        </div>
      </section>

      <Footer />
      </div>
    </TinaErrorBoundary>
  );
}
