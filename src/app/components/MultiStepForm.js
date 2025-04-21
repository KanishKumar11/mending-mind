"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "../contexts/LanguageContext";

export default function MultiStepForm() {
  const { t } = useLanguage();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    emailId: "",
    contactNo: "",
    location: "",
    gender: "",
    marialStatus: "",
    profession: "",
    dateOfAssessment: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.name}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
                    required
                  />
                  <Image
                    src="/file.svg"
                    alt="File"
                    width={20}
                    height={20}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  />
                </div>
              </div>

              {/* Age */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.age}
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.emailId}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="emailId"
                    value={formData.emailId}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
                    required
                  />
                  <Image
                    src="/file.svg"
                    alt="File"
                    width={20}
                    height={20}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {/* Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.contactNo}
                </label>
                <input
                  type="tel"
                  name="contactNo"
                  value={formData.contactNo}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
                  required
                />
              </div>

              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.location}
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
                  required
                />
              </div>

              {/* Gender */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.gender}
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
                  required
                >
                  <option value="">{t.selectGender}</option>
                  {t.genderOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              {/* Marital Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.marialStatus}
                </label>
                <select
                  name="marialStatus"
                  value={formData.marialStatus}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
                  required
                >
                  <option value="">{t.selectMarialStatus}</option>
                  {t.marialStatusOptions.map((option, index) => (
                    <option key={index} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>

              {/* Profession */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.profession}
                </label>
                <input
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800]"
                  required
                />
              </div>

              {/* Date of Assessment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t.dateOfAssessment}
                </label>
                <input
                  type="date"
                  name="dateOfAssessment"
                  value={formData.dateOfAssessment}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FFB800] bg-gray-50"
                  required
                />
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full max-w-4xl flex flex-col items-center gap-8">
        {/* Logo and Bulb Icon */}
        <div className="w-full flex justify-between items-start">
          <Image
            src="/Mind_Logo.png"
            alt="Mending Mind Logo"
            width={200}
            height={80}
            priority
            className="object-contain"
          />
          <Image
            src="/bulb.png"
            alt="Bulb Icon"
            width={40}
            height={40}
            className="object-contain"
          />
        </div>

        {/* Form Container */}
        <div className="w-full bg-white rounded-2xl shadow-lg p-8 max-w-2xl">
          <h2 className="text-4xl font-bold mb-8">{t.hello}</h2>

          <form className="space-y-8">
            {renderStep()}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-3 text-black border-2 border-black rounded-full hover:bg-gray-100 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                type="button"
                onClick={step < 3 ? nextStep : undefined}
                className="ml-auto px-8 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors"
              >
                {step < 3 ? "Next" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
