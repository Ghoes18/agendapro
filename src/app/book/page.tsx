"use client"

import { useState } from "react"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

type Service = {
  id: string
  name: string
  duration: string
  price: string
  description: string
}

type TimeSlot = {
  time: string
  available: boolean
}

const services: Service[] = [
  { id: "1", name: "Haircut", duration: "45 min", price: "$90.00", description: "Professional haircut and styling" },
  {
    id: "2",
    name: "Hair Coloring",
    duration: "1 hour 30 min",
    price: "$150.00",
    description: "Full color treatment",
  },
  { id: "3", name: "Manicure", duration: "30 min", price: "$45.00", description: "Classic manicure service" },
  { id: "4", name: "Pedicure", duration: "45 min", price: "$60.00", description: "Relaxing pedicure treatment" },
  {
    id: "5",
    name: "Facial Treatment",
    duration: "1 hour",
    price: "$120.00",
    description: "Deep cleansing facial",
  },
]

const timeSlots: TimeSlot[] = [
  { time: "9:00 AM", available: true },
  { time: "9:30 AM", available: false },
  { time: "10:00 AM", available: true },
  { time: "10:30 AM", available: true },
  { time: "11:00 AM", available: false },
  { time: "11:30 AM", available: true },
  { time: "12:00 PM", available: true },
  { time: "12:30 PM", available: true },
  { time: "1:00 PM", available: false },
  { time: "1:30 PM", available: true },
  { time: "2:00 PM", available: true },
  { time: "2:30 PM", available: true },
]

export default function BookingPage() {
  const [currentStep, setCurrentStep] = useState(0)
  const [selectedService, setSelectedService] = useState<string>("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>("")
  const [clientInfo, setClientInfo] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [, setIsBooked] = useState(false)

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return selectedService !== ""
      case 1:
        return selectedDate !== undefined && selectedTime !== ""
      case 2:
        return clientInfo.name && clientInfo.email && clientInfo.phone
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1)
    } else {
      setIsBooked(true)
      setCurrentStep(3)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleBookAnother = () => {
    setCurrentStep(0)
    setSelectedService("")
    setSelectedDate(undefined)
    setSelectedTime("")
    setClientInfo({ name: "", email: "", phone: "" })
    setIsBooked(false)
  }

  const selectedServiceData = services.find((s) => s.id === selectedService)

  return (
    <div className="min-h-screen bg-muted/30 p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground">Book Your Appointment</h1>
          <p className="mt-2 text-muted-foreground">Follow the steps below to schedule your visit</p>
        </div>

        <Card>
          <CardHeader>
            <div className="mb-2 text-sm font-medium text-muted-foreground">
              Step {currentStep + 1} of 4:{" "}
              {currentStep === 0
                ? "Select Service"
                : currentStep === 1
                  ? "Select Date & Time"
                  : currentStep === 2
                    ? "Your Details"
                    : "Confirmation"}
            </div>
            <CardTitle>
              {currentStep === 0 && "Select Service"}
              {currentStep === 1 && "Select Date & Time"}
              {currentStep === 2 && "Your Details"}
              {currentStep === 3 && "Booking Confirmed!"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Step 1: Select Service */}
            {currentStep === 0 && (
              <RadioGroup value={selectedService} onValueChange={setSelectedService}>
                <div className="space-y-3">
                  {services.map((service) => (
                    <label
                      key={service.id}
                      className={cn(
                        "flex cursor-pointer items-start gap-4 rounded-lg border-2 p-4 transition-colors hover:bg-accent",
                        selectedService === service.id ? "border-primary bg-accent" : "border-border",
                      )}
                    >
                      <RadioGroupItem value={service.id} id={service.id} className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="font-semibold">{service.name}</div>
                            <div className="text-sm text-muted-foreground">{service.description}</div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold">{service.price}</div>
                            <div className="text-sm text-muted-foreground">{service.duration}</div>
                          </div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </RadioGroup>
            )}

            {currentStep === 1 && (
              <div className="grid gap-6 md:grid-cols-2">
                {/* Calendar on the left */}
                <div className="flex flex-col">
                  <Label className="mb-3">Select Date</Label>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    disabled={(date) => date < new Date()}
                    className="rounded-md border"
                  />
                </div>

                {/* Time slots on the right */}
                <div className="flex flex-col">
                  <Label className="mb-3">Available Time Slots</Label>
                  {selectedDate ? (
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((slot) => (
                        <Button
                          key={slot.time}
                          variant={selectedTime === slot.time ? "default" : "outline"}
                          disabled={!slot.available}
                          onClick={() => setSelectedTime(slot.time)}
                          className="w-full"
                        >
                          {slot.time}
                        </Button>
                      ))}
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center rounded-md border border-dashed p-8 text-center text-sm text-muted-foreground">
                      Please select a date to view available time slots
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Your Details */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={clientInfo.name}
                    onChange={(e) => setClientInfo({ ...clientInfo, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={clientInfo.email}
                    onChange={(e) => setClientInfo({ ...clientInfo, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={clientInfo.phone}
                    onChange={(e) => setClientInfo({ ...clientInfo, phone: e.target.value })}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="flex flex-col items-center space-y-6 py-8 text-center">
                <CheckCircle className="h-20 w-20 text-green-600" />
                <div>
                  <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
                  <p className="mt-2 text-muted-foreground">We&apos;ve sent a confirmation email to {clientInfo.email}</p>
                </div>

                {/* Booking Summary */}
                <div className="w-full max-w-md space-y-3 rounded-lg border bg-muted/50 p-6 text-left">
                  <h3 className="font-semibold">Booking Details</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Service:</span>
                      <span className="font-medium">{selectedServiceData?.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Duration:</span>
                      <span className="font-medium">{selectedServiceData?.duration}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">When:</span>
                      <span className="font-medium">
                        {selectedDate?.toLocaleDateString()} at {selectedTime}
                      </span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="text-muted-foreground">Total:</span>
                      <span className="font-semibold">{selectedServiceData?.price}</span>
                    </div>
                  </div>
                </div>

                <Button onClick={handleBookAnother} size="lg">
                  Book Another Appointment
                </Button>
              </div>
            )}

            {currentStep < 3 && (
              <div className="mt-6 flex justify-between">
                <Button variant="outline" onClick={handleBack} disabled={currentStep === 0}>
                  Back
                </Button>
                <Button onClick={handleNext} disabled={!canProceed()}>
                  {currentStep === 2 ? "Confirm Booking" : "Next"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
