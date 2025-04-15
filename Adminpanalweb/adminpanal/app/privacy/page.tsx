"use client"

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col bg-minty">
      <Header />
      <main className="flex-1 py-12">
        <div className="container-custom">
          <Link href="/" className="inline-flex items-center text-primary hover:underline mb-8 gap-1">
            <ArrowLeft size={16} />
            Back to Home
          </Link>

          <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-soft p-8">
            <h1 className="text-3xl font-serif font-medium mb-6">Privacy Policy</h1>
            <p className="text-gray-500 mb-8">Effective Date: April 15, 2025</p>

            <div className="prose prose-green max-w-none">
              <p>
                Thank you for choosing <strong>Emotions</strong>, a mental wellness app designed to help you understand and improve your emotional well-being through emotion-based activities. This Privacy Policy explains how we collect, use, and protect your data when you use the Emotions app ("App").
              </p>
              <p>
                We value your privacy and are committed to maintaining the confidentiality and security of your personal information. By using the Emotions app, you agree to the practices described in this Privacy Policy.
              </p>

              <h2>1. Information We Collect</h2>
              <h3>a. Personal Information</h3>
              <p>● Profile Picture: With your permission, we access your device’s camera or gallery to let you upload a profile picture. This image is stored securely and is not shared with any third party.</p>

              <h3>b. Emotion Questionnaire Responses</h3>
              <p>● We collect your responses to a set of questions that help identify the emotion(s) you may be struggling with. These responses are securely transmitted and processed through an AI model (powered by OpenAI API) to determine your emotional state and recommend suitable activities.</p>

              <h3>c. Device Information (Non-Personal)</h3>
              <p>● We may collect non-identifiable device-related data like device type, operating system version, and crash logs to help improve the app's performance and stability. This data does not identify you personally.</p>

              <h2>2. How We Use Your Information</h2>
              <ul>
                <li>To analyze your emotional responses using AI and provide personalized activities tailored to your emotional needs.</li>
                <li>To enable profile customization, such as setting a profile picture.</li>
                <li>To improve app performance, user experience, and customer support.</li>
                <li>To maintain and monitor app security and functionality.</li>
              </ul>

              <h2>3. AI and Third-Party Services</h2>
              <p><strong>OpenAI API</strong></p>
              <ul>
                <li>Your questionnaire responses are securely sent to the OpenAI API for natural language processing. This helps us understand which emotion is most disturbed and suggest suitable activities.</li>
                <li>The data sent is anonymized and never includes any personally identifiable information.</li>
                <li>OpenAI does not store your data permanently and uses it solely for generating a response in real-time, as per their <a href="https://openai.com/policies/api-data-usage" target="_blank">API data usage policy</a>.</li>
              </ul>

              <h2>4. Data Sharing and Storage</h2>
              <ul>
                <li>We do not sell, rent, or share any of your personal data with third-party advertisers or marketing platforms.</li>
                <li>Your data is stored securely on our backend services, protected with encryption and access controls.</li>
                <li>All data is processed in compliance with data privacy laws, including the GDPR and Google Play User Data Policy.</li>
              </ul>

              <h2>5. Permissions Required</h2>
              <ul>
                <li><strong>Camera Access:</strong> Required for uploading a profile picture. This access is optional and used only when you choose to add or update your profile image.</li>
                <li><strong>Internet Access:</strong> Required to send questionnaire responses securely to OpenAI API and to fetch emotional activity recommendations.</li>
              </ul>

              <h2>6. User Rights</h2>
              <ul>
                <li>Access the data we have collected about you.</li>
                <li>Delete your profile and any associated data at any time.</li>
                <li>Withdraw consent for camera or questionnaire usage through your device settings.</li>
                <li>Contact us with any questions or requests related to your data.</li>
              </ul>
              <p>To request data access or deletion, please contact us at: 📧 <a href="mailto:support@emotionsapp.co">support@emotionsapp.co</a></p>

              <h2>7. Data Retention</h2>
              <p>● We retain your data only as long as necessary to provide you with services.</p>
              <p>● If you delete your profile or uninstall the app, your personal data will be deleted permanently from our systems within 30 days.</p>

              <h2>8. Children's Privacy</h2>
              <p>The Emotions app is intended for users aged 13 and above. We do not knowingly collect data from children under 13. If you believe a child has submitted personal information, please contact us so we can delete it promptly.</p>

              <h2>9. Updates to This Policy</h2>
              <p>We may update this Privacy Policy from time to time. Changes will be posted within the app and updated here with a new effective date. Continued use of the app after such updates signifies your acceptance of the revised policy.</p>

              <h2>10. Contact Us</h2>
              <p>If you have any questions or concerns about this Privacy Policy, please reach out to us:</p>
              <p>
                📧 <a href="mailto:support@emotionsapp.co">support@emotionsapp.co</a><br />
                🌐 <a href="http://www.emotionsapp.co" target="_blank">www.emotionsapp.co</a>
              </p>
              <p>Your mental wellness is important to us. Thank you for trusting Emotions.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Privacy;
