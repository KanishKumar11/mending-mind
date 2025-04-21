import Image from "next/image";
import Link from "next/link";

export default function Step1() {
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
            Personal Information
          </h2>

          <form className="space-y-6">
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email address"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="age"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Age
                </label>
                <input
                  type="number"
                  id="age"
                  name="age"
                  min="18"
                  max="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your age"
                  required
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Link href="/">
                <div className="px-6 py-2 border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors">
                  Back
                </div>
              </Link>
              <Link href="/form/step2">
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
          <div className="w-8 h-2 bg-black rounded-full"></div>
          <div className="w-8 h-2 bg-gray-300 rounded-full"></div>
          <div className="w-8 h-2 bg-gray-300 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
