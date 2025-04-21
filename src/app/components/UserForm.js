import { useState, useRef, useEffect, useMemo } from "react";
import { useLanguage } from "../contexts/LanguageContext";
import { useQuestionnaire } from "../contexts/QuestionnaireContext";
import Image from "next/image";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { motion } from "framer-motion";
import LottieAnimation from "./LottieAnimation";
import BackgroundAnimation from "./BackgroundAnimation";
import ImagePreloader from "./ImagePreloader";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function UserForm({ onComplete }) {
  const { t, language } = useLanguage();
  const { questions } = useQuestionnaire();
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const formRef = useRef(null);
  const submitButtonRef = useRef(null);

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    emailId: "",
    contactNo: "",
  });

  // Animation states for creative elements
  const [animationComplete, setAnimationComplete] = useState(false);

  // Preload the first two question images
  const imagesToPreload = useMemo(() => {
    const preloadImages = [];

    // Find the first two actual questions (not section headers)
    let count = 0;
    let index = 0;

    while (count < 2 && index < questions.length) {
      const question = questions[index];
      if (question.type !== "section_start") {
        const questionContent = question[language];
        if (questionContent?.image) {
          preloadImages.push(questionContent.image);
          count++;
        }
      } else if (question.type === "section_start") {
        // Also preload section images
        if (question[language]?.image) {
          preloadImages.push(question[language].image);
        }
      }
      index++;
    }

    return preloadImages;
  }, [questions, language]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    let formErrors = {};
    let isValid = true;

    // Validate only the required fields
    if (!formData.name.trim()) {
      formErrors.name = true;
      isValid = false;
    }
    if (!formData.age) {
      formErrors.age = true;
      isValid = false;
    }
    if (!formData.gender) {
      formErrors.gender = true;
      isValid = false;
    }
    if (!formData.emailId || !/^\S+@\S+\.\S+$/.test(formData.emailId)) {
      formErrors.emailId = true;
      isValid = false;
    }
    if (!formData.contactNo) {
      formErrors.contactNo = true;
      isValid = false;
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      console.log("Form submitted:", formData);
      onComplete(formData);
    } else {
      // Announce form errors to screen readers
      const errorCount = Object.keys(errors).length;
      const errorMessage =
        language === "en"
          ? `${errorCount} form fields have errors. Please correct them.`
          : `${errorCount} फॉर्म फ़ील्ड में त्रुटियां हैं। कृपया उन्हें ठीक करें।`;

      // Focus the first field with an error
      const firstErrorField = Object.keys(errors)[0];
      const errorElement = document.querySelector(
        `[name="${firstErrorField}"]`
      );
      if (errorElement) {
        errorElement.focus();
      }

      // Add an aria-live region announcement
      const liveRegion = document.getElementById("form-error-announcer");
      if (liveRegion) {
        liveRegion.textContent = errorMessage;
      }
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (
      e.key === "Enter" &&
      e.target.tagName !== "BUTTON" &&
      e.target.type !== "submit"
    ) {
      e.preventDefault();
      if (validateForm()) {
        submitButtonRef.current?.click();
      }
    }
  };

  // Add useEffect for animations
  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="min-h-screen py-8 px-4 pb-60 relative max-w-md mx-auto overflow-hidden"
      role="main"
      aria-labelledby="form-title"
    >
      {/* Image Preloader - invisible component that preloads the first two question images */}
      <ImagePreloader imagesToPreload={imagesToPreload} />
      {/* Animated background elements */}
      <motion.div
        className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[#B4E0E0]/30 z-10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 1, delay: 0.2 }}
      />
      <motion.div
        className="absolute -top-4 -left-20 w-40 h-40 rounded-full bg-[#B4E0E0]/30 z-10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.6 }}
        transition={{ duration: 1, delay: 0.2 }}
      />
      <motion.div
        className="absolute top-40 -left-10 w-20 h-20 rounded-full bg-[#F58D6F]/20 z-10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.5 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      />
      <motion.div
        className="absolute bottom-60 right-10 w-32 h-32 rounded-full bg-[#9A8BC5]/20 z-10"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        transition={{ duration: 1.2, delay: 0.8 }}
      />

      <div className="max-w-lg mx-auto z-10 relative">
        <motion.div
          className="flex justify-between items-end bg-background mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1
            id="form-title"
            className="text-3xl font-bold bg-gradient-to-r from-[#D15B3B] to-[#F0C93B] text-transparent bg-clip-text"
          >
            {t.hello}
          </h1>
          <motion.div>
            <LottieAnimation width={100} height={100} />
          </motion.div>
        </motion.div>

        <motion.form
          ref={formRef}
          onSubmit={handleSubmit}
          className="space-y-3 static bg-white/40 backdrop-blur-3xl p-6 rounded-xl shadow-lg border border-[#B4E0E0]/50"
          noValidate
          aria-describedby="form-error-announcer"
          onKeyDown={handleKeyDown}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Accessibility: Screen reader announcements */}
          <div
            id="form-error-announcer"
            className="sr-only"
            aria-live="assertive"
            role="status"
          ></div>

          <motion.p
            className="text-[#1E1E1E]/70 text-sm italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Please share a few details to begin your assessment journey
          </motion.p>
          {/* Name */}
          <div>
            <label htmlFor="name" className="block mb-1">
              {t.name}
            </label>
            <div className="relative">
              <motion.input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                whileFocus={{ scale: 1.02 }}
                className={`w-full p-3 border-2 ${
                  errors.name
                    ? "border-[#D15B3B]"
                    : focusedField === "name"
                    ? "border-[#F0C93B] ring-2 ring-[#F0C93B]/20"
                    : "border-[#B4E0E0]/50"
                } rounded-lg bg-white/80 backdrop-blur-sm`}
                aria-required="true"
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby={errors.name ? "name-error" : undefined}
                onFocus={() => setFocusedField("name")}
                onBlur={() => setFocusedField(null)}
                placeholder="Your full name"
              />
              {errors.name && (
                <p
                  id="name-error"
                  className="text-[#D15B3B] text-xs mt-1"
                  role="alert"
                >
                  {language === "en" ? "Name is required" : "नाम आवश्यक है"}
                </p>
              )}
            </div>
          </div>

          {/* Age */}
          <div>
            <label htmlFor="age" className="block mb-1">
              {t.age}
            </label>
            <input
              id="age"
              type="number"
              name="age"
              value={formData.age}
              onChange={handleInputChange}
              className={`w-full p-3 border-2 ${
                errors.age
                  ? "border-[#D15B3B]"
                  : focusedField === "age"
                  ? "border-[#F0C93B] ring-2 ring-[#F0C93B]/20"
                  : "border-[#B4E0E0]/50"
              } rounded-lg bg-white/80 backdrop-blur-sm`}
              aria-required="true"
              aria-invalid={errors.age ? "true" : "false"}
              aria-describedby={errors.age ? "age-error" : undefined}
              min="1"
              max="120"
              onFocus={() => setFocusedField("age")}
              onBlur={() => setFocusedField(null)}
              placeholder="Your age"
            />
            {errors.age && (
              <p
                id="age-error"
                className="text-[#D15B3B] text-xs mt-1"
                role="alert"
              >
                {language === "en" ? "Age is required" : "आयु आवश्यक है"}
              </p>
            )}
          </div>

          {/* Email ID */}
          <div>
            <label htmlFor="emailId" className="block mb-1">
              {t.emailId}
            </label>
            <div className="relative">
              <input
                id="emailId"
                type="email"
                name="emailId"
                value={formData.emailId}
                onChange={handleInputChange}
                className={`w-full p-3 border-2 ${
                  errors.emailId
                    ? "border-[#D15B3B]"
                    : focusedField === "emailId"
                    ? "border-[#F0C93B] ring-2 ring-[#F0C93B]/20"
                    : "border-[#B4E0E0]/50"
                } rounded-lg bg-white/80 backdrop-blur-sm`}
                aria-required="true"
                aria-invalid={errors.emailId ? "true" : "false"}
                aria-describedby={errors.emailId ? "email-error" : undefined}
                autoComplete="email"
                onFocus={() => setFocusedField("emailId")}
                onBlur={() => setFocusedField(null)}
                placeholder="your.email@example.com"
              />
              {errors.emailId && (
                <p
                  id="email-error"
                  className="text-[#D15B3B] text-xs mt-1"
                  role="alert"
                >
                  {language === "en"
                    ? "Valid email is required"
                    : "वैध ईमेल आवश्यक है"}
                </p>
              )}
            </div>
          </div>

          {/* Contact No */}
          <div>
            <label htmlFor="contactNo" className="block mb-1">
              {t.contactNo}
            </label>
            <input
              id="contactNo"
              type="tel"
              name="contactNo"
              value={formData.contactNo}
              onChange={handleInputChange}
              className={`w-full p-3 border-2 ${
                errors.contactNo
                  ? "border-[#D15B3B]"
                  : focusedField === "contactNo"
                  ? "border-[#F0C93B] ring-2 ring-[#F0C93B]/20"
                  : "border-[#B4E0E0]/50"
              } rounded-lg bg-white/80 backdrop-blur-sm`}
              aria-required="true"
              aria-invalid={errors.contactNo ? "true" : "false"}
              aria-describedby={errors.contactNo ? "contact-error" : undefined}
              autoComplete="tel"
              onFocus={() => setFocusedField("contactNo")}
              onBlur={() => setFocusedField(null)}
              placeholder="Your phone number"
            />
            {errors.contactNo && (
              <p
                id="contact-error"
                className="text-[#D15B3B] text-xs mt-1"
                role="alert"
              >
                {language === "en"
                  ? "Contact number is required"
                  : "संपर्क नंबर आवश्यक है"}
              </p>
            )}
          </div>

          {/* Location field removed */}

          {/* Gender */}
          <div>
            <label id="gender-label" className="block mb-1">
              {t.gender}
            </label>
            <Select
              name="gender"
              value={formData.gender}
              onValueChange={(value) =>
                handleInputChange({ target: { name: "gender", value } })
              }
              onOpenChange={() => setFocusedField("gender")}
            >
              <SelectTrigger
                className={`${
                  errors.gender
                    ? "border-[#D15B3B]"
                    : focusedField === "gender"
                    ? "border-[#F0C93B] ring-2 ring-[#F0C93B]/20"
                    : "border-[#B4E0E0]/50"
                } border-2 rounded-lg bg-white/80 backdrop-blur-sm`}
                aria-labelledby="gender-label"
                aria-required="true"
                aria-invalid={errors.gender ? "true" : "false"}
                aria-describedby={errors.gender ? "gender-error" : undefined}
              >
                <SelectValue placeholder={t.selectGender} />
              </SelectTrigger>
              <SelectContent>
                {t.genderOptions.map((option, index) => (
                  <SelectItem key={index} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.gender && (
              <p
                id="gender-error"
                className="text-[#D15B3B] text-xs mt-1"
                role="alert"
              >
                {language === "en" ? "Gender is required" : "लिंग आवश्यक है"}
              </p>
            )}
          </div>

          <motion.button
            ref={submitButtonRef}
            type="submit"
            className="absolute -bottom-20 right-8 z-20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label={language === "en" ? "Submit form" : "फॉर्म जमा करें"}
          >
            <div className="bg-[#F0C93B] hover:bg-[#D15B3B] rounded-full w-14 h-14 flex items-center justify-center group cursor-pointer shadow-lg transition-all duration-300">
              <span
                className="text-[#1E1E1E] group-hover:text-white text-[32px] group-hover:translate-x-1 transition-all duration-300"
                aria-hidden="true"
              >
                &gt;
              </span>
            </div>
          </motion.button>
        </motion.form>
      </div>
      {/* Background Animation */}
      <div className="absolute bottom-0 z-0 w-full left-0 bg-background">
        <BackgroundAnimation />
      </div>
    </div>
  );
}
