import React from "react";
import { Link } from "react-router-dom";
import { SiPlanetscale } from "react-icons/si";

const Section = ({ title, children }) => (
  <div className="mb-8">
    <h2 className="text-xl font-semibold text-gray-900 mb-3">{title}</h2>
    <div className="text-gray-600 leading-relaxed space-y-2">{children}</div>
  </div>
);

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-br from-sky-900 to-indigo-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <SiPlanetscale className="h-7 w-7 text-sky-400" />
            <span className="text-xl font-bold">FlightManager</span>
          </Link>
          <h1 className="text-4xl font-bold mb-3">Privacy Policy</h1>
          <p className="text-sky-200 text-sm">Last updated: March 14, 2026</p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm p-8 md:p-12">
          <p className="text-gray-600 mb-8 leading-relaxed">
            Welcome to FlightManager. This Privacy Policy explains how we
            collect, use, disclose, and safeguard your information when you use
            our flight management platform. Please read this policy carefully.
            If you disagree with its terms, please stop using the application.
          </p>

          <Section title="1. Information We Collect">
            <p>We may collect the following types of information:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li>
                <strong>Account Information:</strong> Name, email address, and
                password when you register.
              </li>
              <li>
                <strong>Usage Data:</strong> Pages visited, features used, and
                interactions within the platform.
              </li>
              <li>
                <strong>Device Information:</strong> Browser type, IP address,
                operating system, and device identifiers.
              </li>
              <li>
                <strong>Aviation Data:</strong> Flight plans, aircraft
                assignments, crew schedules, and airport information you enter.
              </li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li>Provide, operate, and maintain the FlightManager platform.</li>
              <li>
                Improve, personalize, and expand our features and services.
              </li>
              <li>
                Process transactions and send related information such as
                confirmations.
              </li>
              <li>
                Communicate with you about updates, security alerts, and support
                messages.
              </li>
              <li>
                Monitor usage patterns to detect and prevent fraudulent or
                abusive activity.
              </li>
              <li>
                Comply with legal obligations and enforce our terms and
                policies.
              </li>
            </ul>
          </Section>

          <Section title="3. Data Sharing and Disclosure">
            <p>
              We do not sell your personal data. We may share your information
              only in the following circumstances:
            </p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li>
                <strong>Service Providers:</strong> Third-party vendors who
                assist in operating the platform (e.g., hosting, analytics)
                under confidentiality agreements.
              </li>
              <li>
                <strong>Legal Requirements:</strong> When required by law or to
                protect the rights, property, or safety of FlightManager or
                others.
              </li>
              <li>
                <strong>Business Transfers:</strong> In connection with a
                merger, acquisition, or sale of assets, with prior notice to
                users.
              </li>
            </ul>
          </Section>

          <Section title="4. Data Security">
            <p>
              We implement industry-standard security measures including
              encryption in transit (TLS/HTTPS), hashed password storage, and
              access controls to protect your data. However, no method of
              transmission over the internet is 100% secure. We cannot
              guarantee absolute security but are committed to protecting your
              information.
            </p>
          </Section>

          <Section title="5. Cookies and Tracking">
            <p>
              FlightManager uses cookies and similar tracking technologies to
              maintain session state and improve user experience. You can
              control cookie behavior through your browser settings. Disabling
              cookies may affect some functionality of the platform.
            </p>
          </Section>

          <Section title="6. Data Retention">
            <p>
              We retain your personal data for as long as your account is active
              or as needed to provide services. You may request deletion of your
              account and associated data at any time by contacting us. Some
              data may be retained for legal or operational purposes after
              deletion.
            </p>
          </Section>

          <Section title="7. Your Rights">
            <p>Depending on your location, you may have the right to:</p>
            <ul className="list-disc list-inside space-y-1 mt-2 ml-2">
              <li>Access the personal data we hold about you.</li>
              <li>Request correction of inaccurate data.</li>
              <li>Request deletion of your personal data.</li>
              <li>Object to or restrict certain processing of your data.</li>
              <li>
                Data portability — receive your data in a machine-readable
                format.
              </li>
            </ul>
            <p className="mt-2">
              To exercise these rights, please contact us using the information
              below.
            </p>
          </Section>

          <Section title="8. Third-Party Links">
            <p>
              Our platform may contain links to third-party websites. We are not
              responsible for the privacy practices of those sites and encourage
              you to review their privacy policies before providing any personal
              information.
            </p>
          </Section>

          <Section title="9. Children's Privacy">
            <p>
              FlightManager is not intended for users under the age of 16. We do
              not knowingly collect personal information from children. If you
              believe a child has provided us with personal data, please contact
              us and we will take steps to delete such information.
            </p>
          </Section>

          <Section title="10. Changes to This Policy">
            <p>
              We may update this Privacy Policy from time to time. We will
              notify you of significant changes by posting the new policy on
              this page with an updated date. We encourage you to review this
              policy periodically.
            </p>
          </Section>

          <Section title="11. Contact Us">
            <p>
              If you have any questions or concerns about this Privacy Policy,
              please contact us at:
            </p>
            <div className="mt-3 p-4 bg-gray-50 rounded-lg text-sm">
              <p className="font-medium text-gray-800">FlightManager</p>
              <p>Email: privacy@flightmanager.app</p>
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

export default PrivacyPolicy;
