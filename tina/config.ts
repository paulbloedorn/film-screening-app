import { defineConfig } from "tinacms";

// Your hosting provider likely exposes this as an environment variable
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  "main";

export default defineConfig({
  branch,

  // Get this from tina.io cloud dashboard
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID,
  // Get this from tina.io cloud dashboard  
  token: process.env.TINA_TOKEN,

  build: {
    outputFolder: "admin",
    publicFolder: "client",
  },
  media: {
    tina: {
      mediaRoot: "assets",
      publicFolder: "client",
    },
  },
  
  // Authentication and editing configuration
  admin: {
    auth: {
      useLocalAuth: process.env.NODE_ENV === "development",
    },
  },
  
  // Content validation and error handling
  search: {
    tina: {
      indexerToken: process.env.TINA_SEARCH_TOKEN,
      stopwordLanguages: ["eng"],
    },
  },
  // See docs on content modeling for more info on how to setup new content models: https://tina.io/docs/schema/
  schema: {
    collections: [
      {
        name: "homepage",
        label: "Homepage",
        path: "content/pages",
        format: "json",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "object",
            name: "hero",
            label: "Hero Section",
            description: "Main hero section with headline, poster, and trailer button",
            fields: [
              {
                type: "string",
                name: "headline",
                label: "Headline",
                required: true,
                validate: (value) => {
                  if (!value || value.trim().length === 0) {
                    return "Headline is required";
                  }
                  if (value.length > 100) {
                    return "Headline must be 100 characters or less";
                  }
                  return null;
                },
              },
              {
                type: "rich-text",
                name: "subtitle",
                label: "Subtitle",
                required: true,
                validate: (value) => {
                  if (!value || !value.children || value.children.length === 0) {
                    return "Subtitle is required";
                  }
                  return null;
                },
              },
              {
                type: "image",
                name: "posterImage",
                label: "Poster Image",
                description: "Main movie poster image displayed in the hero section",
                required: true,
                validate: (value) => {
                  if (!value || value.trim().length === 0) {
                    return "Poster image is required";
                  }
                  return null;
                },
              },
              {
                type: "object",
                name: "trailerButton",
                label: "Trailer Button",
                fields: [
                  {
                    type: "string",
                    name: "text",
                    label: "Button Text",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "videoUrl",
                    label: "Trailer Video URL",
                    description: "YouTube, Vimeo, or direct video URL for the trailer",
                    validate: (value) => {
                      if (value && value.trim().length > 0) {
                        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
                        const youtubePattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
                        const vimeoPattern = /^(https?:\/\/)?(www\.)?vimeo\.com\/.+/;
                        
                        if (!urlPattern.test(value) && !youtubePattern.test(value) && !vimeoPattern.test(value)) {
                          return "Please enter a valid URL (YouTube, Vimeo, or direct video link)";
                        }
                      }
                      return null;
                    },
                  },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "screeningsCta",
            label: "Screenings CTA Section",
            fields: [
              {
                type: "string",
                name: "headline",
                label: "Headline",
                required: true,
              },
              {
                type: "rich-text",
                name: "description",
                label: "Description",
                required: true,
              },
              {
                type: "string",
                name: "buttonText",
                label: "Button Text",
                required: true,
              },
            ],
          },
          {
            type: "object",
            name: "testimonials",
            label: "Testimonials Section",
            description: "Customer testimonials organized by audience category",
            fields: [
              {
                type: "string",
                name: "headline",
                label: "Section Headline",
                required: true,
              },
              {
                type: "object",
                name: "items",
                label: "Testimonials",
                list: true,
                fields: [
                  {
                    type: "string",
                    name: "category",
                    label: "Category",
                    description: "The audience category this testimonial represents",
                    options: ["Conference", "Hospital", "Education"],
                    required: true,
                  },
                  {
                    type: "string",
                    name: "icon",
                    label: "Icon",
                    options: ["Calendar", "Stethoscope", "GraduationCap"],
                    required: true,
                  },
                  {
                    type: "rich-text",
                    name: "quote",
                    label: "Quote",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "author",
                    label: "Author",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "title",
                    label: "Author Title",
                    required: true,
                  },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "audienceCards",
            label: "Audience Cards Section",
            description: "Three main audience cards with features and call-to-action buttons",
            fields: [
              {
                type: "string",
                name: "headline",
                label: "Section Headline",
                required: true,
              },
              {
                type: "rich-text",
                name: "subtitle",
                label: "Section Subtitle",
                required: true,
              },
              {
                type: "object",
                name: "cards",
                label: "Audience Cards",
                list: true,
                fields: [
                  {
                    type: "string",
                    name: "title",
                    label: "Card Title",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "icon",
                    label: "Icon",
                    options: ["Calendar", "Stethoscope", "GraduationCap"],
                    required: true,
                  },
                  {
                    type: "object",
                    name: "features",
                    label: "Features",
                    list: true,
                    fields: [
                      {
                        type: "string",
                        name: "text",
                        label: "Feature Text",
                        required: true,
                      },
                    ],
                  },
                  {
                    type: "string",
                    name: "buttonText",
                    label: "Button Text",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "defaultRole",
                    label: "Default Role",
                    options: ["conference", "hospital", "education"],
                    required: true,
                  },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "impactMetrics",
            label: "Impact Metrics",
            fields: [
              {
                type: "object",
                name: "metrics",
                label: "Metrics",
                list: true,
                fields: [
                  {
                    type: "string",
                    name: "value",
                    label: "Metric Value",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "label",
                    label: "Metric Label",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "icon",
                    label: "Icon",
                    options: ["Users", "Star"],
                    required: true,
                  },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "howItWorks",
            label: "How It Works Section",
            fields: [
              {
                type: "string",
                name: "headline",
                label: "Section Headline",
                required: true,
              },
              {
                type: "object",
                name: "steps",
                label: "Steps",
                list: true,
                fields: [
                  {
                    type: "number",
                    name: "number",
                    label: "Step Number",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "title",
                    label: "Step Title",
                    required: true,
                  },
                  {
                    type: "string",
                    name: "description",
                    label: "Step Description",
                    required: true,
                  },
                ],
              },
            ],
          },
          {
            type: "object",
            name: "finalCta",
            label: "Final CTA Section",
            fields: [
              {
                type: "string",
                name: "headline",
                label: "Headline",
                required: true,
              },
              {
                type: "rich-text",
                name: "description",
                label: "Description",
                required: true,
              },
              {
                type: "string",
                name: "buttonText",
                label: "Button Text",
                required: true,
              },
            ],
          },
        ],
      },
      {
        name: "faq",
        label: "FAQ",
        path: "content/faq",
        format: "json",
        description: "Frequently Asked Questions section with expandable Q&A items",
        ui: {
          allowedActions: {
            create: false,
            delete: false,
          },
        },
        fields: [
          {
            type: "string",
            name: "headline",
            label: "Section Headline",
            required: true,
          },
          {
            type: "object",
            name: "items",
            label: "FAQ Items",
            list: true,
            fields: [
              {
                type: "string",
                name: "question",
                label: "Question",
                required: true,
              },
              {
                type: "rich-text",
                name: "answer",
                label: "Answer",
                required: true,
              },
            ],
          },
        ],
      },
    ],
  },
});