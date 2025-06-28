import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Event Sphere - Where Local Events Come Alive",
  description:
    "Discover local events, connect with your community, and join real-time conversations. Find amazing events happening around you with interactive maps and live chat rooms.",
  keywords: [
    "events",
    "local events",
    "community",
    "social networking",
    "event discovery",
    "real-time chat",
    "interactive maps",
    "meetups",
    "social platform",
  ],
  authors: [{ name: "Event Sphere Team" }],
  creator: "Event Sphere",
  publisher: "Event Sphere",
  metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),

  // Open Graph
  openGraph: {
    title: "Event Sphere - Where Local Events Come Alive",
    description:
      "Discover local events, connect with your community, and join real-time conversations. Find amazing events happening around you with interactive maps and live chat rooms.",
    url: "/",
    siteName: "Event Sphere",
    images: [
      {
        url: "/ogimage.png",
        width: 1200,
        height: 630,
        alt: "Event Sphere - Local Event Discovery Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  // Twitter Card
  twitter: {
    card: "summary_large_image",
    title: "Event Sphere - Where Local Events Come Alive",
    description:
      "Discover local events, connect with your community, and join real-time conversations.",
    images: ["/ogimage.png"],
    creator: "@eventsphere",
  },

  // Icons and Favicon
  icons: {
    icon: [
      { url: "/favicon.jpg", sizes: "any" },
      { url: "/favicon.jpg", type: "image/jpeg" },
    ],
    apple: [{ url: "/favicon.jpg", sizes: "180x180", type: "image/jpeg" }],
  },

  // Additional Meta
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Verification (add when available)
  verification: {
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },

  // App-specific
  applicationName: "Event Sphere",
  category: "Social Networking",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
  themeColor: "#7C3AED",
};
