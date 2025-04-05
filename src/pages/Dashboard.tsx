
import React from 'react';
import { useTasks } from '@/context/TaskContext';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TaskCard } from '@/components/Tasks/TaskCard';
import { CheckCircle, Circle, AlertTriangle, CalendarClock } from 'lucide-react';
import { format, isAfter, isBefore, addDays } from 'date-fns';
import { Task } from '@/types';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { tasks, categories, toggleTaskCompletion, deleteTask } = useTasks();
  
  // Dashboard stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  // High priority tasks
  const highPriorityTasks = tasks.filter(task => task.priority === 'high' && !task.completed);
  
  // Upcoming tasks (due in the next 7 days)
  const today = new Date();
  const nextWeek = addDays(today, 7);
  const upcomingTasks = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    const dueDate = new Date(task.dueDate);
    return isAfter(dueDate, today) && isBefore(dueDate, nextWeek);
  });
  
  // Recently completed tasks
  const recentlyCompletedTasks = [...tasks]
    .filter(task => task.completed)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);
  
  // Function to get category by ID
  const getCategoryById = (categoryId: string) => {
    return categories.find(category => category.id === categoryId) || {
      id: '',
      name: 'Uncategorized',
      color: '#888888'
    };
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome, {user?.name}!
        </h1>
        <p className="text-gray-600">
          Here's an overview of your tasks
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Tasks</CardTitle>
            <CardDescription>All your tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalTasks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Completed</CardTitle>
            <CardDescription>Tasks you've finished</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{completedTasks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pending</CardTitle>
            <CardDescription>Tasks still to do</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{pendingTasks}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Progress</CardTitle>
            <CardDescription>Task completion rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold mb-2">{completionRate}%</div>
            <Progress value={completionRate} className="h-2" />
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            High Priority Tasks
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-4">
            {highPriorityTasks.length > 0 ? (
              <div className="space-y-3">
                {highPriorityTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    category={getCategoryById(task.categoryId)}
                    onComplete={toggleTaskCompletion}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 py-4 text-center">No high priority tasks.</p>
            )}
          </div>
        </div>
        
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <CalendarClock className="h-5 w-5 text-blue-500 mr-2" />
            Upcoming Tasks
          </h2>
          <div className="bg-white rounded-lg shadow-sm p-4">
            {upcomingTasks.length > 0 ? (
              <div className="space-y-3">
                {upcomingTasks.map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    category={getCategoryById(task.categoryId)}
                    onComplete={toggleTaskCompletion}
                    onDelete={deleteTask}
                  />
                ))}
              </div>
            ) : (
              <p className="text-gray-500 py-4 text-center">No upcoming tasks due in the next 7 days.</p>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          Recently Completed
        </h2>
        <div className="bg-white rounded-lg shadow-sm p-4">
          {recentlyCompletedTasks.length > 0 ? (
            <div className="space-y-3">
              {recentlyCompletedTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  category={getCategoryById(task.categoryId)}
                  onComplete={toggleTaskCompletion}
                  onDelete={deleteTask}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500 py-4 text-center">No completed tasks yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
