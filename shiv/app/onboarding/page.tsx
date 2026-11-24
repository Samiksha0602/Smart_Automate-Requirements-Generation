"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Check } from "lucide-react"
import WelcomeStep from "@/components/onboarding/welcome-step"
import ProfileStep from "@/components/onboarding/profile-step"
import TourStep from "@/components/onboarding/tour-step"
import ActionStep from "@/components/onboarding/action-step"
import { useOnboarding } from "@/components/onboarding-provider"

export default function OnboardingPage() {
  const router = useRouter()
  const { updateUser, completeOnboarding } = useOnboarding()
  const [currentStep, setCurrentStep] = useState(1)
  const [userData, setUserData] = useState({
    fullName: "",
    role: "",
    organization: "",
  })

  const handleProfileSubmit = (data: typeof userData) => {
    setUserData(data)
    // Update the user data in the context
    updateUser(data)
    setCurrentStep(3)
  }

  const handleSkipTour = () => {
    setCurrentStep(4)
  }

  const handleComplete = () => {
    // Mark onboarding as complete
    completeOnboarding()
    // Redirect to dashboard
    router.push("/")
  }

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Progress indicator */}
      <div className="mx-auto w-full max-w-3xl px-4 pt-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    step === currentStep
                      ? "border-[#002A5C] bg-[#002A5C] text-white"
                      : step < currentStep
                        ? "border-[#002A5C] bg-white text-[#002A5C]"
                        : "border-gray-300 bg-white text-gray-300"
                  }`}
                >
                  {step < currentStep ? <Check className="h-5 w-5" /> : step}
                </div>
                <span
                  className={`mt-2 text-xs font-medium ${step <= currentStep ? "text-[#002A5C]" : "text-gray-400"}`}
                >
                  {step === 1 ? "Welcome" : step === 2 ? "Profile" : step === 3 ? "Tour" : "Start"}
                </span>
              </div>
            ))}
          </div>
          <div className="relative mt-4">
            <div className="absolute top-0 h-1 w-full bg-gray-200"></div>
            <div
              className="absolute top-0 h-1 bg-[#002A5C] transition-all duration-300"
              style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Step content */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          {currentStep === 1 && <WelcomeStep onContinue={() => setCurrentStep(2)} />}
          {currentStep === 2 && <ProfileStep onSubmit={handleProfileSubmit} />}
          {currentStep === 3 && <TourStep onComplete={() => setCurrentStep(4)} onSkip={handleSkipTour} />}
          {currentStep === 4 && <ActionStep userData={userData} onComplete={handleComplete} />}
        </div>
      </div>
    </div>
  )
}
