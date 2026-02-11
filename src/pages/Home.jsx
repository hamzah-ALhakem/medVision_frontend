import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Stethoscope, BrainCircuit, FlaskConical, Calendar, 
  ArrowLeft, ArrowRight, ShieldCheck, UserPlus, Globe 
} from 'lucide-react';
import Button from '../components/ui/Button';
import logo from '../assets/logo.png'; // تأكد أن الشعار موجود

// 1. قاموس الترجمة (Texts Dictionary)
const translations = {
  ar: {
    nav: { services: 'خدماتنا', ai: 'الذكاء الاصطناعي', doctors: 'الأطباء', login: 'دخول', signup: 'حساب جديد', dashboard: 'لوحة التحكم' },
    hero: {
      badge: '🚀 الجيل الجديد من الرعاية الطبية',
      title1: 'رعايتك الصحية،',
      title2: 'بذكاء المستقبل.',
      desc: 'منصة طبية متكاملة تجمع بين نخبة الأطباء وأحدث تقنيات الذكاء الاصطناعي للكشف المبكر عن الأورام بدقة عالية.',
      btnPrimary: 'جرب الفحص الذكي',
      btnSecondary: 'سجل كطبيب / مريض',
      security: 'بيانات آمنة 100%',
      results: 'نتائج فورية',
      accuracyLabel: 'دقة النموذج',
      accuracyVal: '98.5%'
    },
    services: {
      title: 'خدمات طبية شاملة',
      subtitle: 'نوفر لك تجربة طبية متكاملة تبدأ من التشخيص الذكي وحتى العلاج والمتابعة.',
      cards: [
        { title: 'حجز مواعيد الأطباء', desc: 'اختر احد الأطباء في مختلف التخصصات واحجز موعدك بضغطة زر.' },
        { title: 'فحص الأورام بالذكاء الاصطناعي', desc: 'تقنية متطورة لتحليل البيانات الخلوية والكشف عن احتمالية وجود أورام بدقة عالية.' },
        { title: 'حجز المعامل الطبية', desc: 'تصفح المعامل القريبة منك، قارن الأسعار، واحجز موعد التحليل دون انتظار.' }
      ],
      btnMore: 'اكتشف المزيد'
    },
    ai: {
      badge: 'AI Screening Technology',
      title: 'كشف مبكر، حياة أفضل.',
      desc: 'يستخدم نموذجنا خوارزميات التعلم العميق (Deep Learning) لتحليل البيانات الطبية بدقة تتجاوز الطرق التقليدية، مما يساعد في اتخاذ قرارات طبية أسرع وأدق.',
      btn: 'ابدأ الفحص الآن',
      resultLabel: 'نتيجة التحليل',
      confidence: 'الثقة'
    },
    footer: {
      desc: 'منصة طبية رائدة تهدف لتحسين جودة الرعاية الصحية باستخدام أحدث تقنيات الذكاء الاصطناعي.',
      linksTitle: 'روابط سريعة',
      links: ['الرئيسية', 'عن المشروع', 'الفريق'],
      contactTitle: 'تواصل معنا',
      rights: '© 2024 مشروع MedVision. جميع الحقوق محفوظة.'
    }
  },
  en: {
    nav: { services: 'Services', ai: 'AI Feature', doctors: 'Doctors', login: 'Login', signup: 'Sign Up', dashboard: 'Dashboard' },
    hero: {
      badge: '🚀 Next Gen Healthcare',
      title1: 'Your Healthcare,',
      title2: 'Powered by AI.',
      desc: 'An integrated medical platform combining elite doctors with state-of-the-art AI technology for early tumor detection with high accuracy.',
      btnPrimary: 'Try AI Screening',
      btnSecondary: 'Register Now',
      security: '100% Secure Data',
      results: 'Instant Results',
      accuracyLabel: 'Model Accuracy',
      accuracyVal: '98.5%'
    },
    services: {
      title: 'Comprehensive Medical Services',
      subtitle: 'We provide an integrated medical experience starting from smart diagnosis to treatment and follow-up.',
      cards: [
        { title: 'Book Doctor Appointments', desc: 'Choose from hundreds of doctors in various specialties and book your appointment with a click.' },
        { title: 'AI Tumor Screening', desc: 'Advanced technology to analyze cellular data and detect potential tumors with high precision.' },
        { title: 'Book Medical Labs', desc: 'Browse nearby labs, compare prices, and book your analysis appointment without waiting.' }
      ],
      btnMore: 'Discover More'
    },
    ai: {
      badge: 'AI Screening Technology',
      title: 'Early Detection, Better Life.',
      desc: 'Our model uses Deep Learning algorithms to analyze medical data with accuracy exceeding traditional methods, helping make faster and more accurate medical decisions.',
      btn: 'Start Screening Now',
      resultLabel: 'Analysis Result',
      confidence: 'Confidence'
    },
    footer: {
      desc: 'A leading medical platform aiming to improve healthcare quality using the latest AI technologies.',
      linksTitle: 'Quick Links',
      links: ['Home', 'About Us', 'Team'],
      contactTitle: 'Contact Us',
      rights: '© 2024 MedVision Project. All rights reserved.'
    }
  }
};

export default function HomePage() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const isLoggedIn = !!user;

  // 2. حالة اللغة (الافتراضي من التخزين أو العربية)
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'ar');
  const t = translations[lang]; // المتغير t يحمل النصوص الحالية

  // 3. دالة تبديل اللغة
  const toggleLanguage = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    setLang(newLang);
    localStorage.setItem('lang', newLang);
  };

  const handleNavigation = (path) => {
    if (isLoggedIn) navigate(path);
    else navigate('/login');
  };

  // أيقونة السهم تتغير حسب اللغة
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    // 4. ضبط الاتجاه والخط بناءً على اللغة
    <div className={`min-h-screen bg-white text-dark ${lang === 'en' ? 'font-sans' : 'font-sans'}`} dir={lang === 'ar' ? 'rtl' : 'ltr'}>
      
      {/* --- Navbar --- */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2">
             <img src={logo} alt="MedVision Logo" className="w-10 h-10 object-contain" />
            <span className="text-2xl font-bold text-primary tracking-tight">MedVision</span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8 font-medium text-gray-600">
            <a href="#services" className="hover:text-primary transition-colors">{t.nav.services}</a>
            <a href="#ai-feature" className="hover:text-primary transition-colors">{t.nav.ai}</a>
          </div>

          {/* Buttons & Lang Switch */}
          <div className="flex items-center gap-3">
            {/* 🟢 زر تغيير اللغة */}
            <button 
                onClick={toggleLanguage} 
                className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            >
                <Globe size={18} />
                <span className="text-sm font-bold">{lang === 'ar' ? 'En' : 'عربي'}</span>
            </button>

            {isLoggedIn ? (
              <Button 
                onClick={() => navigate(user.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard')} 
                className="px-6 py-2 text-sm h-auto"
              >
                {t.nav.dashboard}
              </Button>
            ) : (
              <>
                <button onClick={() => navigate('/login')} className="font-bold text-gray-500 hover:text-primary transition-colors text-sm">
                  {t.nav.login}
                </button>
                <Button onClick={() => navigate('/signup')} className="px-5 py-2 text-sm h-auto rounded-full">
                  {t.nav.signup}
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* --- Hero Section --- */}
      <header className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          
          <div className={`space-y-6 z-10 animate-in fade-in duration-700 ${lang === 'ar' ? 'slide-in-from-right-8' : 'slide-in-from-left-8'}`}>
            <span className="bg-blue-50 text-primary px-4 py-1.5 rounded-full text-xs font-bold border border-blue-100">
              {t.hero.badge}
            </span>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight text-dark">
              {t.hero.title1} <br/>
              <span className="text-primary">{t.hero.title2}</span>
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed max-w-lg">
              {t.hero.desc}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <Button onClick={() => handleNavigation('/screening')} className="w-auto px-8 py-4 text-base shadow-xl shadow-primary/20">
                <BrainCircuit className={lang === 'ar' ? "ml-2" : "mr-2"} /> {t.hero.btnPrimary}
              </Button>
              <button onClick={() => navigate('/signup')} className="px-8 py-4 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:border-primary hover:text-primary hover:bg-blue-50 transition-all flex items-center gap-2">
                <UserPlus size={20} /> {t.hero.btnSecondary}
              </button>
            </div>

            <div className="flex items-center gap-6 pt-4 text-sm font-medium text-gray-400">
              <div className="flex items-center gap-2"><ShieldCheck size={18} className="text-green-500"/> {t.hero.security}</div>
              <div className="flex items-center gap-2"><FlaskConical size={18} className="text-purple-500"/> {t.hero.results}</div>
            </div>
          </div>

          {/* Hero Image */}
          {/* <div className="relative z-10 animate-in zoom-in duration-1000">
             <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-transparent rounded-full blur-3xl opacity-30"></div>
             <img 
               src="https://img.freepik.com/free-photo/doctor-working-technology_23-2148154174.jpg" 
               alt="Medical AI" 
               className="relative rounded-[2.5rem] shadow-2xl border-4 border-white rotate-2 hover:rotate-0 transition-transform duration-500 object-cover h-[500px] w-full"
             />
             
          </div> */}
        </div>
      </header>

      {/* --- Services Section --- */}
      <section id="services" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-dark mb-4">{t.services.title}</h2>
            <p className="text-gray-500 max-w-xl mx-auto">{t.services.subtitle}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <ServiceCard 
              icon={Calendar} 
              title={t.services.cards[0].title} 
              desc={t.services.cards[0].desc}
              btnText={t.services.btnMore}
              lang={lang}
              color="text-blue-600 bg-blue-50"
              onClick={() => handleNavigation('/patient-dashboard')}
            />
            <ServiceCard 
              icon={BrainCircuit} 
              title={t.services.cards[1].title} 
              desc={t.services.cards[1].desc}
              btnText={t.services.btnMore}
              lang={lang}
              color="text-purple-600 bg-purple-50"
              isFeatured={true}
              onClick={() => handleNavigation('/screening')}
            />
            <ServiceCard 
              icon={FlaskConical} 
              title={t.services.cards[2].title} 
              desc={t.services.cards[2].desc}
              btnText={t.services.btnMore}
              lang={lang}
              color="text-green-600 bg-green-50"
              onClick={() => handleNavigation('/labs')}
            />
          </div>
        </div>
      </section>

      {/* --- AI Feature --- */}
      <section id="ai-feature" className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-primary rounded-[3rem] p-10 md:p-16 text-white relative overflow-hidden shadow-2xl shadow-blue-200">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-400/30 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3"></div>

            <div className="relative z-10 grid md:grid-cols-2 gap-12 items-center">
              <div>
                <span className="bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 inline-block border border-white/20">
                  {t.ai.badge}
                </span>
                <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight whitespace-pre-line">
                  {t.ai.title}
                </h2>
                <p className="text-blue-100 text-lg leading-relaxed mb-8">
                  {t.ai.desc}
                </p>
                <Button onClick={() => handleNavigation('/screening')} className="bg-white text-primary hover:bg-blue-50 border-0 px-8 py-4 text-base font-bold shadow-lg">
                  {t.ai.btn} <ArrowIcon className={lang === 'ar' ? "mr-2" : "ml-2"} />
                </Button>
              </div>
              
              <div className="relative h-64 md:h-full bg-white/10 rounded-2xl border border-white/20 backdrop-blur-sm p-6 flex items-center justify-center">
                 <div className="bg-white rounded-xl p-4 shadow-xl w-full max-w-xs text-dark animate-pulse">
                    <div className="flex items-center gap-3 mb-4 border-b border-gray-100 pb-2">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600"><ShieldCheck size={16}/></div>
                        <div className="font-bold text-sm">{t.ai.resultLabel}</div>
                    </div>
                    <div className="space-y-2">
                        <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                        <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                    </div>
                    <div className="mt-4 pt-2 border-t border-gray-50 flex justify-between items-center">
                        <span className="text-xs text-gray-400">{t.ai.confidence}</span>
                        <span className="text-sm font-bold text-green-600">96.4%</span>
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
                <div className="flex items-center gap-2 mb-4">
                    <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                        <Stethoscope size={18} />
                    </div>
                    <span className="text-xl font-bold text-primary">MedVision</span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                  {t.footer.desc}
                </p>
            </div>
            
            <div>
                <h4 className="font-bold text-dark mb-4">{t.footer.linksTitle}</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                    <li><a href="#" className="hover:text-primary">{t.footer.links[0]}</a></li>
                    <li><a href="#" className="hover:text-primary">{t.footer.links[1]}</a></li>
                    <li><a href="#" className="hover:text-primary">{t.footer.links[2]}</a></li>
                </ul>
            </div>

            <div>
                <h4 className="font-bold text-dark mb-4">{t.footer.contactTitle}</h4>
                <ul className="space-y-2 text-sm text-gray-500">
                    <li>info@medvision.com</li>
                    <li>+20 123 456 7890</li>
                    <li>Cairo, Egypt</li>
                </ul>
            </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-6 border-t border-gray-50 text-center text-xs text-gray-400">
            {t.footer.rights}
        </div>
      </footer>

    </div>
  );
}

// --- Sub Component ---
const ServiceCard = ({ icon: Icon, title, desc, color, isFeatured, onClick, btnText, lang }) => {
    const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;
    return (
        <div 
          onClick={onClick}
          className={`p-8 rounded-[2rem] border transition-all duration-300 cursor-pointer group relative overflow-hidden
          ${isFeatured 
            ? 'bg-white border-purple-100 shadow-xl shadow-purple-100 hover:-translate-y-2' 
            : 'bg-white border-gray-100 shadow-sm hover:shadow-lg hover:-translate-y-1'}`}
        >
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-2xl transition-transform group-hover:scale-110 ${color}`}>
            <Icon size={28} />
          </div>
          <h3 className="text-xl font-bold text-dark mb-3">{title}</h3>
          <p className="text-gray-500 text-sm leading-relaxed mb-4">{desc}</p>
          
          <div className="flex items-center text-primary font-bold text-sm group-hover:gap-2 transition-all">
             {btnText} <ArrowIcon size={16} className={lang === 'ar' ? "mr-1" : "ml-1"} />
          </div>
    
          {isFeatured && (
            <div className={`absolute top-0 bg-purple-100 text-purple-700 text-[10px] font-bold px-3 py-1 ${lang === 'ar' ? 'left-0 rounded-br-xl' : 'right-0 rounded-bl-xl'}`}>
               {lang === 'ar' ? 'الأكثر استخداماً' : 'Most Popular'}
            </div>
          )}
        </div>
    );
};