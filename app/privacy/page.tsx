"use client";

export default function PrivacyPage() {
  return (
    <main className="container mx-auto px-4 pt-24 pb-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-gray-600 mb-4">
              We collect information that you provide directly to us, including when you create an 
              account, create or interact with events, or communicate with other users.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">
              We use the information we collect to provide, maintain, and improve our services, 
              to communicate with you, and to personalize your experience.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Information Sharing</h2>
            <p className="text-gray-600 mb-4">
              We do not share your personal information with third parties except as described 
              in this privacy policy or with your consent.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Data Security</h2>
            <p className="text-gray-600 mb-4">
              We take reasonable measures to help protect your personal information from loss, 
              theft, misuse, unauthorized access, disclosure, alteration, and destruction.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
} 