"use client";
import { useEffect, useState } from 'react';
import Table from '@/components/common/Table';
import { Task, TableColumn, TasksResponse } from '@/types/task';
import { getTasks, deleteTask } from '@/api/tasks';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';
import CreateTaskDialog from '@/components/tasks/CreateTaskDialog';
import EditTaskDialog from '@/components/tasks/EditTaskDialog';
import { Check, X, Trash2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const { toast } = useToast();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    inProgress: 0,
    averageProgress: 0,
    upcomingDeadlines: 0,
    progressData: [] as { date: string; value: number }[],
    completionData: [] as { date: string; value: number }[],
    deadlineData: [] as { date: string; value: number }[]
  });

  const fetchTasks = async () => {
    try {
      const response = await getTasks('mohit2010sm@gmail.com');
      const tasksData = response.data;
      setTasks(tasksData);
      
      // Calculate statistics
      const now = new Date();
      const progressData = tasksData.map((task: Task) => ({
        date: new Date(task.created).toLocaleDateString(),
        value: task.progress
      }));

      const completionData = tasksData.map((task: Task) => ({
        date: new Date(task.created).toLocaleDateString(),
        value: task.is_done ? 100 : 0
      }));

      const deadlineData = tasksData.map((task: Task) => ({
        date: new Date(task.deadline).toLocaleDateString(),
        value: task.is_done ? 0 : 100
      }));

      const stats = {
        total: tasksData.length,
        pending: tasksData.filter((task: Task) => !task.is_done && task.progress === 0).length,
        completed: tasksData.filter((task: Task) => task.is_done).length,
        inProgress: tasksData.filter((task: Task) => !task.is_done && task.progress > 0).length,
        averageProgress: Math.round(
          tasksData.reduce((acc: number, task: Task) => acc + task.progress, 0) / tasksData.length
        ),
        upcomingDeadlines: tasksData.filter((task: Task) => {
          const deadline = new Date(task.deadline);
          return !task.is_done && deadline > now;
        }).length,
        progressData,
        completionData,
        deadlineData
      };
      setStats(stats);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch tasks. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (task: Task) => {
    setTaskToDelete(task);
    setDeleteDialogOpen(true);
  };

  const handleEditClick = (task: Task) => {
    setTaskToEdit(task);
    setEditDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!taskToDelete) return;

    try {
      await deleteTask(taskToDelete.id);
      await fetchTasks(); // Refresh the task list
      toast({
        variant: "success",
        title: "Success",
        description: "Task deleted successfully.",
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete task. Please try again.",
      });
    } finally {
      setDeleteDialogOpen(false);
      setTaskToDelete(null);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTaskStatus = (task: Task) => {
    const now = new Date();
    const deadline = new Date(task.deadline);
    const isOverdue = !task.is_done && deadline < now;
    const isUrgent = !task.is_done && deadline.getTime() - now.getTime() < 24 * 60 * 60 * 1000; // 24 hours

    if (task.is_done) {
      return {
        text: 'Completed',
        className: 'bg-green-500 text-white dark:bg-green-400 dark:text-black shadow-[0_0_8px_rgba(34,197,94,0.5)]'
      };
    }
    if (isOverdue) {
      return {
        text: 'Overdue',
        className: 'bg-red-500 text-white dark:bg-red-400 dark:text-black shadow-[0_0_8px_rgba(239,68,68,0.5)]'
      };
    }
    if (isUrgent) {
      return {
        text: 'Urgent',
        className: 'bg-red-500 text-white dark:bg-red-400 dark:text-black shadow-[0_0_8px_rgba(239,68,68,0.5)]'
      };
    }
    if (task.progress > 0) {
      return {
        text: 'In Progress',
        className: 'bg-blue-500 text-white dark:bg-blue-400 dark:text-black shadow-[0_0_8px_rgba(59,130,246,0.5)] whitespace-nowrap'
      };
    }
    return {
      text: 'Pending',
      className: 'bg-yellow-500 text-white dark:bg-yellow-400 dark:text-black shadow-[0_0_8px_rgba(234,179,8,0.5)]'
    };
  };

  const columns: TableColumn<Task>[] = [
    { 
      header: 'Title', 
      accessor: 'title',
      render: (value, task: Task) => (
        <button
          onClick={() => handleEditClick(task)}
          className="text-left hover:text-primary transition-colors"
        >
          {value as string}
        </button>
      ),
    },
    { 
      header: 'Status', 
      accessor: 'is_done',
      render: (value, task: Task) => {
        const status = getTaskStatus(task);
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${status.className}`}>
            {status.text}
          </span>
        );
      }
    },
    { 
      header: 'Progress', 
      accessor: 'progress',
      render: (value, task: Task) => {
        const status = getTaskStatus(task);
        const progressColor = status.text === 'Completed' 
          ? 'bg-green-500' 
          : status.text === 'Overdue' || status.text === 'Urgent'
            ? 'bg-red-500'
            : status.text === 'In Progress'
              ? 'bg-green-500'
              : 'bg-yellow-500';
        
        return (
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2.5">
            <div 
              className={`${progressColor} h-2.5 rounded-full transition-all duration-300`}
              style={{ width: `${(value as number) ?? 0}%` }}
            ></div>
          </div>
        );
      }
    },
    { 
      header: 'Deadline', 
      accessor: 'deadline',
      render: (value) => formatDate(value as string ?? '')
    },
    { header: 'Description', accessor: 'description' },
    { 
      header: 'Created', 
      accessor: 'created',
      render: (value) => formatDate(value as string ?? '')
    },
    { 
      header: 'Updated', 
      accessor: 'updated',
      render: (value) => formatDate(value as string ?? '')
    },
    { 
      header: 'Completed', 
      accessor: 'completed_at',
      render: (value) => {
        if (!value) {
          return (
            <div className="flex items-center justify-center">
              <X className="w-4 h-4 text-red-500 dark:text-red-400" />
            </div>
          );
        }
        return (
          <div className="flex items-center text-green-500 dark:text-green-400">
            <Check className="w-4 h-4 mr-1" />
            <span className="text-xs">{formatDate(value as string)}</span>
          </div>
        );
      }
    },
    {
      header: 'Actions',
      accessor: 'id',
      render: (value, task: Task) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
            onClick={() => handleEditClick(task)}
          >
            <Pencil className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
            onClick={() => handleDeleteClick(task)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <CreateTaskDialog onTaskCreated={() => {
          fetchTasks();
          toast({
            variant: "success",
            title: "Success",
            description: "Task created successfully.",
          });
        }} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Tasks</h3>
          <p className="text-2xl font-bold">{stats.total}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Completed</h3>
          <p className="text-2xl font-bold text-green-500 dark:text-green-400">{stats.completed}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">In Progress</h3>
          <p className="text-2xl font-bold text-green-500 dark:text-green-400">{stats.inProgress}</p>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending</h3>
          <p className="text-2xl font-bold text-yellow-500 dark:text-yellow-400">{stats.pending}</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Progress Over Time</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.progressData}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  fill="#8884d8"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-4">Completion Rate</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.completionData}>
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#82ca9d"
                  fill="#82ca9d"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tasks Table */}
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow">
        <Table
          data={tasks}
          columns={columns}
          isLoading={isLoading}
        />
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task
              {taskToDelete && ` "${taskToDelete.title}"`}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Task Dialog */}
      <EditTaskDialog
        task={taskToEdit}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onTaskUpdated={fetchTasks}
      />
    </div>
  );
} 