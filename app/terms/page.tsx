"use client";

export default function TermsPage() {
  return (
    <main className="container mx-auto px-4 pt-24 pb-16">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        
        <div className="prose prose-lg max-w-none">
          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-600 mb-4">
              By accessing and using Event Sphere, you accept and agree to be bound by the terms and 
              provision of this agreement.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Use License</h2>
            <p className="text-gray-600 mb-4">
              Permission is granted to temporarily access and use Event Sphere for personal, 
              non-commercial purposes. This is the grant of a license, not a transfer of title.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. User Conduct</h2>
            <p className="text-gray-600 mb-4">
              Users agree to use Event Sphere in a manner consistent with any and all applicable 
              laws and regulations.
            </p>
          </section>

          <section className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Privacy</h2>
            <p className="text-gray-600 mb-4">
              Your use of Event Sphere is also governed by our Privacy Policy. Please review our 
              Privacy Policy, which also governs the Platform and informs users of our data 
              collection practices.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
} 