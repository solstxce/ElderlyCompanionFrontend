'use client'

import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ChevronRight, MessageCircle, Bell, Calendar, Heart, Star, X } from "lucide-react"
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface Message {
  role: 'user' | 'companion'
  content: string
}

const usageData = [
  { month: 'Jan', users: 2000 },
  { month: 'Feb', users: 2500 },
  { month: 'Mar', users: 3000 },
  { month: 'Apr', users: 3500 },
  { month: 'May', users: 4000 },
  { month: 'Jun', users: 4230 },
]

export function ImprovedLandingPageComponent() {
  const [chatOpen, setChatOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [reminder, setReminder] = useState('')
  const [stats, setStats] = useState({
    activeUsers: 0,
    medicationReminders: 0,
    conversationsHandled: 0
  })
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    // Simulating API call for statistics
    const fetchStats = async () => {
      setStats({
        activeUsers: 4230,
        medicationReminders: 12580,
        conversationsHandled: 9850
      })
    }
    fetchStats()
  }, [])

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const newMessages = [...messages, { role: 'user', content: input }]
    setMessages(newMessages)
    setInput('')

    try {
      const response = await fetch('http://localhost:5000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `message=${encodeURIComponent(input)}`,
      })
      const data = await response.json()
      setMessages([...newMessages, { role: 'companion', content: data.response }])
    } catch (error) {
      console.error('Error sending message:', error)
      setMessages([...newMessages, { role: 'companion', content: 'Sorry, I encountered an error. Please try again.' }])
    }
  }

  const handleGetReminder = async () => {
    try {
      const response = await fetch('http://localhost:5000/remind')
      const data = await response.json()
      setReminder(data.reminder)
    } catch (error) {
      console.error('Error getting reminder:', error)
      setReminder('Unable to fetch reminder at this time.')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow">
        <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">ElderlyCompanion</h1>
          <div className="space-x-4">
            <Button variant="ghost">Features</Button>
            <Button variant="ghost">Testimonials</Button>
            <Button variant="ghost">Contact</Button>
            <Button>Get Started</Button>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <motion.section 
          className="container mx-auto px-4 py-12 md:py-24 flex flex-col md:flex-row items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="md:w-1/2 mb-8 md:mb-0">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
              Companionship and Care at Your Fingertips
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
              Our AI-powered app provides 24/7 support, medication reminders, and friendly conversation for seniors.
            </p>
            <Button size="lg" className="mr-4">
              Start Free Trial
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
          <motion.div 
            className="md:w-1/2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <img
              src="https://img.freepik.com/premium-vector/online-medical-service-concept-illustration-healthcare-websites-apps_1324816-35548.jpg"
              alt="Elderly person using a tablet with caregiver"
              className="rounded-lg shadow-lg w-full h-auto"
            />
          </motion.div>
        </motion.section>

        {/* Statistics Section */}
        <section className="bg-blue-600 text-white py-12">
          <div className="container mx-auto px-4">
            <h3 className="text-2xl font-semibold mb-8 text-center">Our Impact</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Active Users', value: stats.activeUsers },
                { title: 'Medication Reminders Sent', value: stats.medicationReminders },
                { title: 'Conversations Handled', value: stats.conversationsHandled }
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-white/10 border-none">
                    <CardHeader>
                      <CardTitle className="text-4xl font-bold">{stat.value.toLocaleString()}+</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-lg">{stat.title}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* User Growth Chart */}
        <section className="container mx-auto px-4 py-12">
          <h3 className="text-3xl font-bold text-center mb-8">User Growth</h3>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardContent className="pt-6">
                <ChartContainer
                  config={{
                    users: {
                      label: "Active Users",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={usageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Legend />
                      <Line type="monotone" dataKey="users" stroke="var(--color-users)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </motion.div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-12">
          <h3 className="text-3xl font-bold text-center mb-8">Key Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: MessageCircle, title: "24/7 Companionship", description: "Always available for a friendly chat or to provide support." },
              { icon: Bell, title: "Medication Reminders", description: "Never miss a dose with our smart reminder system." },
              { icon: Calendar, title: "Appointment Scheduling", description: "Keep track of doctor visits and social engagements." },
              { icon: Heart, title: "Health Monitoring", description: "Track vital signs and get personalized health tips." }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader>
                    <feature.icon className="h-8 w-8 text-blue-600 mb-2" />
                    <CardTitle>{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="bg-gray-200 dark:bg-gray-800 py-12">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-bold text-center mb-8">What Our Users Say</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { name: "Jane D.", age: 78, text: "This app has been a blessing. It helps me remember my medications and provides great company." },
                { name: "Robert S.", age: 82, text: "I feel more connected to my family with the easy video call feature. It's simple to use!" },
                { name: "Margaret L.", age: 75, text: "The health tips are so helpful. I've improved my diet and feel more energetic." }
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="bg-white dark:bg-gray-700">
                    <CardHeader>
                      <div className="flex items-center mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className="h-5 w-5 fill-current text-yellow-500" />
                        ))}
                      </div>
                      <CardTitle>Life-changing App</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 dark:text-gray-300">
                        "{testimonial.text}"
                      </p>
                      <p className="mt-4 font-semibold">- {testimonial.name}, {testimonial.age}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-xl font-semibold mb-4">ElderlyCompanion</h4>
              <p>Providing care and support to seniors through innovative technology.</p>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:underline">About Us</a></li>
                <li><a href="#" className="hover:underline">Features</a></li>
                <li><a href="#" className="hover:underline">Testimonials</a></li>
                <li><a href="#" className="hover:underline">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-xl font-semibold mb-4">Stay Connected</h4>
              <p className="mb-4">Subscribe to our newsletter for updates and tips.</p>
              <form className="flex">
                <Input type="email" placeholder="Enter your email" className="mr-2" />
                <Button type="submit">Subscribe</Button>
              </form>
            </div>
          </div>
          <div className="mt-8 text-center">
            <p>&copy; 2023 ElderlyCompanion. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* Chatbot Toggle Button */}
      <motion.button
        className="fixed bottom-4 right-4 w-16 h-16 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setChatOpen(!chatOpen)}
      >
        {chatOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </motion.button>

      {/* Chatbot Window */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            
            exit={{ opacity: 0, y: 50, scale: 0.3 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-4 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
          >
            <Card className="border-none">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">ElderlyCompanion Chat</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] mb-4" ref={scrollAreaRef}>
                  {messages.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className={`mb-2 p-2 rounded-lg ${
                        message.role === 'user' ? 'bg-blue-100 text-blue-800 ml-auto' : 'bg-gray-100 text-gray-800'
                      } max-w-[80%]`}
                    >
                      {message.content}
                    </motion.div>
                  ))}
                </ScrollArea>
                <div className="flex mb-4">
                  <Input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type a message..."
                    className="flex-grow mr-2"
                  />
                  <Button onClick={handleSendMessage}>Send</Button>
                </div>
                <Button onClick={handleGetReminder} className="w-full mb-4">
                  <Bell className="mr-2 h-4 w-4" /> Get Medication Reminder
                </Button>
                {reminder && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card className="bg-yellow-100 text-yellow-800 p-4 mt-4">
                      <CardTitle className="text-lg font-semibold mb-2">Medication Reminder</CardTitle>
                      <CardContent>{reminder}</CardContent>
                    </Card>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}