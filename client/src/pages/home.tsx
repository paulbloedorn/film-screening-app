import { Calendar, Stethoscope, GraduationCap, Play, Users, CheckCircle, Star } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import FAQ from "@/components/faq";
import ConsultationModal from "@/components/consultation-modal";
import TrailerModal from "@/components/trailer-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import posterImage from "@assets/poster_24_days_1752421477308.png";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section with Movie Poster */}
      <section className="py-20 bg-cream-100 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-4xl lg:text-5xl font-display font-bold leading-tight text-gray-800">
                We all take childbirth for granted...
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                On March 22, 2020, Annie and Tony checked into the hospital for what should have been a routine delivery of their baby boy. What followed was 24 days that would change their lives forever.
              </p>
              <div className="pt-4">
                <TrailerModal>
                  <Button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg font-semibold inline-flex items-center space-x-2 shadow-lg">
                    <Play className="h-6 w-6" />
                    <span>Watch Trailer</span>
                  </Button>
                </TrailerModal>
              </div>
            </div>
            <div className="relative">
              <div className="max-w-lg mx-auto">
                <img 
                  src={posterImage} 
                  alt="24 Days Without You movie poster featuring Annie and her baby" 
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audience Cards Section */}
      <section className="bg-teal-500 text-white py-20 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-display font-bold leading-tight mb-6">
              Award-winning maternal-health documentary with turnkey education packages
            </h2>
            <p className="text-xl lg:text-2xl opacity-90 max-w-4xl mx-auto">
              Inspire trauma-informed care and improve birth experiences across your organisation
            </p>
          </div>

          {/* Three Audience Cards */}
          <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Conference Planners Card */}
            <Card className="bg-white text-gray-800 shadow-2xl border-0 hover:shadow-3xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-8 w-8 text-teal-600" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-teal-800 mb-2">
                    Conference Planners: Boost CME Engagement
                  </h3>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Earn CME credits with patient-story session meeting ACCME standards</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Proven 30-minute post-film panel keeps audiences engaged</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Turnkey licensing, A/V specs, and marketing assets ready</span>
                  </div>
                </div>
                <ConsultationModal defaultRole="conference">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 text-lg font-semibold">
                    Schedule a Consult
                  </Button>
                </ConsultationModal>
              </CardContent>
            </Card>

            {/* Hospital Nurse Educators Card */}
            <Card className="bg-white text-gray-800 shadow-2xl border-0 hover:shadow-3xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="h-8 w-8 text-teal-600" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-teal-800 mb-2">
                    Hospital Nurse Educators: Trauma-Informed Care
                  </h3>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Module aligned to AACN & AWHONN competencies</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Includes reflection worksheets and competency checklists</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Flexible: grand-rounds, unit in-service, or micro-learning clips</span>
                  </div>
                </div>
                <ConsultationModal defaultRole="hospital">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 text-lg font-semibold">
                    Schedule a Consult
                  </Button>
                </ConsultationModal>
              </CardContent>
            </Card>

            {/* Medical School Professors Card */}
            <Card className="bg-white text-gray-800 shadow-2xl border-0 hover:shadow-3xl transition-shadow duration-300">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="bg-teal-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="h-8 w-8 text-teal-600" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-teal-800 mb-2">
                    Medical School Professors: Case-Based Learning
                  </h3>
                </div>
                <div className="space-y-4 mb-8">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Discussion guide mapped to AAMC Entrustable Professional Activities</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Supports OB-GYN, psychiatry, ethics, and health-systems courses</span>
                  </div>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-sm">Assessment bank (MCQs & prompts) in LMS-ready format</span>
                  </div>
                </div>
                <ConsultationModal defaultRole="education">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 text-lg font-semibold">
                    Schedule a Consult
                  </Button>
                </ConsultationModal>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Impact Metrics Bar */}
      <section className="py-12 bg-white border-b border-gray-200">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-12 text-center">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-teal-600" />
              <div>
                <div className="text-3xl font-bold text-teal-800">6,500+</div>
                <div className="text-sm text-gray-600">clinicians trained</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-teal-600" />
              <div>
                <div className="text-3xl font-bold text-teal-800">97%</div>
                <div className="text-sm text-gray-600">said session will change practice</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Carousel */}
      <section className="py-16 bg-cream-100">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-display font-bold text-center mb-12">What People Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Conference Testimonial */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Calendar className="h-6 w-6 text-teal-600 mr-2" />
                  <Badge variant="secondary" className="bg-teal-100 text-teal-800">Conference</Badge>
                </div>
                <blockquote className="text-lg italic text-gray-700 mb-4">
                  "Raw, powerful, and deeply moving. This film doesn't just tell a story—it invites you to feel every moment and leaves you thinking long after the credits roll."
                </blockquote>
                <footer className="text-sm font-medium text-gray-600">
                  — Denise Amundson, RN Labor and Delivery
                </footer>
              </CardContent>
            </Card>

            {/* Hospital Testimonial */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <Stethoscope className="h-6 w-6 text-teal-600 mr-2" />
                  <Badge variant="secondary" className="bg-teal-100 text-teal-800">Hospital</Badge>
                </div>
                <blockquote className="text-lg italic text-gray-700 mb-4">
                  "I'm a better nurse for having the opportunity to see their story. This film should be essential viewing for all healthcare professionals."
                </blockquote>
                <footer className="text-sm font-medium text-gray-600">
                  — Julie O'Hara, RN, Neonatology
                </footer>
              </CardContent>
            </Card>

            {/* Education Testimonial */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <GraduationCap className="h-6 w-6 text-teal-600 mr-2" />
                  <Badge variant="secondary" className="bg-teal-100 text-teal-800">Education</Badge>
                </div>
                <blockquote className="text-lg italic text-gray-700 mb-4">
                  "This film should be essential viewing for all healthcare professionals who are involved in obstetric care."
                </blockquote>
                <footer className="text-sm font-medium text-gray-600">
                  — Catherine Hermann, MD
                </footer>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-display font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-4">
              <div className="bg-teal-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">1</div>
              <h3 className="text-2xl font-semibold">View</h3>
              <p className="text-gray-600">Watch the 56-minute documentary with your audience</p>
            </div>
            <div className="space-y-4">
              <div className="bg-teal-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">2</div>
              <h3 className="text-2xl font-semibold">Discuss</h3>
              <p className="text-gray-600">Use our discussion guides and facilitation materials</p>
            </div>
            <div className="space-y-4">
              <div className="bg-teal-500 text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">3</div>
              <h3 className="text-2xl font-semibold">Implement</h3>
              <p className="text-gray-600">Apply trauma-informed care principles in your practice</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <section className="bg-teal-500 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-display font-bold mb-6">Ready to Transform Your Practice?</h2>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Schedule a consultation to discuss how 24 Days Without You can enhance your educational programs and improve patient care.
          </p>
          <ConsultationModal>
            <Button className="bg-white text-teal-700 px-12 py-4 hover:bg-cream-100 transition-colors duration-200 text-lg font-semibold">
              Schedule a Consult
            </Button>
          </ConsultationModal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
