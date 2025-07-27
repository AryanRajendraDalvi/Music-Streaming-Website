"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Music, Crown, Zap, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const plans = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for casual listeners",
    features: [
      "Limited skips per hour",
      "Ads between songs",
      "Standard audio quality",
      "Basic playlist creation",
      "Mobile and web access",
    ],
    icon: Music,
    popular: false,
    color: "from-gray-500 to-gray-600",
  },
  {
    id: "premium",
    name: "Premium",
    price: "$9.99",
    period: "per month",
    description: "The complete music experience",
    features: [
      "Unlimited skips",
      "No ads",
      "High-quality audio",
      "Offline downloads",
      "Unlimited playlists",
      "Mobile, web, and desktop access",
    ],
    icon: Crown,
    popular: true,
    color: "from-blue-500 to-green-500",
  },
  {
    id: "family",
    name: "Family",
    price: "$14.99",
    period: "per month",
    description: "Perfect for families up to 6 members",
    features: [
      "All Premium features",
      "6 individual accounts",
      "Family mix playlist",
      "Parental controls",
      "Individual recommendations",
      "Shared family playlists",
    ],
    icon: Zap,
    popular: false,
    color: "from-purple-500 to-pink-500",
  },
]

export default function MembershipPage() {
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSelectPlan = (planId) => {
    setSelectedPlan(planId)
    setIsLoading(true)

    // Simulate plan selection
    setTimeout(() => {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      user.plan = planId
      localStorage.setItem("user", JSON.stringify(user))
      setIsLoading(false)
      router.push("/")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-green-800 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center space-x-2 text-white hover:text-blue-200 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to StreamFlow</span>
          </Link>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Choose Your Plan</h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto">
            Unlock the full potential of StreamFlow with our premium plans
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {plans.map((plan) => {
            const Icon = plan.icon
            return (
              <Card
                key={plan.id}
                className={`relative backdrop-blur-sm bg-white/10 border-white/20 hover:bg-white/15 transition-all duration-300 ${
                  plan.popular ? "ring-2 ring-green-400 scale-105" : ""
                }`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-green-600 text-white">
                    Most Popular
                  </Badge>
                )}

                <CardHeader className="text-center">
                  <div
                    className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${plan.color} flex items-center justify-center`}
                  >
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-white">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-white">
                    {plan.price}
                    <span className="text-sm font-normal text-blue-200">/{plan.period}</span>
                  </div>
                  <CardDescription className="text-blue-100">{plan.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-3 text-white">
                        <Check className="h-5 w-5 text-green-400 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={() => handleSelectPlan(plan.id)}
                    disabled={isLoading && selectedPlan === plan.id}
                    className={`w-full mt-6 ${
                      plan.popular ? "bg-green-600 hover:bg-green-700" : "bg-white/20 hover:bg-white/30 text-white"
                    }`}
                  >
                    {isLoading && selectedPlan === plan.id
                      ? "Processing..."
                      : plan.id === "free"
                        ? "Continue with Free"
                        : "Get Started"}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="text-center">
          <p className="text-blue-200 text-sm">All plans include a 30-day money-back guarantee. Cancel anytime.</p>
        </div>
      </div>
    </div>
  )
}
