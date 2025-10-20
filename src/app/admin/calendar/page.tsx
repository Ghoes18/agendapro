"use client"

import { useState, useEffect, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AppointmentDialog } from "@/components/appointment-dialog"
import { KeyboardShortcutsHelp } from "@/components/keyboard-shortcuts-help"
import { Appointment } from "@/types/appointment"
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Plus,
  HelpCircle,
  Calendar as CalendarIcon,
  Users,
  Filter,
  ChevronDown,
  ChevronUp,
} from "lucide-react"

// Mock data for initial appointments
const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: "1",
    clientName: "Emma Wilson",
    clientEmail: "emma@example.com",
    clientPhone: "+1 (555) 123-4567",
    serviceName: "Haircut & Style",
    staffMember: "Sarah Johnson",
    day: 0,
    startTime: 9,
    duration: 1,
    color: "bg-blue-100 border-blue-300 text-blue-900",
    status: "confirmed",
    notes: "First time client",
  },
  {
    id: "2",
    clientName: "Michael Brown",
    clientEmail: "michael@example.com",
    clientPhone: "+1 (555) 234-5678",
    serviceName: "Beard Trim",
    staffMember: "David Miller",
    day: 0,
    startTime: 10,
    duration: 0.5,
    color: "bg-green-100 border-green-300 text-green-900",
    status: "confirmed",
  },
  {
    id: "3",
    clientName: "Sophia Martinez",
    clientEmail: "sophia@example.com",
    serviceName: "Color Treatment",
    staffMember: "Sarah Johnson",
    day: 1,
    startTime: 14,
    duration: 2,
    color: "bg-purple-100 border-purple-300 text-purple-900",
    status: "pending",
  },
  {
    id: "4",
    clientName: "James Anderson",
    clientEmail: "james@example.com",
    clientPhone: "+1 (555) 456-7890",
    serviceName: "Men's Cut",
    staffMember: "David Miller",
    day: 2,
    startTime: 11,
    duration: 0.75,
    color: "bg-orange-100 border-orange-300 text-orange-900",
    status: "completed",
  },
  {
    id: "5",
    clientName: "Olivia Taylor",
    serviceName: "Deep Conditioning",
    staffMember: "Emily Davis",
    day: 3,
    startTime: 15,
    duration: 1.5,
    color: "bg-pink-100 border-pink-300 text-pink-900",
    status: "confirmed",
  },
]

const AVAILABLE_STAFF = ["Sarah Johnson", "David Miller", "Emily Davis", "All Staff"]

const AVAILABLE_SERVICES = [
  { name: "Haircut & Style", duration: 1 },
  { name: "Beard Trim", duration: 0.5 },
  { name: "Color Treatment", duration: 2 },
  { name: "Men's Cut", duration: 0.75 },
  { name: "Deep Conditioning", duration: 1.5 },
  { name: "Balayage", duration: 3 },
  { name: "Hair Extensions", duration: 2.5 },
  { name: "Blowout", duration: 0.75 },
]

const DAYS_OF_WEEK = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const HOURS = Array.from({ length: 13 }, (_, i) => i + 8) // 8 AM to 8 PM

type ViewMode = "week" | "day" | "month"

export default function CalendarPage() {
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS)
  const [viewMode, setViewMode] = useState<ViewMode>("week")
  const [selectedDay, setSelectedDay] = useState(0)
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0)
  const [currentMonthOffset, setCurrentMonthOffset] = useState(0)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStaff, setSelectedStaff] = useState("All Staff")
  const [showTodaySummary, setShowTodaySummary] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Dialog states
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogMode, setDialogMode] = useState<"view" | "edit" | "create">("view")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [dialogDay, setDialogDay] = useState<number | undefined>()
  const [dialogTime, setDialogTime] = useState<number | undefined>()
  const [shortcutsOpen, setShortcutsOpen] = useState(false)

  // Drag and drop state
  const [draggedAppointment, setDraggedAppointment] = useState<Appointment | null>(null)
  const [dropTarget, setDropTarget] = useState<{ day: number; time: number } | null>(null)

  // Update current time every minute
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)
    return () => clearInterval(timer)
  }, [])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.key.toLowerCase()) {
        case "arrowleft":
          e.preventDefault()
          if (viewMode === "month") {
            setCurrentMonthOffset((prev) => prev - 1)
          } else {
            setCurrentWeekOffset((prev) => prev - 1)
          }
          break
        case "arrowright":
          e.preventDefault()
          if (viewMode === "month") {
            setCurrentMonthOffset((prev) => prev + 1)
          } else {
            setCurrentWeekOffset((prev) => prev + 1)
          }
          break
        case "t":
          e.preventDefault()
          if (viewMode === "month") {
            setCurrentMonthOffset(0)
          } else {
            setCurrentWeekOffset(0)
          }
          break
        case "d":
          e.preventDefault()
          setViewMode("day")
          break
        case "w":
          e.preventDefault()
          setViewMode("week")
          break
        case "m":
          e.preventDefault()
          setViewMode("month")
          break
        case "?":
          e.preventDefault()
          setShortcutsOpen(true)
          break
        case "n":
          if (e.metaKey || e.ctrlKey) {
            e.preventDefault()
            handleCreateAppointment()
          }
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Get current week date range
  const getWeekDateRange = () => {
    const today = new Date()
    const dayOfWeek = today.getDay() === 0 ? 6 : today.getDay() - 1 // Convert Sunday=0 to Monday=0
    const monday = new Date(today)
    monday.setDate(today.getDate() - dayOfWeek + currentWeekOffset * 7)

    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)

    const formatDate = (date: Date) => {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }

    return `${formatDate(monday)} - ${formatDate(sunday)}, ${monday.getFullYear()}`
  }

  // Get current month date range
  const getMonthDateRange = () => {
    const today = new Date()
    const currentMonth = new Date(today.getFullYear(), today.getMonth() + currentMonthOffset, 1)
    return currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  // Get month calendar data
  const getMonthCalendar = () => {
    const today = new Date()
    const currentMonth = new Date(today.getFullYear(), today.getMonth() + currentMonthOffset, 1)
    const firstDay = new Date(currentMonth)
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
    
    // Get first Monday of the month (or previous month)
    const firstMonday = new Date(firstDay)
    const dayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1
    firstMonday.setDate(firstDay.getDate() - dayOfWeek)
    
    // Get last Sunday of the month (or next month)
    const lastSunday = new Date(lastDay)
    const lastDayOfWeek = lastDay.getDay() === 0 ? 0 : 7 - lastDay.getDay()
    lastSunday.setDate(lastDay.getDate() + lastDayOfWeek)
    
    const weeks = []
    const currentDate = new Date(firstMonday)
    
    while (currentDate <= lastSunday) {
      const week = []
      for (let i = 0; i < 7; i++) {
        week.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
      }
      weeks.push(week)
    }
    
    return { weeks, currentMonth }
  }

  // Check if current month is being viewed
  const isCurrentMonth = currentMonthOffset === 0

  // Check if current week is being viewed
  const isCurrentWeek = currentWeekOffset === 0

  // Get today's day index (0-6 for Mon-Sun)
  const getTodayIndex = () => {
    const today = new Date().getDay()
    return today === 0 ? 6 : today - 1
  }

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter((apt) => {
      // Search filter
      const matchesSearch =
        searchQuery === "" ||
        apt.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.staffMember.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.clientEmail?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        apt.clientPhone?.includes(searchQuery)

      // Staff filter
      const matchesStaff = selectedStaff === "All Staff" || apt.staffMember === selectedStaff

      return matchesSearch && matchesStaff
    })
  }, [appointments, searchQuery, selectedStaff])

  // Get today's appointments
  const todaysAppointments = useMemo(() => {
    if (!isCurrentWeek) return []
    const todayIndex = getTodayIndex()
    return filteredAppointments
      .filter((apt) => apt.day === todayIndex)
      .sort((a, b) => a.startTime - b.startTime)
  }, [filteredAppointments, isCurrentWeek])

  // Get appointments for a specific date
  const getAppointmentsForDate = (date: Date) => {
    const dayOfWeek = date.getDay() === 0 ? 6 : date.getDay() - 1 // Convert to Monday=0 format
    return filteredAppointments
      .filter((apt) => apt.day === dayOfWeek)
      .sort((a, b) => a.startTime - b.startTime)
  }

  // Format time
  const formatTime = (hour: number, minutes = 0) => {
    const totalMinutes = hour * 60 + minutes
    const h = Math.floor(totalMinutes / 60)
    const m = totalMinutes % 60
    
    if (h === 12) return `12:${m.toString().padStart(2, "0")} PM`
    if (h > 12) return `${h - 12}:${m.toString().padStart(2, "0")} PM`
    return `${h}:${m.toString().padStart(2, "0")} AM`
  }

  // Get current time position
  const getCurrentTimePosition = () => {
    const now = new Date()
    const hours = now.getHours()
    const minutes = now.getMinutes()
    
    if (hours < 8 || hours >= 21) return null
    
    const position = ((hours - 8) * 60 + minutes) / 60
    return position
  }

  // Handle appointment click
  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment)
    setDialogMode("view")
    setDialogOpen(true)
  }

  // Handle create appointment
  const handleCreateAppointment = (day?: number, time?: number) => {
    setSelectedAppointment(null)
    setDialogMode("create")
    setDialogDay(day)
    setDialogTime(time)
    setDialogOpen(true)
  }

  // Handle save appointment
  const handleSaveAppointment = (appointment: Appointment) => {
    const existingIndex = appointments.findIndex((a) => a.id === appointment.id)
    if (existingIndex >= 0) {
      const updated = [...appointments]
      updated[existingIndex] = appointment
      setAppointments(updated)
    } else {
      setAppointments([...appointments, appointment])
    }
  }

  // Handle delete appointment
  const handleDeleteAppointment = (id: string) => {
    setAppointments(appointments.filter((a) => a.id !== id))
  }

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, appointment: Appointment) => {
    setDraggedAppointment(appointment)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragEnd = () => {
    setDraggedAppointment(null)
    setDropTarget(null)
  }

  const handleDragOver = (e: React.DragEvent, day: number, time: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = "move"
    setDropTarget({ day, time })
  }

  const handleDragLeave = () => {
    setDropTarget(null)
  }

  const handleDrop = (e: React.DragEvent, day: number, time: number) => {
    e.preventDefault()
    if (draggedAppointment) {
      const updated = appointments.map((apt) =>
        apt.id === draggedAppointment.id
          ? { ...apt, day, startTime: time }
          : apt
      )
      setAppointments(updated)
    }
    setDraggedAppointment(null)
    setDropTarget(null)
  }

  // Get status color
  const getStatusBorderColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "border-l-green-500"
      case "pending":
        return "border-l-yellow-500"
      case "completed":
        return "border-l-blue-500"
      case "cancelled":
        return "border-l-red-500"
      default:
        return "border-l-gray-500"
    }
  }

  // Render appointment card
  const renderAppointmentCard = (appointment: Appointment) => {
    const endTime = appointment.startTime + appointment.duration
    const isDragging = draggedAppointment?.id === appointment.id

    return (
      <div
        key={appointment.id}
        draggable
        onDragStart={(e) => handleDragStart(e, appointment)}
        onDragEnd={handleDragEnd}
        onClick={() => handleAppointmentClick(appointment)}
        className={`
          ${appointment.color}
          border-l-4 ${getStatusBorderColor(appointment.status)}
          p-2 rounded-md text-xs cursor-pointer
          transition-all duration-200
          hover:shadow-md hover:scale-[1.02]
          ${isDragging ? "opacity-50" : "opacity-100"}
          relative overflow-hidden z-20
          group
        `}
        style={{
          height: `${appointment.duration * 4}rem`,
          minHeight: "2.5rem",
        }}
      >
        <div className="flex justify-between items-start mb-1">
          <span className="font-semibold truncate">{appointment.clientName}</span>
          <span className="text-[10px] opacity-70 whitespace-nowrap ml-1">
            {formatTime(appointment.startTime)} - {formatTime(endTime)}
          </span>
        </div>
        <div className="truncate opacity-80">{appointment.serviceName}</div>
        <div className="truncate text-[10px] opacity-70">{appointment.staffMember}</div>
      </div>
    )
  }

  // Render time slot
  const renderTimeSlot = (day: number, hour: number) => {
    const appointmentsInSlot = filteredAppointments.filter(
      (apt) => apt.day === day && apt.startTime === hour
    )

    const isDropZone =
      dropTarget?.day === day &&
      dropTarget?.time === hour &&
      draggedAppointment !== null

    return (
      <div
        key={`${day}-${hour}`}
        className={`
          border-b border-r border-gray-200 p-1 
          transition-colors relative
          ${isDropZone ? "ring-2 ring-blue-400 bg-blue-50" : ""}
          ${appointmentsInSlot.length === 0 ? "hover:bg-gray-50 cursor-pointer" : ""}
        `}
        style={{ height: "4rem" }}
        onClick={() => appointmentsInSlot.length === 0 && handleCreateAppointment(day, hour)}
        onDragOver={(e) => handleDragOver(e, day, hour)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e, day, hour)}
      >
        <div className="space-y-1 relative z-10">
          {appointmentsInSlot.map((apt) => renderAppointmentCard(apt))}
        </div>
      </div>
    )
  }

  // Render current time indicator
  const renderCurrentTimeIndicator = (dayIndex: number) => {
    if (!isCurrentWeek || dayIndex !== getTodayIndex()) return null

    const position = getCurrentTimePosition()
    if (position === null) return null

    return (
      <div
        className="absolute left-0 right-0 z-10 pointer-events-none"
        style={{ top: `${position * 4}rem` }}
      >
        <div className="flex items-center">
          <div className="w-2 h-2 bg-red-500 rounded-full -ml-1" />
          <div className="flex-1 h-0.5 bg-red-500" />
        </div>
      </div>
    )
  }

  const daysToShow = viewMode === "week" ? DAYS_OF_WEEK : [DAYS_OF_WEEK[selectedDay]]
  const dayIndices = viewMode === "week" ? [0, 1, 2, 3, 4, 5, 6] : [selectedDay]

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarIcon className="h-8 w-8" />
              Calendar
            </h1>
            <p className="text-gray-600 mt-1">
              {viewMode === "month" ? getMonthDateRange() : getWeekDateRange()}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShortcutsOpen(true)}
              className="gap-2"
            >
              <HelpCircle className="h-4 w-4" />
              Shortcuts
            </Button>

            <div className="flex items-center gap-1 bg-gray-100 rounded-md p-1">
              <Button
                variant={viewMode === "day" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("day")}
              >
                Day
              </Button>
              <Button
                variant={viewMode === "week" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("week")}
              >
                Week
              </Button>
              <Button
                variant={viewMode === "month" ? "default" : "ghost"}
                size="sm"
                onClick={() => setViewMode("month")}
              >
                Month
              </Button>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search appointments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={selectedStaff} onValueChange={setSelectedStaff}>
                <SelectTrigger>
                  <Users className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AVAILABLE_STAFF.map((staff) => (
                    <SelectItem key={staff} value={staff}>
                      {staff}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {viewMode === "day" && (
                <Select value={selectedDay.toString()} onValueChange={(v) => setSelectedDay(parseInt(v))}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day, index) => (
                      <SelectItem key={index} value={index.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Today's Appointments Summary */}
        {isCurrentWeek && todaysAppointments.length > 0 && (
          <Card>
            <CardHeader className="cursor-pointer" onClick={() => setShowTodaySummary(!showTodaySummary)}>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Today's Appointments ({todaysAppointments.length})
                </CardTitle>
                {showTodaySummary ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </CardHeader>
            {showTodaySummary && (
              <CardContent>
                <div className="space-y-2">
                  {todaysAppointments.map((apt) => (
                    <div
                      key={apt.id}
                      onClick={() => handleAppointmentClick(apt)}
                      className={`
                        flex items-center justify-between p-3 rounded-md
                        ${apt.color}
                        border-l-4 ${getStatusBorderColor(apt.status)}
                        cursor-pointer hover:shadow-md transition-shadow
                      `}
                    >
                      <div className="flex-1">
                        <div className="font-semibold">{apt.clientName}</div>
                        <div className="text-sm opacity-80">{apt.serviceName}</div>
                        <div className="text-xs opacity-70">{apt.staffMember}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium">
                          {formatTime(apt.startTime)} - {formatTime(apt.startTime + apt.duration)}
                        </div>
                        <div className="text-xs opacity-70 capitalize">{apt.status}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (viewMode === "month") {
                setCurrentMonthOffset((prev) => prev - 1)
              } else {
                setCurrentWeekOffset((prev) => prev - 1)
              }
            }}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>

          <Button
            variant={
              (viewMode === "week" && isCurrentWeek) || 
              (viewMode === "month" && isCurrentMonth) 
                ? "default" 
                : "outline"
            }
            size="sm"
            onClick={() => {
              if (viewMode === "month") {
                setCurrentMonthOffset(0)
              } else {
                setCurrentWeekOffset(0)
              }
            }}
          >
            Today
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (viewMode === "month") {
                setCurrentMonthOffset((prev) => prev + 1)
              } else {
                setCurrentWeekOffset((prev) => prev + 1)
              }
            }}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Calendar Grid */}
        <Card className="p-0">
          <CardContent className="p-0">
            {viewMode === "month" ? (
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Month Header */}
                  <div className="grid grid-cols-7 bg-gray-100 border-b border-gray-200">
                    {DAYS_OF_WEEK.map((day) => (
                      <div key={day} className="p-3 font-semibold text-center border-r border-gray-200 last:border-r-0">
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Month Calendar */}
                  <div className="relative">
                    {getMonthCalendar().weeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="grid grid-cols-7">
                        {week.map((date, dayIndex) => {
                          const isCurrentMonth = date.getMonth() === getMonthCalendar().currentMonth.getMonth()
                          const isToday = date.toDateString() === new Date().toDateString()
                          const dayAppointments = getAppointmentsForDate(date)
                          
                          return (
                            <div
                              key={dayIndex}
                              className={`
                                min-h-[120px] border-b border-r border-gray-200 last:border-r-0 p-2
                                ${isCurrentMonth ? "bg-white" : "bg-gray-50"}
                                ${isToday ? "bg-blue-50" : ""}
                                hover:bg-gray-100 cursor-pointer transition-colors
                              `}
                              onClick={() => handleCreateAppointment()}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <span className={`
                                  text-sm font-medium
                                  ${isCurrentMonth ? "text-gray-900" : "text-gray-400"}
                                  ${isToday ? "text-blue-600 font-bold" : ""}
                                `}>
                                  {date.getDate()}
                                </span>
                                {dayAppointments.length > 0 && (
                                  <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded-full">
                                    {dayAppointments.length}
                                  </span>
                                )}
                              </div>
                              
                              <div className="space-y-1">
                                {dayAppointments.slice(0, 3).map((apt) => (
                                  <div
                                    key={apt.id}
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleAppointmentClick(apt)
                                    }}
                                    className={`
                                      ${apt.color}
                                      border-l-4 ${getStatusBorderColor(apt.status)}
                                      p-1 rounded text-xs cursor-pointer
                                      hover:shadow-sm transition-shadow
                                    `}
                                  >
                                    <div className="truncate font-medium">{apt.clientName}</div>
                                    <div className="truncate text-[10px] opacity-80">
                                      {formatTime(apt.startTime)} - {apt.serviceName}
                                    </div>
                                  </div>
                                ))}
                                {dayAppointments.length > 3 && (
                                  <div className="text-xs text-gray-500 text-center">
                                    +{dayAppointments.length - 3} more
                                  </div>
                                )}
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  {/* Header Row */}
                  <div className="grid grid-cols-[80px_repeat(auto-fit,minmax(0,1fr))] bg-gray-100 border-b border-gray-200">
                    <div className="p-3 font-semibold border-r border-gray-200">Time</div>
                    {daysToShow.map((day, idx) => (
                      <div
                        key={day}
                        className={`
                          p-3 font-semibold text-center border-r border-gray-200
                          ${isCurrentWeek && dayIndices[idx] === getTodayIndex() ? "bg-blue-100 text-blue-700" : ""}
                        `}
                      >
                        {day}
                      </div>
                    ))}
                  </div>

                  {/* Time Slots */}
                  <div className="relative">
                    {HOURS.map((hour) => (
                      <div
                        key={hour}
                        className="grid grid-cols-[80px_repeat(auto-fit,minmax(0,1fr))]"
                      >
                        <div className="p-3 text-sm text-gray-600 border-b border-r border-gray-200 font-medium">
                          {formatTime(hour)}
                        </div>
                        {dayIndices.map((dayIdx) => (
                          <div key={dayIdx} className="relative">
                            {renderTimeSlot(dayIdx, hour)}
                            {hour === 8 && renderCurrentTimeIndicator(dayIdx)}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {filteredAppointments.length === 0 && (
              <div className="text-center py-12">
                <CalendarIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No appointments found</h3>
                <p className="text-gray-600 mb-4">
                  {searchQuery || selectedStaff !== "All Staff"
                    ? "Try adjusting your filters"
                    : "Create your first appointment to get started"}
                </p>
                <Button onClick={() => handleCreateAppointment()}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Appointment
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Floating Action Button */}
        <Button
          size="lg"
          onClick={() => handleCreateAppointment()}
          className="fixed bottom-8 right-8 rounded-full w-14 h-14 shadow-lg hover:shadow-xl transition-shadow"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Dialogs */}
      <AppointmentDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        appointment={selectedAppointment}
        mode={dialogMode}
        onSave={handleSaveAppointment}
        onDelete={handleDeleteAppointment}
        availableStaff={AVAILABLE_STAFF.filter((s) => s !== "All Staff")}
        availableServices={AVAILABLE_SERVICES}
        selectedDay={dialogDay}
        selectedTime={dialogTime}
      />

      <KeyboardShortcutsHelp open={shortcutsOpen} onOpenChange={setShortcutsOpen} />
    </div>
  )
}

