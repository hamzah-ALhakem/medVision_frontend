// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// نصوص الترجمة
const resources = {
  en: {
    translation: {
      "dashboard": "Dashboard",
      "screening": "AI Screening",
      "labs": "Labs",
      "appointments": "Appointments",
      "messages": "Messages",
      "settings": "Settings",
      "logout": "Logout",
      "welcome": "Welcome",
      "search": "Search..."
    }
  },
  ar: {
    translation: {
      "dashboard": "الرئيسية",
      "screening": "الفحص الذكي",
      "labs": "المعامل",
      "appointments": "المواعيد",
      "messages": "الرسائل",
      "settings": "الإعدادات",
      "logout": "تسجيل خروج",
      "welcome": "مرحباً",
      "search": "بحث..."
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ar", // اللغة الافتراضية (العربية)
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;