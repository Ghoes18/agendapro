"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Appointment, AppointmentStatus } from "@/types/appointment"
import { Clock, User, Briefcase, Phone, Mail, FileText } from "lucide-react"

type AppointmentDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  appointment: Appointment | null
  mode: "view" | "edit" | "create"
  onSave: (appointment: Appointment) => void
  onDelete: (id: string) => void
  availableStaff: string[]
  availableServices: { name: string; duration: number }[]
  selectedDay?: number
  selectedTime?: number
}

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

export function AppointmentDialog({
  open,
  onOpenChange,
  appointment,
  mode: initialMode,
  onSave,
  onDelete,
  availableStaff,
  availableServices,
  selectedDay,
  selectedTime,
}: AppointmentDialogProps) {
  const [mode, setMode] = useState<"view" | "edit" | "create">(initialMode)
  const [formData, setFormData] = useState<Partial<Appointment>>({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    setMode(initialMode)
  }, [initialMode])

  useEffect(() => {
    if (mode === "create") {
      setFormData({
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        serviceName: availableServices[0]?.name || "",
        staffMember: availableStaff[0] || "",
        day: selectedDay ?? 0,
        startTime: selectedTime ?? 9,
        duration: availableServices[0]?.duration || 1,
        status: "confirmed",
        notes: "",
      })
    } else if (appointment) {
      setFormData(appointment)
    }
  }, [appointment, mode, availableStaff, availableServices, selectedDay, selectedTime])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mode === "view") return

    const appointmentToSave: Appointment = {
      id: appointment?.id || crypto.randomUUID(),
      clientName: formData.clientName || "",
      clientEmail: formData.clientEmail,
      clientPhone: formData.clientPhone,
      serviceName: formData.serviceName || "",
      staffMember: formData.staffMember || "",
      day: formData.day ?? 0,
      startTime: formData.startTime ?? 9,
      duration: formData.duration ?? 1,
      color: formData.color || "bg-blue-100 border-blue-300 text-blue-900",
      status: formData.status || "confirmed",
      notes: formData.notes,
    }

    onSave(appointmentToSave)
    onOpenChange(false)
    setMode(initialMode)
  }

  const handleDelete = () => {
    if (appointment?.id) {
      onDelete(appointment.id)
      onOpenChange(false)
      setShowDeleteConfirm(false)
    }
  }

  const formatTime = (hour: number) => {
    if (hour === 12) return "12:00 PM"
    if (hour > 12) return `${hour - 12}:00 PM`
    return `${hour}:00 AM`
  }

  const formatDuration = (duration: number) => {
    const hours = Math.floor(duration)
    const minutes = Math.round((duration - hours) * 60)
    
    if (hours === 0) {
      return `${minutes} minutes`
    } else if (minutes === 0) {
      return hours === 1 ? "1 hour" : `${hours} hours`
    } else {
      const hourText = hours === 1 ? "hour" : "hours"
      return `${hours} ${hourText} ${minutes} minutes`
    }
  }

  const getStatusColor = (status: AppointmentStatus) => {
    switch (status) {
      case "confirmed":
        return "text-green-600"
      case "pending":
        return "text-yellow-600"
      case "completed":
        return "text-blue-600"
      case "cancelled":
        return "text-red-600"
    }
  }

  if (showDeleteConfirm) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this appointment with {appointment?.clientName}? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "New Appointment" : mode === "edit" ? "Edit Appointment" : "Appointment Details"}
          </DialogTitle>
          {mode === "view" && appointment && (
            <DialogDescription className="flex items-center gap-2">
              <span className={getStatusColor(appointment.status)}>
                {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
              </span>
            </DialogDescription>
          )}
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {mode === "view" ? (
              <>
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Client</p>
                    <p className="text-sm text-muted-foreground">{appointment?.clientName}</p>
                    {appointment?.clientEmail && (
                      <p className="text-sm text-muted-foreground">{appointment.clientEmail}</p>
                    )}
                    {appointment?.clientPhone && (
                      <p className="text-sm text-muted-foreground">{appointment.clientPhone}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Service</p>
                    <p className="text-sm text-muted-foreground">{appointment?.serviceName}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Staff Member</p>
                    <p className="text-sm text-muted-foreground">{appointment?.staffMember}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Date & Time</p>
                    <p className="text-sm text-muted-foreground">
                      {appointment && daysOfWeek[appointment.day]} at {appointment && formatTime(appointment.startTime)}
                    </p>
                    <p className="text-sm text-muted-foreground">Duration: {appointment && formatDuration(appointment.duration)}</p>
                  </div>
                </div>

                {appointment?.notes && (
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Notes</p>
                      <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="clientName">Client Name *</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName || ""}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="clientEmail">Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={formData.clientEmail || ""}
                      onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="clientPhone">Phone</Label>
                    <Input
                      id="clientPhone"
                      type="tel"
                      value={formData.clientPhone || ""}
                      onChange={(e) => setFormData({ ...formData, clientPhone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="service">Service *</Label>
                  <Select
                    value={formData.serviceName || ""}
                    onValueChange={(value) => {
                      const service = availableServices.find((s) => s.name === value)
                      setFormData({
                        ...formData,
                        serviceName: value,
                        duration: service?.duration || 1,
                      })
                    }}
                  >
                    <SelectTrigger id="service">
                      <SelectValue placeholder="Select service" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableServices.map((service) => (
                        <SelectItem key={service.name} value={service.name}>
                          {service.name} ({formatDuration(service.duration)})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="staff">Staff Member *</Label>
                  <Select
                    value={formData.staffMember || ""}
                    onValueChange={(value) => setFormData({ ...formData, staffMember: value })}
                  >
                    <SelectTrigger id="staff">
                      <SelectValue placeholder="Select staff" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableStaff.map((staff) => (
                        <SelectItem key={staff} value={staff}>
                          {staff}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="day">Day *</Label>
                    <Select
                      value={formData.day?.toString() || "0"}
                      onValueChange={(value) => setFormData({ ...formData, day: parseInt(value) })}
                    >
                      <SelectTrigger id="day">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {daysOfWeek.map((day, index) => (
                          <SelectItem key={index} value={index.toString()}>
                            {day}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Time *</Label>
                    <Select
                      value={formData.startTime?.toString() || "9"}
                      onValueChange={(value) => setFormData({ ...formData, startTime: parseInt(value) })}
                    >
                      <SelectTrigger id="time">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 13 }, (_, i) => i + 8).map((hour) => (
                          <SelectItem key={hour} value={hour.toString()}>
                            {formatTime(hour)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status || "confirmed"}
                    onValueChange={(value) => setFormData({ ...formData, status: value as AppointmentStatus })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="confirmed">Confirmed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Notes</Label>
                  <Input
                    id="notes"
                    value={formData.notes || ""}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Add any additional notes..."
                  />
                </div>
              </>
            )}
          </div>

          <DialogFooter className="gap-2">
            {mode === "view" ? (
              <>
                <Button type="button" variant="outline" onClick={() => setMode("edit")}>
                  Edit
                </Button>
                <Button type="button" variant="destructive" onClick={() => setShowDeleteConfirm(true)}>
                  Delete
                </Button>
              </>
            ) : (
              <>
                {mode === "edit" && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="mr-auto"
                  >
                    Delete
                  </Button>
                )}
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

