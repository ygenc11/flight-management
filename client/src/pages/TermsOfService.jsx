import React from "react";
import { Link } from "react-router-dom";
import { SiPlanetscale } from "react-icons/si";

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-gray-900 mb-3">{title}</h2>
    <div className="text-gray-600 leading-relaxed space-y-2">{children}</div>
  </div>
);

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-sky-900 to-indigo-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <SiPlanetscale className="h-7 w-7 text-sky-400" />
            <span className="text-xl font-bold">FlightManager</span>
          </Link>
          <h1 className="text-4xl font-bold mb-3">Terms of Service</h1>
          <p className="text-sky-200 text-sm">Last updated: March 14, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <p className="text-gray-600 mb-8 leading-relaxed">
            Please read these Terms of Service ("Terms") carefully before using
            FlightManager. By accessing or using the platform, you agree to be
            bound by these Terms. If you do not agree, you may not use the
            service.
          </p>

          <Section title="1. Acceptance of Terms">
            <p>
              By creating an account or using any part of the FlightManager
              platform, you confirm that you are at least 16 years old, have the
              legal capacity to enter into this agreement, and accept these
              Terms in full.
            </p>
          </Section>

          <Section title="2. Description of Service">
            <p>
              FlightManager is a flight operations management platform that
              provides tools for scheduling flights, managing aircraft and crew,
              tracking routes on interactive maps, and analyzing operational
              performance. Features may change, be added, or be removed over
              time at our discretion.
            </p>
          </Section>

          <Section title="3. User Accounts">
            <p>
              To access certain features, you must register for an account. You
              agree to:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li>
                Provide accurate, complete, and up-to-date registration
                information.
              </li>
              <li>
                Maintain the security of your password and not share access
                credentials.
              </li>
              <li>
                Notify us immediately of any unauthorized use of your account.
              </li>
              <li>
                Be responsible for all activity that occurs under your account.
              </li>
            </ul>
            <p className="mt-2">
              We reserve the right to suspend or terminate accounts that violate
              these Terms.
            </p>
          </Section>

          <Section title="4. Acceptable Use">
            <p>
              You agree to use FlightManager only for lawful purposes and in a
              manner that does not infringe the rights of others. You must not:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li>
                Upload or transmit any malicious code, viruses, or disruptive
                content.
              </li>
              <li>
                Attempt to gain unauthorized access to any part of the platform
                or other users' data.
              </li>
              <li>
                Use the platform to store or process real-time operational
                aviation data for safety-critical applications without
                appropriate certification.
              </li>
              <li>
                Reverse engineer, scrape, or copy the platform in an
                unauthorized manner.
              </li>
              <li>
                Impersonate any person or entity or misrepresent your
                affiliation.
              </li>
            </ul>
          </Section>

          <Section title="5. Intellectual Property">
            <p>
              All content, design, code, trademarks, and materials on
              FlightManager are owned by or licensed to us and are protected by
              applicable intellectual property laws. You are granted a limited,
              non-exclusive, non-transferable license to access and use the
              platform for its intended purpose. You may not copy, modify,
              distribute, or create derivative works without prior written
              consent.
            </p>
            <p className="mt-2">
              Data you enter into FlightManager (e.g., your flight plans and
              crew data) remains your property. By using the platform, you grant
              us a limited license to store and process this data solely to
              provide the service.
            </p>
          </Section>

          <Section title="6. Third-Party Integrations">
            <p>
              FlightManager may integrate with or link to third-party services
              such as mapping providers. We are not responsible for the content,
              availability, or practices of these services. Your use of
              third-party services is governed by their respective terms and
              privacy policies.
            </p>
          </Section>

          <Section title="7. Disclaimers">
            <p>
              FlightManager is provided "as is" and "as available" without
              warranties of any kind, express or implied. We do not warrant that
              the platform will be uninterrupted, error-free, or free of harmful
              components.
            </p>
            <p className="mt-2 font-medium text-gray-700">
              FlightManager is a demonstration and planning tool and is NOT
              certified for use in real-world flight operations or
              safety-critical aviation decision-making.
            </p>
          </Section>

          <Section title="8. Limitation of Liability">
            <p>
              To the fullest extent permitted by law, FlightManager and its
              developers shall not be liable for any indirect, incidental,
              special, consequential, or punitive damages arising from your use
              of or inability to use the platform, even if advised of the
              possibility of such damages. Our total liability for any claim
              shall not exceed the amount you have paid us in the 12 months
              preceding the claim, or $100, whichever is greater.
            </p>
          </Section>

          <Section title="9. Termination">
            <p>
              We may suspend or terminate your access to FlightManager at any
              time, with or without cause, and with or without notice. You may
              terminate your account at any time by contacting us. Upon
              termination, your right to use the service will immediately cease.
            </p>
          </Section>

          <Section title="10. Changes to Terms">
            <p>
              We reserve the right to modify these Terms at any time. We will
              provide notice of significant changes by updating the "Last
              updated" date at the top of this page and, where appropriate, by
              notifying you via email. Your continued use of the platform
              following changes constitutes acceptance of the updated Terms.
            </p>
          </Section>

          <Section title="11. Governing Law">
            <p>
              These Terms shall be governed by and construed in accordance with
              applicable law. Any disputes arising from these Terms or your use
              of FlightManager shall be subject to the exclusive jurisdiction of
              the competent courts.
            </p>
          </Section>

          <Section title="12. Contact Us">
            <p>
              If you have any questions about these Terms of Service, please
              contact us at:
            </p>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm">
              <p className="font-medium text-gray-800">FlightManager</p>
              <p>Email: legal@flightmanager.app</p>
            </div>
          </Section>
        </div>

        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-medium transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
