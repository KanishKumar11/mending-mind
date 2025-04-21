"use client";

import { createContext, useContext, useState } from "react";

const translations = {
  en: {
    hello: "HELLO,",
    name: "Name",
    age: "Age",
    emailId: "Email Id",
    contactNo: "Contact No",
    location: "Location",
    gender: "Gender",
    marialStatus: "Marial Status",
    profession: "Profession",
    dateOfAssessment: "Date of Assessment",
    selectGender: "Select Gender",
    selectMarialStatus: "Select Marial Status",
    genderOptions: ["Male", "Female", "Prefer not to say"],
    marialStatusOptions: ["Single", "Married", "Divorced", "Other"],
    next: "Next",
    back: "Back",
    submit: "Submit",
    step: "Step",
    of: "of",
    personalInfo: "Personal Information",
    contactInfo: "Contact Information",
    additionalInfo: "Additional Information",
  },
  hi: {
    hello: "नमस्ते,",
    name: "नाम",
    age: "आयु",
    emailId: "ईमेल आईडी",
    contactNo: "संपर्क नंबर",
    location: "जगह",
    gender: "लिंग",
    marialStatus: "वैवाहिक स्थिति",
    profession: "पेशा",
    dateOfAssessment: "मूल्यांकन की तिथि",
    selectGender: "लिंग चुनें",
    selectMarialStatus: "वैवाहिक स्थिति चुनें",
    genderOptions: ["पुरुष", "महिला", "बताना नहीं चाहते"],
    marialStatusOptions: ["अविवाहित", "विवाहित", "तलाकशुदा", "अन्य"],
    next: "आगे",
    back: "पीछे",
    submit: "जमा करें",
    step: "चरण",
    of: "का",
    personalInfo: "व्यक्तिगत जानकारी",
    contactInfo: "संपर्क जानकारी",
    additionalInfo: "अतिरिक्त जानकारी",
  },
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Set English as the default language (no selector needed)
  const [language] = useState("en");
  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // For static rendering, return a default context instead of throwing an error
    if (typeof window === "undefined") {
      return { language: "en", t: translations["en"] };
    }
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
