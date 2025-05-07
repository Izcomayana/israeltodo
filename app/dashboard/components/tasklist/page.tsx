"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, Trash2, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";

interface Task {
  id: string;
  title: string;
  dueDate: Date;
  createdAt: Date;
  completed: boolean;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskOpen, setNewTaskOpen] = useState(false);
  const [taskDetailsOpen, setTaskDetailsOpen] = useState(false);
  const [newTask, setNewTask] = useState("");
  const [newTaskDueDate, setNewTaskDueDate] = useState<Date | undefined>(
    undefined,
  );
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks");
    if (savedTasks) {
      try {
        // Parse the JSON and convert date strings back to Date objects
        const parsedTasks = JSON.parse(savedTasks).map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate),
          createdAt: new Date(task.createdAt),
        }));
        setTasks(parsedTasks);
      } catch (error) {
        console.error("Failed to parse tasks from localStorage:", error);
      }
    }
  }, []);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (newTask.trim() === "") return;

    const task: Task = {
      id: Date.now().toString(),
      title: newTask,
      dueDate: newTaskDueDate || new Date(),
      createdAt: new Date(),
      completed: false,
    };

    // Add new task to the beginning of the array
    setTasks([task, ...tasks]);
    setNewTask("");
    setNewTaskDueDate(undefined);
    setNewTaskOpen(false);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const clearCompletedTasks = () => {
    setTasks(tasks.filter((task) => !task.completed));
  };

  const openTaskDetails = (task: Task) => {
    setSelectedTask(task);
    setEditedTask({
      title: task.title,
      dueDate: task.dueDate,
    });
    setTaskDetailsOpen(true);
  };

  const updateTask = () => {
    if (!selectedTask || !editedTask.title) return;

    setTasks(
      tasks.map((task) =>
        task.id === selectedTask.id
          ? {
              ...task,
              title: editedTask.title || task.title,
              dueDate: editedTask.dueDate || task.dueDate,
            }
          : task,
      ),
    );
    setTaskDetailsOpen(false);
  };

  const deleteTask = () => {
    if (!selectedTask) return;
    setTasks(tasks.filter((task) => task.id !== selectedTask.id));
    setTaskDetailsOpen(false);
  };

  return (
    <Card className="w-full max-w-md mx-auto py-0 border-0 rounded-lg shadow-lg my-5 bg-white">
      <CardContent className="p-0">
        <div className="border rounded-md">
          <div className="flex items-center justify-between p-6">
            <h3 className="text-sm font-semibold">Daily Task</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setNewTaskOpen(true)}
              className="text-[#50C2C9] hover:text-[#50c3c9c7] font-bold cursor-pointer"
            >
              <svg
                className="!w-8 !h-8"
                stroke="currentColor"
                fill="#50C2C9"
                stroke-width="0"
                viewBox="0 0 512 512"
                height="8em"
                width="8em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M416 277.333H277.333V416h-42.666V277.333H96v-42.666h138.667V96h42.666v138.667H416v42.666z"></path>
              </svg>
              <span className="sr-only">Add task</span>
            </Button>
          </div>

          <ScrollArea className="h-72">
            <div className="p-4">
              {tasks.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No tasks yet. Add one to get started!
                </p>
              ) : (
                tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center space-x-2 py-2 hover:bg-slate-50 px-2 rounded"
                    onClick={() => toggleTaskCompletion(task.id)}
                  >
                    <Checkbox
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onCheckedChange={() => toggleTaskCompletion(task.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="h-5 w-5 border-gray-400 data-[state=checked]:bg-teal-500 data-[state=checked]:border-teal-500"
                    />
                    <label
                      htmlFor={`task-${task.id}`}
                      className={cn(
                        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex-1",
                        task.completed && "line-through text-muted-foreground",
                      )}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {task.title} by {format(task.dueDate, "h:mma")}
                    </label>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0 text-muted-foreground"
                      onClick={(e) => {
                        e.stopPropagation();
                        openTaskDetails(task);
                      }}
                    >
                      <MoreVertical className="h-4 w-4" />
                      <span className="sr-only">Open task menu</span>
                    </Button>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>

          <div className="p-4 border-t">
            <Button
              variant="outline"
              className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
              onClick={clearCompletedTasks}
              disabled={!tasks.some((task) => task.completed)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear completed tasks
            </Button>
          </div>
        </div>
      </CardContent>

      {/* Add Task Modal */}
      <Dialog open={newTaskOpen} onOpenChange={setNewTaskOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
            <DialogDescription>
              Create a new task with a title and due date.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="task">Task</Label>
              <Input
                id="task"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Enter your task"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="due-date">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !newTaskDueDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {newTaskDueDate
                      ? format(newTaskDueDate, "PPP p")
                      : "Select date and time"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={newTaskDueDate}
                    onSelect={setNewTaskDueDate}
                    initialFocus
                  />
                  <div className="p-3 border-t">
                    <Label htmlFor="time">Time</Label>
                    <Input
                      id="time"
                      type="time"
                      className="mt-1"
                      onChange={(e) => {
                        const [hours, minutes] = e.target.value
                          .split(":")
                          .map(Number);
                        const date = newTaskDueDate || new Date();
                        date.setHours(hours, minutes);
                        setNewTaskDueDate(new Date(date));
                      }}
                    />
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewTaskOpen(false)}>
              Cancel
            </Button>
            <Button onClick={addTask}>Add Task</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Details Modal */}
      <Dialog open={taskDetailsOpen} onOpenChange={setTaskDetailsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-task">Task</Label>
                <Input
                  id="edit-task"
                  value={editedTask.title || ""}
                  onChange={(e) =>
                    setEditedTask({ ...editedTask, title: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label>Created At</Label>
                <div className="p-2 border rounded-md bg-muted">
                  {format(selectedTask.createdAt, "PPP p")}
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-due-date">Due Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {editedTask.dueDate
                        ? format(editedTask.dueDate, "PPP p")
                        : "Select date and time"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={editedTask.dueDate}
                      onSelect={(date) =>
                        setEditedTask({ ...editedTask, dueDate: date })
                      }
                      initialFocus
                    />
                    <div className="p-3 border-t">
                      <Label htmlFor="edit-time">Time</Label>
                      <Input
                        id="edit-time"
                        type="time"
                        className="mt-1"
                        defaultValue={
                          editedTask.dueDate
                            ? `${editedTask.dueDate.getHours().toString().padStart(2, "0")}:${editedTask.dueDate.getMinutes().toString().padStart(2, "0")}`
                            : ""
                        }
                        onChange={(e) => {
                          const [hours, minutes] = e.target.value
                            .split(":")
                            .map(Number);
                          const date = editedTask.dueDate || new Date();
                          date.setHours(hours, minutes);
                          setEditedTask({
                            ...editedTask,
                            dueDate: new Date(date),
                          });
                        }}
                      />
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}
          <DialogFooter className="flex justify-between">
            <Button variant="destructive" onClick={deleteTask}>
              Delete
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setTaskDetailsOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={updateTask}>Save Changes</Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
