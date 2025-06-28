export function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Event Sphere",
    description:
      "Discover local events, connect with your community, and join real-time conversations. Find amazing events happening around you with interactive maps and live chat rooms.",
    url: process.env.NEXTAUTH_URL || "https://your-domain.com",
    applicationCategory: "SocialNetworkingApplication",
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    creator: {
      "@type": "Organization",
      name: "Event Sphere Team",
    },
    featureList: [
      "Interactive event maps",
      "Real-time chat rooms",
      "Local event discovery",
      "No sign-up required",
      "Mobile-first design",
      "Community networking",
    ],
    screenshot: "/ogimage.png",
    sameAs: ["https://github.com/abhi-yo/event-sphere"],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
