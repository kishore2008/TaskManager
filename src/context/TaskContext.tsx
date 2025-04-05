
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Task, Category, TasksState, Priority } from '@/types';
import { useAuth } from './AuthContext';

interface TaskContextType extends TasksState {
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'userId'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleTaskCompletion: (id: string) => void;
  addCategory: (name: string, color: string) => void;
  deleteCategory: (id: string) => void;
  getTasksByCategory: (categoryId: string) => Task[];
  getTasksByStatus: (completed: boolean) => Task[];
  searchTasks: (query: string) => Task[];
}

// Default categories
const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: 'Work', color: '#3b82f6' },
  { id: '2', name: 'Personal', color: '#8b5cf6' },
  { id: '3', name: 'Shopping', color: '#ec4899' },
  { id: '4', name: 'Health', color: '#10b981' }
];

// Sample tasks
const SAMPLE_TASKS: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Finish the draft by end of day',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'high',
    categoryId: '1',
    userId: '1'
  },
  {
    id: '2',
    title: 'Buy groceries',
    description: 'Milk, eggs, bread, fruits',
    completed: true,
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'medium',
    categoryId: '3',
    userId: '1'
  },
  {
    id: '3',
    title: 'Morning workout',
    description: '30 minutes cardio',
    completed: false,
    createdAt: new Date().toISOString(),
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
    priority: 'low',
    categoryId: '4',
    userId: '1'
  }
];

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [state, setState] = useState<TasksState>({
    tasks: [],
    categories: [],
    isLoading: true,
    error: null
  });

  // Load initial data
  useEffect(() => {
    if (user) {
      try {
        // Try to load from localStorage
        const storedTasks = localStorage.getItem('taskkeeper-tasks');
        const storedCategories = localStorage.getItem('taskkeeper-categories');
        
        setState({
          tasks: storedTasks ? JSON.parse(storedTasks) : SAMPLE_TASKS,
          categories: storedCategories ? JSON.parse(storedCategories) : DEFAULT_CATEGORIES,
          isLoading: false,
          error: null
        });
      } catch (error) {
        setState({
          tasks: SAMPLE_TASKS,
          categories: DEFAULT_CATEGORIES,
          isLoading: false,
          error: 'Failed to load data'
        });
      }
    } else {
      setState({
        tasks: [],
        categories: [],
        isLoading: false,
        error: null
      });
    }
  }, [user]);

  // Save to localStorage whenever tasks or categories change
  useEffect(() => {
    if (user && !state.isLoading) {
      localStorage.setItem('taskkeeper-tasks', JSON.stringify(state.tasks));
      localStorage.setItem('taskkeeper-categories', JSON.stringify(state.categories));
    }
  }, [state.tasks, state.categories, user, state.isLoading]);

  const addTask = (task: Omit<Task, 'id' | 'createdAt' | 'userId'>) => {
    if (!user) return;
    
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      userId: user.id
    };
    
    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
    
    toast({
      title: "Task added",
      description: "Your new task has been created."
    });
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    }));
    
    toast({
      title: "Task updated",
      description: "Your task has been updated."
    });
  };

  const deleteTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(task => task.id !== id)
    }));
    
    toast({
      title: "Task deleted",
      description: "Your task has been removed."
    });
  };

  const toggleTaskCompletion = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    }));
    
    const task = state.tasks.find(t => t.id === id);
    
    toast({
      title: task?.completed ? "Task marked as incomplete" : "Task completed",
      description: task?.title
    });
  };

  const addCategory = (name: string, color: string) => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name,
      color
    };
    
    setState(prev => ({
      ...prev,
      categories: [...prev.categories, newCategory]
    }));
    
    toast({
      title: "Category added",
      description: `${name} category has been created.`
    });
  };

  const deleteCategory = (id: string) => {
    // Check if there are tasks with this category
    const tasksWithCategory = state.tasks.filter(task => task.categoryId === id);
    
    if (tasksWithCategory.length > 0) {
      toast({
        variant: "destructive",
        title: "Cannot delete category",
        description: "This category has associated tasks. Please reassign or delete these tasks first."
      });
      return;
    }
    
    setState(prev => ({
      ...prev,
      categories: prev.categories.filter(category => category.id !== id)
    }));
    
    toast({
      title: "Category deleted",
      description: "The category has been removed."
    });
  };

  const getTasksByCategory = (categoryId: string) => {
    return state.tasks.filter(task => task.categoryId === categoryId);
  };

  const getTasksByStatus = (completed: boolean) => {
    return state.tasks.filter(task => task.completed === completed);
  };

  const searchTasks = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return state.tasks.filter(task => 
      task.title.toLowerCase().includes(lowercaseQuery) || 
      task.description.toLowerCase().includes(lowercaseQuery)
    );
  };

  return (
    <TaskContext.Provider value={{
      ...state,
      addTask,
      updateTask,
      deleteTask,
      toggleTaskCompletion,
      addCategory,
      deleteCategory,
      getTasksByCategory,
      getTasksByStatus,
      searchTasks
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
