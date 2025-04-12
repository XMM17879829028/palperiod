import { useLanguage } from '../context/LanguageContext';
import Navbar from '@/components/Navbar';
import { Waves } from '@/components/ui/waves-background';

export default function TermsPage() {
  const { language } = useLanguage();

  const translations = {
    en: {
      title: 'Terms of Service',
      lastUpdated: 'Last Updated: April 9, 2024',
      introduction: 'Welcome to PalPeriod. By using our service, you agree to these terms.',
      sections: [
        {
          title: '1. Acceptance of Terms',
          content: 'By accessing and using PalPeriod, you accept and agree to be bound by these Terms of Service.'
        },
        {
          title: '2. Description of Service',
          content: 'PalPeriod provides menstrual cycle tracking and related health information. The service is for informational purposes only and should not be used as medical advice.'
        },
        {
          title: '3. User Responsibilities',
          content: 'You are responsible for maintaining the confidentiality of your account and for all activities that occur under your account.'
        },
        {
          title: '4. Privacy',
          content: 'Your use of PalPeriod is also governed by our Privacy Policy. Please review our Privacy Policy to understand our practices.'
        },
        {
          title: '5. Limitation of Liability',
          content: 'PalPeriod is not liable for any damages arising from your use of the service. The service is provided "as is" without any warranties.'
        },
        {
          title: '6. Changes to Terms',
          content: 'We reserve the right to modify these terms at any time. We will notify users of any changes by updating the "Last Updated" date.'
        }
      ]
    },
    zh: {
      title: '使用条款',
      lastUpdated: '最后更新：2024年4月9日',
      introduction: '欢迎使用 PalPeriod。使用我们的服务即表示您同意这些条款。',
      sections: [
        {
          title: '1. 条款接受',
          content: '通过访问和使用 PalPeriod，您接受并同意受这些使用条款的约束。'
        },
        {
          title: '2. 服务说明',
          content: 'PalPeriod 提供月经周期跟踪和相关健康信息。该服务仅用于提供信息，不应作为医疗建议使用。'
        },
        {
          title: '3. 用户责任',
          content: '您有责任维护账户的保密性，并对账户下的所有活动负责。'
        },
        {
          title: '4. 隐私',
          content: '您使用 PalPeriod 还受我们的隐私政策约束。请查看我们的隐私政策以了解我们的做法。'
        },
        {
          title: '5. 责任限制',
          content: 'PalPeriod 不对因使用服务而造成的任何损害负责。服务按"现状"提供，不提供任何保证。'
        },
        {
          title: '6. 条款变更',
          content: '我们保留随时修改这些条款的权利。我们将通过更新"最后更新"日期来通知用户任何变更。'
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