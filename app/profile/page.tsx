"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Settings, CreditCard, Music, Crown } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
  plan: string
  joinDate: string
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({ name: "", email: "" })
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
      setFormData({ name: parsedUser.name, email: parsedUser.email })
    } else {
      router.push("/auth")
    }
  }, [router])

  const handleSave = () => {
    if (user) {
      const updatedUser = { ...user, ...formData }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
      setIsEditing(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/auth")
  }

  const getPlanBadge = (plan: string) => {
    switch (plan) {
      case "premium":
        return <Badge className="bg-blue-600">Premium</Badge>
      case "family":
        return <Badge className="bg-purple-600">Family</Badge>
      default:
        return <Badge variant="secondary">Free</Badge>
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex h-16 items-center px-6">
          <Link href="/" className="flex items-center space-x-2 hover:text-blue-600 transition-colors">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to StreamFlow</span>
          </Link>
        </div>
      </header>

      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
            {/* Placeholder for user icon */}
          </div>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              {getPlanBadge(user.plan)}
              <span className="text-sm text-muted-foreground">
                Member since {new Date(user.joinDate).toLocaleDateString()}
              </span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="subscription">Subscription</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  {/* Placeholder for user icon */}
                  <span>Profile Information</span>
                </CardTitle>
                <CardDescription>Update your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <Button onClick={handleSave}>Save Changes</Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Subscription Details</span>
                </CardTitle>
                <CardDescription>Manage your subscription and billing information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-green-500 flex items-center justify-center">
                      {user.plan === "premium" ? (
                        <Crown className="h-6 w-6 text-white" />
                      ) : (
                        <Music className="h-6 w-6 text-white" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold capitalize">{user.plan} Plan</h3>
                      <p className="text-sm text-muted-foreground">
                        {user.plan === "free" ? "Free forever" : "Billed monthly"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {user.plan === "free" ? "$0.00" : user.plan === "premium" ? "$9.99" : "$14.99"}
                    </p>
                    <p className="text-sm text-muted-foreground">{user.plan === "free" ? "Forever" : "per month"}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button asChild className="w-full">
                    <Link href="/membership">{user.plan === "free" ? "Upgrade Plan" : "Change Plan"}</Link>
                  </Button>
                  {user.plan !== "free" && (
                    <Button variant="outline" className="w-full bg-transparent">
                      Cancel Subscription
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <span>Account Settings</span>
                </CardTitle>
                <CardDescription>Manage your account preferences and security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email Notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive updates about new features and releases</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Configure
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Privacy Settings</h4>
                      <p className="text-sm text-muted-foreground">Control who can see your playlists and activity</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Change Password</h4>
                      <p className="text-sm text-muted-foreground">Update your account password</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Update
                    </Button>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button variant="destructive" onClick={handleLogout}>
                    Sign Out
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
