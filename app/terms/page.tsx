'use client'

import Navbar from '@/components/Navbar'

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 sm:p-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms of Service</h1>
          <p className="text-gray-500 mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Agreement to Terms</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              By accessing or using MVP Marketplace, you agree to be bound by these Terms of Service and all
              applicable laws and regulations. If you do not agree with any of these terms, you are prohibited
              from using this platform.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Use License</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              Subject to your compliance with these Terms, we grant you a limited, non-exclusive,
              non-transferable license to access and use MVP Marketplace for your personal or commercial purposes.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">User Accounts</h2>
            <p className="text-gray-600 leading-relaxed mb-4">When you create an account with us, you agree to:</p>
            <ul className="space-y-2 text-gray-600 mb-6 list-disc pl-6">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain the security of your account credentials</li>
              <li>Promptly update any information to keep it accurate</li>
              <li>Accept responsibility for all activities under your account</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Content Guidelines</h2>
            <p className="text-gray-600 leading-relaxed mb-4">You agree not to upload or share content that:</p>
            <ul className="space-y-2 text-gray-600 mb-6 list-disc pl-6">
              <li>Infringes on intellectual property rights of others</li>
              <li>Contains malicious code or harmful components</li>
              <li>Violates any applicable laws or regulations</li>
              <li>Is offensive, abusive, or inappropriate</li>
              <li>Contains personal information of others without consent</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Intellectual Property</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              You retain ownership of the content you upload to MVP Marketplace. By uploading content, you grant
              us a worldwide, non-exclusive license to use, display, and distribute your content on our platform.
              Other users may view and use your templates according to the terms you specify.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Prohibited Activities</h2>
            <p className="text-gray-600 leading-relaxed mb-4">You may not:</p>
            <ul className="space-y-2 text-gray-600 mb-6 list-disc pl-6">
              <li>Use the platform for any illegal purpose</li>
              <li>Attempt to gain unauthorized access to any part of the platform</li>
              <li>Interfere with or disrupt the platform's functionality</li>
              <li>Harvest or collect information about other users</li>
              <li>Impersonate another person or entity</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Disclaimer</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              MVP Marketplace is provided "as is" without any warranties, express or implied. We do not guarantee
              that the platform will be uninterrupted, secure, or error-free. Templates are provided by the
              community and we do not guarantee their quality, functionality, or suitability for any purpose.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Limitation of Liability</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              To the maximum extent permitted by law, MVP Marketplace shall not be liable for any indirect,
              incidental, special, consequential, or punitive damages resulting from your use of the platform.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Changes to Terms</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              We reserve the right to modify these terms at any time. We will notify users of any material
              changes by posting the new Terms of Service on this page with an updated "Last updated" date.
            </p>

            <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Contact</h2>
            <p className="text-gray-600 leading-relaxed mb-6">
              If you have any questions about these Terms, please contact us through our support channels.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
