export type AppointmentStatus = "confirmed" | "pending" | "completed" | "cancelled"

export type Appointment = {
  id: string
  clientName: string
  clientEmail?: string
  clientPhone?: string
  serviceName: string
  staffMember: string
  day: number // 0-6 for Mon-Sun
  startTime: number // hour in 24h format
  duration: number // in hours
  color: string
  status: AppointmentStatus
  notes?: string
}

export type TimeBlock = {
  id: string
  type: "break" | "meeting" | "unavailable" | "vacation"
  staffMember: string
  day: number
  startTime: number
  duration: number
  title: string
  notes?: string
}

export type CalendarEvent = Appointment | TimeBlock

export function isAppointment(event: CalendarEvent): event is Appointment {
  return "clientName" in event
}

export function isTimeBlock(event: CalendarEvent): event is TimeBlock {
  return "type" in event
}

