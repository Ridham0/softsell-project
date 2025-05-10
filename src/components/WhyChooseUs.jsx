"use client"

import { useEffect, useState, useRef } from "react"

const WhyChooseUs = () => {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.unobserve(entry.target)
        }
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  const reasons = [
    {
      title: "Best Market Value",
      description:
        "Our proprietary valuation algorithm ensures you get the highest possible price for your software licenses, typically 15-30% higher than competitors.",
    },
    {
      title: "Secure Transactions",
      description:
        "Bank-level encryption and secure transfer protocols protect your sensitive license information and financial details throughout the process.",
    },
    {
      title: "Fast Payment",
      description:
        "Get paid within 24-48 hours of accepting our offer, with multiple payment options including direct deposit, PayPal, and cryptocurrency.",
    },
    {
      title: "Expert Support",
      description:
        "Our team of software licensing experts is available 24/7 to guide you through the process and answer any questions you may have.",
    },
  ]

  return (
    <section id="why-choose-us" ref={sectionRef} className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-blue-600 to-teal-400 bg-clip-text text-transparent">SoftSell</span>
          </h2>
          <p className="max-w-2xl mx-auto text-lg text-gray-700 dark:text-gray-300">
            We're committed to providing the best experience for software license sellers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {reasons.map((reason, index) => (
            <div
              key={index}
              className={`bg-gray-50 dark:bg-gray-700 rounded-xl p-8 transition-all duration-1000 transform ${
                isVisible ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0 mr-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-teal-400 rounded-lg flex items-center justify-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-white"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white">{reason.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{reason.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyChooseUs
