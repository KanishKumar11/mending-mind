import Image from "next/image";
import Link from "next/link";

export default function Step2() {
  return (
    <div className="flex flex-col items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="w-full max-w-4xl flex flex-col items-center gap-8">
        {/* Logo */}
        <div className="w-full flex justify-center mt-4">
          <Image
            src="/Mind_Logo.png"
            alt="Mending Mind Logo"
            width={200}
            height={80}
            priority
            className="object-contain"
          />
        </div>

        {/* Form Container */}
        <div className="w-full bg-white rounded-lg shadow-lg p-8 max-w-2xl">
          <h2 className="text-2xl font-bold mb-6 text-center">
            Mental Health Assessment
          </h2>

          <form className="space-y-6">
            <div className="space-y-6">
              <div>
                <p className="block text-sm font-medium text-gray-700 mb-3">
                  How would you rate your stress level on a scale of 1-10?
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Low</span>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <label key={num} className="cursor-pointer">
                        <input
                          type="radio"
                          name="stressLevel"
                          value={num}
                          className="sr-only"
                        />
                        <div className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full hover:bg-gray-100 peer-checked:bg-blue-500 peer-checked:text-white">
                          {num}
                        </div>
                      </label>
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">High</span>
                </div>
              </div>

              <div>
                <p className="block text-sm font-medium text-gray-700 mb-3">
                  Have you experienced any of the following in the past two
                  weeks? (Select all that apply)
                </p>
                <div className="space-y-2">
                  {[
                    "Difficulty sleeping",
                    "Loss of interest in activities",
                    "Feeling down or depressed",
                    "Trouble concentrating",
                    "Changes in appetite",
                    "Excessive worry",
                  ].map((symptom, index) => (
                    <div key={index} className="flex items-start">
                      <input
                        type="checkbox"
                        id={`symptom-${index}`}
                        name="symptoms"
                        value={symptom}
                        className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                      <label
                        htmlFor={`symptom-${index}`}
                        className="ml-2 block text-sm text-gray-700"
                      >
                        {symptom}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label
                  htmlFor="mentalHealthHistory"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Have you ever been diagnosed with a mental health condition?
                </label>
                <select
                  id="mentalHealthHistory"
                  name="mentalHealthHistory"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Please select</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Link href="/form/step1">
                <div className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors">
                  Back
                </div>
              </Link>
              <Link href="/form/step3">
                <div className="flex items-center justify-between bg-black text-white rounded-full px-6 py-2 font-medium hover:bg-gray-800 transition-colors">
                  <span>Next</span>
                  <span className="ml-2">&gt;</span>
                </div>
              </Link>
            </div>
          </form>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2 mt-4">
          <div className="w-8 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-8 h-2 bg-black rounded-full"></div>
          <div className="w-8 h-2 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
