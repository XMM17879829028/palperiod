"use client";

import { useLanguage } from '../context/LanguageContext';
import Navbar from '@/components/Navbar';
import { Waves } from '@/components/ui/waves-background';

export default function PrivacyPage() {
  const { language } = useLanguage();

  const translations = {
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last Updated: April 9, 2024',
      introduction: 'Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information.',
      sections: [
        {
          title: '1. Information We Collect',
          content: 'We collect information that you provide directly to us, such as menstrual cycle data, and information collected automatically through your use of our service.'
        },
        {
          title: '2. How We Use Your Information',
          content: 'We use your information to provide and improve our services, personalize your experience, and communicate with you about our services.'
        },
        {
          title: '3. Data Storage and Security',
          content: 'We implement appropriate security measures to protect your personal information. Your data is stored locally on your device and is not shared with third parties without your consent.'
        },
        {
          title: '4. Your Rights',
          content: 'You have the right to access, correct, or delete your personal information. You can also opt-out of certain data collection practices.'
        },
        {
          title: '5. Cookies and Tracking',
          content: 'We use cookies and similar tracking technologies to improve your experience and analyze how our service is used.'
        },
        {
          title: '6. Changes to Privacy Policy',
          content: 'We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last Updated" date.'
        }
      ]
    },
    zh: {
      title: '隐私政策',
      lastUpdated: '最后更新：2024年4月9日',
      introduction: '您的隐私对我们很重要。本隐私政策解释了我们是如何收集、使用和保护您的信息。',
      sections: [
        {
          title: '1. 我们收集的信息',
          content: '我们收集您直接提供给我们的信息，如月经周期数据，以及通过您使用我们的服务自动收集的信息。'
        },
        {
          title: '2. 我们如何使用您的信息',
          content: '我们使用您的信息来提供和改进我们的服务，个性化您的体验，并就我们的服务与您沟通。'
        },
        {
          title: '3. 数据存储和安全',
          content: '我们实施适当的安全措施来保护您的个人信息。您的数据存储在您的设备本地，未经您的同意不会与第三方共享。'
        },
        {
          title: '4. 您的权利',
          content: '您有权访问、更正或删除您的个人信息。您也可以选择退出某些数据收集做法。'
        },
        {
          title: '5. Cookie和跟踪',
          content: '我们使用Cookie和类似的跟踪技术来改善您的体验并分析我们的服务使用情况。'
        },
        {
          title: '6. 隐私政策的变更',
          content: '我们可能会不时更新本隐私政策。我们将通过更新"最后更新"日期来通知您任何变更。'
        }
      ]
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-pink-600">{t.title}</h1>
          <p className="text-gray-500 text-center mb-8">{t.lastUpdated}</p>
          
          <p className="mb-8 text-gray-700">{t.introduction}</p>
          
          {t.sections.map((section, index) => (
            <div key={index} className="mb-6">
              <h2 className="text-xl font-semibold text-pink-600 mb-2">{section.title}</h2>
              <p className="text-gray-700">{section.content}</p>
            </div>
          ))}
        </div>
      </div>
      <Waves />
    </div>
  );
} 