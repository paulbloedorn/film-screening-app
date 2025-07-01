import { GraduationCap, Clock, Video } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ScreeningForm from "@/components/screening-form";
import { Card, CardContent } from "@/components/ui/card";

export default function Education() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-teal-500 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <GraduationCap className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-5xl font-display font-bold mb-6">Educational Screenings</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            24 Days Without You provides students an unflinching look at the human impact of their work. 
            It underscores the lifesaving nature of the clinical work they'll do and the importance of empathy 
            in their professional pursuits.
          </p>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="pt-8">
              <blockquote className="text-2xl font-display italic text-center text-gray-700 mb-6">
                "This film should be essential viewing for all healthcare professionals who are involved in obstetric care."
              </blockquote>
              <footer className="text-center text-gray-600 font-medium">
                — Catherine Hermann, MD
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
              <h2 className="text-3xl font-display font-bold">Essential for Healthcare Education</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                24 Days Without You provides students an unflinching look at the human impact of their work. 
                It underscores the lifesaving nature of the clinical work they'll do and the importance of 
                empathy in their professional pursuits.
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
                <h3 className="text-xl font-semibold text-teal-800 mb-4">SLU Trudy Busch School of Nursing</h3>
                <p className="text-gray-700 leading-relaxed">
                  24 Days Without You has been incorporated into coursework at Saint Louis University's 
                  Trudy Busch School of Nursing in 2025. In lieu of purchasing a textbook, students will be 
                  purchasing streaming passes to the film, and coursework for that week will include discussion 
                  and reflection on the key themes apparent in the film, such as birth trauma, paternal PTSD, 
                  maternal infant separation, marital impact, and more.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Form Section */}
          <div className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display font-bold mb-4">Inquire About Educational Screening</h2>
              <p className="text-xl text-gray-600">
                Include 24 Days Without You in your coursework!
              </p>
            </div>
            <ScreeningForm screeningType="education" title="Educational" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
