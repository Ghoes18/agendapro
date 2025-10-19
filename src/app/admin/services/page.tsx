"use client"

import { useState } from "react"
import { MoreHorizontal, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type Service = {
  id: string
  name: string
  duration: string
  price: string
}

const initialServices: Service[] = [
  { id: "1", name: "Haircut", duration: "45 min", price: "$90.00" },
  { id: "2", name: "Hair Coloring", duration: "1 hour 30 min", price: "$150.00" },
  { id: "3", name: "Manicure", duration: "30 min", price: "$45.00" },
  { id: "4", name: "Pedicure", duration: "45 min", price: "$60.00" },
  { id: "5", name: "Facial Treatment", duration: "1 hour", price: "$120.00" },
]

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    duration: "",
    price: "",
  })

  const handleAddNew = () => {
    setEditingService(null)
    setFormData({ name: "", duration: "", price: "" })
    setIsDialogOpen(true)
  }

  const handleEdit = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      duration: service.duration,
      price: service.price,
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setServices(services.filter((s) => s.id !== id))
  }

  const handleSave = () => {
    if (editingService) {
      // Update existing service
      setServices(
        services.map((s) =>
          s.id === editingService.id
            ? { ...s, name: formData.name, duration: formData.duration, price: formData.price }
            : s,
        ),
      )
    } else {
      // Add new service
      const newService: Service = {
        id: `service-${services.length + 1}`,
        name: formData.name,
        duration: formData.duration,
        price: formData.price,
      }
      setServices([...services, newService])
    }
    setIsDialogOpen(false)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleAddNew}>
          <Plus className="mr-2 h-4 w-4" />
          Add New Service
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Service Name</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Price</TableHead>
              <TableHead className="w-[70px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow key={service.id}>
                <TableCell className="font-medium">{service.name}</TableCell>
                <TableCell>{service.duration}</TableCell>
                <TableCell>{service.price}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(service)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(service.id)} className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit Service" : "Add New Service"}</DialogTitle>
            <DialogDescription>
              {editingService ? "Update the service details below." : "Enter the details for the new service."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Service Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Haircut"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="duration">Duration</Label>
              <Select
                value={formData.duration}
                onValueChange={(value) => setFormData({ ...formData, duration: value })}
              >
                <SelectTrigger id="duration">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15 min">15 min</SelectItem>
                  <SelectItem value="30 min">30 min</SelectItem>
                  <SelectItem value="45 min">45 min</SelectItem>
                  <SelectItem value="1 hour">1 hour</SelectItem>
                  <SelectItem value="1 hour 30 min">1 hour 30 min</SelectItem>
                  <SelectItem value="2 hours">2 hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input
                  id="price"
                  value={formData.price.replace("$", "")}
                  onChange={(e) => setFormData({ ...formData, price: `$${e.target.value.replace("$", "")}` })}
                  placeholder="0.00"
                  className="pl-7"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>Save Service</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
