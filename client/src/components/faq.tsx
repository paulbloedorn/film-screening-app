import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getFaqContent } from "@tina/queries";

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

export default function FAQ() {
  const [faqContent, setFaqContent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqContent = async () => {
      try {
        const data = await getFaqContent();
        setFaqContent(data);
      } catch (error) {
        console.error("Failed to load FAQ content:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqContent();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-300 rounded w-64 mx-auto mb-12"></div>
              <div className="max-w-3xl mx-auto space-y-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (!faqContent) {
    return (
      <section className="py-16 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center">
            <p className="text-red-600">Failed to load FAQ content. Please try again later.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-display font-bold text-center mb-12">
          {faqContent.headline || "Frequently Asked Questions"}
        </h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible>
            {faqContent.items?.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium">
                  {faq?.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-700 leading-relaxed">
                  {renderRichText(faq?.answer)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}