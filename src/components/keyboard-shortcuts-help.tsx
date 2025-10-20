"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Keyboard } from "lucide-react"

type KeyboardShortcutsHelpProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function KeyboardShortcutsHelp({ open, onOpenChange }: KeyboardShortcutsHelpProps) {
  const shortcuts = [
    { key: "Cmd/Ctrl + N", description: "Create new appointment" },
    { key: "D", description: "Switch to day view" },
    { key: "W", description: "Switch to week view" },
    { key: "M", description: "Switch to month view" },
    { key: "T", description: "Go to today" },
    { key: "←", description: "Previous week/month" },
    { key: "→", description: "Next week/month" },
    { key: "?", description: "Show keyboard shortcuts" },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Keyboard className="h-5 w-5" />
            Keyboard Shortcuts
          </DialogTitle>
          <DialogDescription>Quick access to calendar features</DialogDescription>
        </DialogHeader>
        <div className="space-y-2 py-4">
          {shortcuts.map((shortcut, index) => (
            <div key={index} className="flex items-center justify-between py-2 px-3 rounded-md hover:bg-muted/50">
              <span className="text-sm text-muted-foreground">{shortcut.description}</span>
              <kbd className="px-2 py-1 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-md">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}

