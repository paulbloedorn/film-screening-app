import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export default function FAQ() {
  const faqs = [
    {
      question: "What licensing options are available?",
      answer: "We offer flexible licensing options including single-use screenings, multi-event packages, and institutional licenses. All options include streaming access via Vimeo and basic educational materials."
    },
    {
      question: "What are the pricing tiers?",
      answer: "Pricing varies based on audience size, event type, and licensing duration. Conference screenings start at $500, hospital/clinic screenings at $300, and educational institutional licenses at $200. Contact us for a customized quote."
    },
    {
      question: "What technical requirements do I need?",
      answer: "You'll need a stable internet connection for Vimeo streaming, a projector or large screen, and basic audio equipment. We provide detailed A/V specifications and tech setup guides with every booking."
    },
    {
      question: "How long is the film and discussion time?",
      answer: "The documentary is 56 minutes long. We recommend allowing 90 minutes total for screening plus discussion. We provide facilitation guides and suggested discussion questions."
    },
    {
      question: "Do you provide continuing education credits?",
      answer: "Yes, we can help coordinate CME, CNE, and other continuing education credits. Our educational packages include competency assessments and accreditation support materials."
    },
    {
      question: "Can I customize the content for my specific audience?",
      answer: "Absolutely! We provide customizable discussion guides, reflection worksheets, and presentation materials that can be adapted for different healthcare settings and specialties."
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-display font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}