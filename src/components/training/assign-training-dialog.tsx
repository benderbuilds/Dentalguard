'use client'

import { useState } from 'react'
import { trpc } from '@/lib/trpc/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'

interface AssignTrainingDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  preselectedUserId?: string
  onSuccess?: () => void
}

export function AssignTrainingDialog({
  open,
  onOpenChange,
  preselectedUserId,
  onSuccess,
}: AssignTrainingDialogProps) {
  const [selectedUserId, setSelectedUserId] = useState(preselectedUserId || '')
  const [selectedModuleId, setSelectedModuleId] = useState('')
  const [dueDate, setDueDate] = useState('')
  const { toast } = useToast()

  const { data: employees } = trpc.employees.list.useQuery(
    { includeInactive: false },
    { enabled: open && !preselectedUserId }
  )

  const { data: modules } = trpc.training.listModules.useQuery(
    {},
    { enabled: open }
  )

  const assignTraining = trpc.training.assignTraining.useMutation({
    onSuccess: () => {
      toast({
        title: 'Training assigned',
        description: 'The training module has been assigned successfully.',
      })
      onOpenChange(false)
      resetForm()
      onSuccess?.()
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message,
      })
    },
  })

  function resetForm() {
    if (!preselectedUserId) setSelectedUserId('')
    setSelectedModuleId('')
    setDueDate('')
  }

  function handleSubmit() {
    const userId = preselectedUserId || selectedUserId
    if (!userId || !selectedModuleId || !dueDate) {
      toast({
        variant: 'destructive',
        title: 'Missing fields',
        description: 'Please fill in all required fields.',
      })
      return
    }

    assignTraining.mutate({
      userId,
      moduleId: selectedModuleId,
      dueDate,
    })
  }

  // Default due date to 30 days from now
  const defaultMinDate = new Date().toISOString().split('T')[0]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign Training</DialogTitle>
          <DialogDescription>
            Assign a compliance training module to an employee.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Employee Selector — hidden when preselected */}
          {!preselectedUserId && (
            <div className="space-y-2">
              <Label>Employee</Label>
              <Select value={selectedUserId} onValueChange={setSelectedUserId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an employee" />
                </SelectTrigger>
                <SelectContent>
                  {employees?.map((emp) => (
                    <SelectItem key={emp.id} value={emp.id}>
                      {emp.name} ({emp.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Training Module Selector */}
          <div className="space-y-2">
            <Label>Training Module</Label>
            <Select value={selectedModuleId} onValueChange={setSelectedModuleId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a training module" />
              </SelectTrigger>
              <SelectContent>
                {modules?.map((mod) => (
                  <SelectItem key={mod.id} value={mod.id}>
                    {mod.title} ({mod.type.toUpperCase()})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Due Date */}
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input
              type="date"
              value={dueDate}
              min={defaultMinDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={assignTraining.isPending}
          >
            {assignTraining.isPending ? 'Assigning...' : 'Assign Training'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
