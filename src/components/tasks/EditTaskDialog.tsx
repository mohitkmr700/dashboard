"use client";

import { useState, useEffect } from 'react';
import { Task } from '@/types/task';
import { updateTask } from '@/api/tasks';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { DateTimeInput } from "@/components/ui/datetime-input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface EditTaskDialogProps {
  task: Task | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTaskUpdated: () => void;
}

export default function EditTaskDialog({
  task,
  open,
  onOpenChange,
  onTaskUpdated,
}: EditTaskDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Task>>({
    title: '',
    description: '',
    progress: 0,
    deadline: '',
    is_done: false,
    email: 'mohit2010sm@gmail.com',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        ...task,
        deadline: new Date(task.deadline).toISOString().slice(0, 16),
      });
    }
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task) return;

    try {
      const deadlineDate = new Date(formData.deadline!);
      const completedAt = formData.is_done ? new Date().toISOString() : null;

      const updatedTask = {
        ...task,
        ...formData,
        deadline: deadlineDate.toISOString(),
        completed_at: completedAt,
      };

      await updateTask(updatedTask);
      toast({
        variant: "success",
        title: "Success",
        description: "Task updated successfully.",
      });
      onTaskUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error('Error updating task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update task. Please try again.",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="progress">Progress</Label>
            <Input
              id="progress"
              name="progress"
              type="number"
              min="0"
              max="100"
              value={formData.progress?.toString() ?? '0'}
              onChange={(e) => {
                const value = e.target.value === '' ? 0 : parseInt(e.target.value);
                setFormData({ ...formData, progress: value });
              }}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="deadline">Deadline</Label>
            <DateTimeInput
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              required
              min={new Date().toISOString().slice(0, 16)}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_done"
              checked={formData.is_done}
              onCheckedChange={(checked) => setFormData({ ...formData, is_done: checked })}
            />
            <Label htmlFor="is_done">Mark as completed</Label>
          </div>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 