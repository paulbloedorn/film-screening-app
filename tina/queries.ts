// Temporary fallback queries until TinaCMS is fully configured
export const getHomepageContent = async () => {
  try {
    // Try to load from content files directly
    const response = await fetch('/content/pages/homepage.json');
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    
    // Fallback to default content
    return {
      hero: {
        headline: "We all take childbirth for granted...",
        subtitle: {
          children: [{
            type: "p",
            children: [{ text: "Until something goes wrong. This powerful documentary explores the critical importance of maternal health and the dedicated professionals who make safe childbirth possible." }]
          }]
        },
        posterImage: "/assets/poster_24_days_1752421477308.png",
        trailerButton: {
          text: "Watch Trailer",
          videoUrl: ""
        }
      },
      screeningsCta: {
        headline: "Screenings and Speaking Engagements",
        description: {
          children: [{
            type: "p",
            children: [{ text: "Bring this important story to your organization, conference, or community. Available for educational screenings with discussion sessions." }]
          }]
        },
        buttonText: "Schedule a Consult"
      },
      testimonials: {
        headline: "What People Are Saying",
        items: [
          {
            category: "Conference",
            icon: "Calendar",
            quote: { children: [{ type: "p", children: [{ text: "A powerful and eye-opening documentary that every healthcare professional should see." }] }] },
            author: "Dr. Sarah Johnson",
            title: "Conference Organizer"
          },
          {
            category: "Hospital",
            icon: "Stethoscope", 
            quote: { children: [{ type: "p", children: [{ text: "This film sparked important conversations about maternal health in our organization." }] }] },
            author: "Michael Chen",
            title: "Hospital Administrator"
          },
          {
            category: "Education",
            icon: "GraduationCap",
            quote: { children: [{ type: "p", children: [{ text: "An essential educational tool for medical students and nursing programs." }] }] },
            author: "Prof. Lisa Martinez",
            title: "Medical School Dean"
          }
        ]
      },
      audienceCards: {
        headline: "Award-winning maternal-health documentary with turnkey education packages",
        subtitle: {
          children: [{
            type: "p",
            children: [{ text: "Tailored presentations and discussion materials for different audiences and settings." }]
          }]
        },
        cards: [
          {
            title: "Conferences",
            icon: "Calendar",
            features: [
              { text: "Keynote presentation format" },
              { text: "Interactive Q&A sessions" },
              { text: "Professional development credits" },
              { text: "Networking opportunities" }
            ],
            buttonText: "Schedule a Consult",
            defaultRole: "conference"
          },
          {
            title: "Hospitals",
            icon: "Stethoscope",
            features: [
              { text: "Staff training sessions" },
              { text: "Quality improvement discussions" },
              { text: "Patient safety focus" },
              { text: "Continuing education credits" }
            ],
            buttonText: "Schedule a Consult", 
            defaultRole: "hospital"
          },
          {
            title: "Education",
            icon: "GraduationCap",
            features: [
              { text: "Curriculum integration" },
              { text: "Student discussion guides" },
              { text: "Faculty resources" },
              { text: "Assessment materials" }
            ],
            buttonText: "Schedule a Consult",
            defaultRole: "education"
          }
        ]
      },
      impactMetrics: {
        metrics: [
          { value: "10,000+", label: "Healthcare Professionals Reached", icon: "Users" },
          { value: "4.9/5", label: "Average Rating", icon: "Star" }
        ]
      },
      howItWorks: {
        headline: "How It Works",
        steps: [
          { number: 1, title: "Schedule Consultation", description: "Discuss your needs and audience" },
          { number: 2, title: "Customize Presentation", description: "Tailor content for your specific setting" },
          { number: 3, title: "Deliver Impact", description: "Engage your audience with powerful storytelling" }
        ]
      },
      finalCta: {
        headline: "Ready to Transform Your Practice?",
        description: {
          children: [{
            type: "p",
            children: [{ text: "Join thousands of healthcare professionals who have experienced the power of this documentary." }]
          }]
        },
        buttonText: "Schedule a Consult"
      }
    };
  } catch (error) {
    console.error("Error fetching homepage content:", error);
    return null;
  }
};

export const getFaqContent = async () => {
  try {
    // Try to load from content files directly
    const response = await fetch('/content/faq/faq.json');
    if (response.ok) {
      const data = await response.json();
      return data;
    }
    
    // Fallback to default content
    return {
      headline: "Frequently Asked Questions",
      items: [
        {
          question: "What is the runtime of the documentary?",
          answer: {
            children: [{
              type: "p",
              children: [{ text: "The documentary has a runtime of approximately 90 minutes, with additional discussion time recommended." }]
            }]
          }
        },
        {
          question: "Is this suitable for medical students?",
          answer: {
            children: [{
              type: "p", 
              children: [{ text: "Yes, the documentary is designed to be educational and appropriate for medical students, nursing students, and healthcare professionals at all levels." }]
            }]
          }
        },
        {
          question: "What discussion materials are included?",
          answer: {
            children: [{
              type: "p",
              children: [{ text: "Each screening package includes discussion guides, reflection questions, and additional resources tailored to your audience." }]
            }]
          }
        },
        {
          question: "How do I schedule a screening?",
          answer: {
            children: [{
              type: "p",
              children: [{ text: "Use the consultation form to get in touch. We'll discuss your needs and provide a customized proposal for your organization." }]
            }]
          }
        }
      ]
    };
  } catch (error) {
    console.error("Error fetching FAQ content:", error);
    return null;
  }
};