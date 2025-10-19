"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type Appointment = {
  id: string
  clientName: string
  serviceName: string
  staffMember: string
  day: number // 0-6 for Mon-Sun
  startTime: number // hour in 24h format
  duration: number // in hours
  color: string
}

const appointments: Appointment[] = [
  {
    id: "1",
    clientName: "Sarah Johnson",
    serviceName: "Haircut",
    staffMember: "Anna",
    day: 0,
    startTime: 9,
    duration: 0.75,
    color: "bg-blue-100 border-blue-300 text-blue-900",
  },
  {
    id: "2",
    clientName: "Mike Chen",
    serviceName: "Hair Coloring",
    staffMember: "Mark",
    day: 0,
    startTime: 10,
    duration: 1.5,
    color: "bg-purple-100 border-purple-300 text-purple-900",
  },
  {
    id: "3",
    clientName: "Emma Davis",
    serviceName: "Manicure",
    staffMember: "Anna",
    day: 1,
    startTime: 11,
    duration: 0.5,
    color: "bg-green-100 border-green-300 text-green-900",
  },
  {
    id: "4",
    clientName: "John Smith",
    serviceName: "Facial Treatment",
    staffMember: "Anna",
    day: 2,
    startTime: 14,
    duration: 1,
    color: "bg-orange-100 border-orange-300 text-orange-900",
  },
  {
    id: "5",
    clientName: "Lisa Brown",
    serviceName: "Pedicure",
    staffMember: "Mark",
    day: 3,
    startTime: 15,
    duration: 0.75,
    color: "bg-pink-100 border-pink-300 text-pink-900",
  },
]

const timeSlots = Array.from({ length: 13 }, (_, i) => i + 8) // 8 AM to 8 PM
const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
const dates = [19, 20, 21, 22, 23, 24, 25] // Example dates

export default function CalendarPage() {
  const [selectedStaff, setSelectedStaff] = useState("all")
  const [view, setView] = useState("week")
  const [selectedMobileDay, setSelectedMobileDay] = useState(0)

  const filteredAppointments =
    selectedStaff === "all" ? appointments : appointments.filter((apt) => apt.staffMember === selectedStaff)

  const getDaysToShow = () => {
    if (view === "day") {
      return [selectedMobileDay]
    }
    return Array.from({ length: 7 }, (_, i) => i)
  }

  const daysToShow = getDaysToShow()

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        {/* Date Navigation */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8 shrink-0 bg-transparent">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">May 19 - May 25, 2025</span>
            <Button variant="outline" size="icon" className="h-8 w-8 shrink-0 bg-transparent">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline" size="sm">
            Today
          </Button>
        </div>

        {/* Filters and View Toggle */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Select value={selectedStaff} onValueChange={setSelectedStaff}>
            <SelectTrigger className="w-full sm:w-[180px]">
              <SelectValue placeholder="Filter by staff" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Staff</SelectItem>
              <SelectItem value="Anna">Anna</SelectItem>
              <SelectItem value="Mark">Mark</SelectItem>
            </SelectContent>
          </Select>

          <ToggleGroup
            type="single"
            value={view}
            onValueChange={(value) => value && setView(value)}
            className="justify-start"
          >
            <ToggleGroupItem value="day" aria-label="Day view">
              Day
            </ToggleGroupItem>
            <ToggleGroupItem value="week" aria-label="Week view">
              Week
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>

      {view === "day" && (
        <Tabs
          value={selectedMobileDay.toString()}
          onValueChange={(value) => setSelectedMobileDay(Number.parseInt(value))}
        >
          <TabsList className="w-full justify-start overflow-x-auto">
            {daysOfWeek.map((day, index) => (
              <TabsTrigger key={day} value={index.toString()} className="flex-shrink-0">
                <div className="flex flex-col items-center">
                  <span className="text-xs">{day}</span>
                  <span className="text-xs text-muted-foreground">{dates[index]}</span>
                </div>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      )}

      <div className="overflow-auto rounded-md border">
        <div className="w-full">
          {/* Header Row - responsive grid */}
          <div
            className={cn(
              "grid border-b bg-muted/50",
              view === "day" ? "grid-cols-2" : "grid-cols-4 md:grid-cols-5 lg:grid-cols-8",
            )}
          >
            <div className="border-r p-2 text-center text-xs font-medium sm:text-sm">Time</div>
            {daysToShow.map((dayIndex) => (
              <div key={dayIndex} className="border-r p-2 text-center last:border-r-0">
                <div className="text-xs font-medium sm:text-sm">{daysOfWeek[dayIndex]}</div>
                <div className="text-[10px] text-muted-foreground sm:text-xs">{dates[dayIndex]}</div>
              </div>
            ))}
          </div>

          {/* Time Slots with Day Columns - responsive grid */}
          <div className={cn("grid", view === "day" ? "grid-cols-2" : "grid-cols-4 md:grid-cols-5 lg:grid-cols-8")}>
            {/* Time Labels Column */}
            <div className="border-r">
              {timeSlots.map((hour) => (
                <div
                  key={hour}
                  className="border-b p-1 text-center text-[10px] text-muted-foreground last:border-b-0 sm:p-2 sm:text-xs"
                  style={{ height: "64px" }}
                >
                  {hour === 12 ? "12 PM" : hour > 12 ? `${hour - 12} PM` : `${hour} AM`}
                </div>
              ))}
            </div>

            {/* Day Columns - responsive */}
            {daysToShow.map((dayIndex) => (
              <div key={dayIndex} className="relative border-r last:border-r-0">
                {/* Time slot backgrounds */}
                {timeSlots.map((hour) => (
                  <div key={hour} className="border-b last:border-b-0" style={{ height: "64px" }} />
                ))}

                {filteredAppointments
                  .filter((apt) => apt.day === dayIndex)
                  .map((apt) => {
                    const topPosition = (apt.startTime - 8) * 64 // 64px per hour slot
                    const height = apt.duration * 64
                    return (
                      <Card
                        key={apt.id}
                        className={cn(
                          "absolute left-0.5 right-0.5 cursor-pointer border-l-4 p-1.5 transition-shadow hover:shadow-md sm:left-1 sm:right-1 sm:p-2",
                          apt.color,
                        )}
                        style={{
                          top: `${topPosition}px`,
                          height: `${height - 4}px`,
                          minHeight: "32px",
                        }}
                      >
                        <div className="text-[10px] font-semibold leading-tight sm:text-xs">{apt.clientName}</div>
                        <div className="text-[10px] leading-tight sm:text-xs">{apt.serviceName}</div>
                        {height > 48 && (
                          <div className="text-[9px] text-muted-foreground sm:text-xs">{apt.staffMember}</div>
                        )}
                      </Card>
                    )
                  })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
