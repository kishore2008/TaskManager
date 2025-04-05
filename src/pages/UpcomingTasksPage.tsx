
import React from 'react';
import { useTasks } from '@/context/TaskContext';
import { TaskCard } from '@/components/Tasks/TaskCard';
import { format, isAfter, addDays, parseISO, isBefore } from 'date-fns';
import { Calendar } from 'lucide-react';

const UpcomingTasksPage: React.FC = () => {
  const { tasks, categories, toggleTaskCompletion, deleteTask } = useTasks();
  const today = new Date();
  
  // Group tasks by due date
  const upcomingTasksByDate = tasks
    .filter(task => !task.completed && task.dueDate)
    .sort((a, b) => {
      const dateA = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
      const dateB = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
      return dateA - dateB;
    })
    .reduce((groups, task) => {
      if (!task.dueDate) return groups;
      
      const dueDate = parseISO(task.dueDate);
      let key = '';
      
      if (isBefore(dueDate, today)) {
        key = 'overdue';
      } else if (format(dueDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd')) {
        key = 'today';
      } else if (isBefore(dueDate, addDays(today, 1))) {
        key = 'tomorrow';
      } else if (isBefore(dueDate, addDays(today, 7))) {
        key = 'thisWeek';
      } else if (isBefore(dueDate, addDays(today, 30))) {
        key = 'thisMonth';
      } else {
        key = 'future';
      }
      
      if (!groups[key]) groups[key] = [];
      groups[key].push(task);
      return groups;
    }, {} as Record<string, typeof tasks>);
  
  // Find category by ID
  const getCategoryById = (categoryId: string) => {
    return categories.find(category => category.id === categoryId) || {
      id: '',
      name: 'Uncategorized',
      color: '#888888'
    };
  };
  
  // Helper function to render a section of tasks
  const renderTaskSection = (title: string, tasks: typeof upcomingTasksByDate['overdue'], color: string) => {
    if (!tasks || tasks.length === 0) return null;
    
    return (
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <Calendar className="h-5 w-5 mr-2" style={{ color }} />
          {title} <span className="ml-2 text-sm font-normal text-gray-500">({tasks.length})</span>
        </h2>
        <div className="space-y-3">
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              category={getCategoryById(task.categoryId)}
              onComplete={toggleTaskCompletion}
              onDelete={deleteTask}
            />
          ))}
        </div>
      </div>
    );
  };
  
  const hasUpcomingTasks = Object.values(upcomingTasksByDate).some(tasks => tasks && tasks.length > 0);
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Upcoming Tasks</h1>
      
      {hasUpcomingTasks ? (
        <>
          {renderTaskSection('Overdue', upcomingTasksByDate.overdue, '#ef4444')}
          {renderTaskSection('Today', upcomingTasksByDate.today, '#3b82f6')}
          {renderTaskSection('Tomorrow', upcomingTasksByDate.tomorrow, '#8b5cf6')}
          {renderTaskSection('This Week', upcomingTasksByDate.thisWeek, '#10b981')}
          {renderTaskSection('This Month', upcomingTasksByDate.thisMonth, '#f59e0b')}
          {renderTaskSection('Future', upcomingTasksByDate.future, '#64748b')}
        </>
      ) : (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-500 mb-2">No upcoming tasks</p>
          <p className="text-sm text-gray-400">
            You don't have any upcoming tasks with due dates
          </p>
        </div>
      )}
    </div>
  );
};

export default UpcomingTasksPage;
