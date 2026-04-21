import React, { createContext, useContext, useState, useEffect } from "react";

const i18nContext = createContext();

const translations = {
  en: {
    dashboard: "Dashboard",
    customers: "Customers",
    vehicles: "Vehicles",
    deals: "Deals",
    partners: "Partners",
    marketing: "Marketing",
    analytics: "Analytics",
    settings: "Settings",
    search: "Global Search",
    health: "System Health",
    documentation: "System Guide",
    welcome: "Welcome back, Sarem 👋",
    activeDeals: "Active Deals",
    totalRevenue: "Total Revenue",
    saveChanges: "Save Changes",
    systemHealth: "System Health & Metrics",
    language: "Language",
    logout: "Logout",
    search_anything: "Search anything (Ctrl+K)...",
  },
  am: {
    dashboard: "ዳሽቦርድ",
    customers: "ደንበኞች",
    vehicles: "ተሽከርካሪዎች",
    deals: "ስምምነቶች",
    partners: "አጋሮች",
    marketing: "ማርኬቲንግ",
    analytics: "አናሊቲክስ",
    settings: "ቅንብሮች",
    search: "ፍለጋ",
    health: "የስርዓት ጤና",
    documentation: "የስርዓት መመሪያ",
    welcome: "እንኳን ደህና መጡ፣ ሳሬም 👋",
    activeDeals: "ንቁ ስምምነቶች",
    totalRevenue: "ጠቅላላ ገቢ",
    saveChanges: "ለውጦችን አስቀምጥ",
    systemConfig: "የስርዓት ቅንብሮች",
    systemHealth: "የስርዓት ጤና እና መለኪያዎች",
    language: "ቋንቋ",
    logout: "ውጣ",
    search_anything: "ማንኛውንም ነገር ይፈልጉ (Ctrl+K)...",
  },
};

export function I18nProvider({ children }) {
  const [locale, setLocale] = useState(
    localStorage.getItem("merkatomotors_locale") || "en",
  );

  useEffect(() => {
    localStorage.setItem("merkatomotors_locale", locale);
    document.documentElement.lang = locale;
  }, [locale]);

  const t = (key) => translations[locale][key] || key;

  return (
    <i18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </i18nContext.Provider>
  );
}

export const useI18n = () => useContext(i18nContext);
