import { Hospital, Clock, Video } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ScreeningForm from "@/components/screening-form";
import { Card, CardContent } from "@/components/ui/card";

export default function HospitalClinic() {
  return (
    <div className="min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="bg-teal-500 text-white py-16">
        <div className="container mx-auto px-6 text-center">
          <Hospital className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-5xl font-display font-bold mb-6">Hospital & Clinic Screenings</h1>
          <p className="text-xl opacity-90 max-w-3xl mx-auto">
            24 Days Without You encourages discussion and reflection among medical professionals 
            in recurring staff meetings or special events.
          </p>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <Card className="max-w-4xl mx-auto">
            <CardContent className="pt-8">
              <blockquote className="text-2xl font-display italic text-center text-gray-700 mb-6">
                "I'm a better nurse for having the opportunity to see their story."
              </blockquote>
              <footer className="text-center text-gray-600 font-medium">
                — Julie O'Hara, RN, Neonatology
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
              <h2 className="text-3xl font-display font-bold">For Medical Professionals</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                24 Days Without You encourages discussion and reflection among medical professionals 
                in recurring staff meetings or special events.
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
                <h3 className="text-xl font-semibold text-teal-800 mb-4">Angela's Event Highlight</h3>
                <p className="text-gray-700 leading-relaxed">
                  24 Days Without You was shown to all L&D staff in one of the hospital campus classrooms 
                  one evening in June. The event was sponsored by an OBGYN group working at the hospital 
                  and featured snacks, drinks, and discussion after the film screening.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Form Section */}
          <div className="py-16">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display font-bold mb-4">Inquire About a Hospital Screening</h2>
              <p className="text-xl text-gray-600">
                Host a screening at your clinic or hospital!
              </p>
            </div>
            <ScreeningForm screeningType="hospital" title="Hospital/Clinic" />
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
