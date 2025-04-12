import { useLanguage } from '../context/LanguageContext';
import Navbar from '@/components/Navbar';
import { Waves } from '@/components/ui/waves-background';

export default function ContactPage() {
  const { language } = useLanguage();

  const translations = {
    en: {
      title: 'Contact Us',
      subtitle: 'We\'d love to hear from you',
      description: 'Have questions, suggestions, or feedback? Feel free to reach out to us.',
      email: 'Email',
      emailAddress: '852003204@qq.com'
    },
    zh: {
      title: '联系我们',
      subtitle: '我们期待您的反馈',
      description: '有任何问题、建议或反馈？欢迎随时联系我们。',
      email: '邮箱',
      emailAddress: '852003204@qq.com'
    }
  };

  const t = translations[language];

  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Navbar />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center mb-6 text-pink-600">{t.title}</h1>
          <h2 className="text-xl text-center mb-4 text-gray-700">{t.subtitle}</h2>
          <p className="text-center mb-8 text-gray-600">{t.description}</p>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-pink-600 mb-2">{t.email}</h3>
            <a href={`mailto:${t.emailAddress}`} className="text-gray-700 hover:text-pink-600">
              {t.emailAddress}
            </a>
          </div>
        </div>
      </div>
      <Waves />
    </div>
  );
} 