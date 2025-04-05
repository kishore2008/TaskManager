
import React from 'react';
import { format } from 'date-fns';
import { CheckCircle, Circle, Calendar, Clock, Edit, Trash2 } from 'lucide-react';
import { Task, Category, Priority } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogTrigger, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { EditTaskForm } from './EditTaskForm';

interface TaskCardProps {
  task: Task;
  category: Category;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case 'high':
      return 'bg-taskpriority-high/10 text-taskpriority-high border-taskpriority-high';
    case 'medium':
      return 'bg-taskpriority-medium/10 text-taskpriority-medium border-taskpriority-medium';
    case 'low':
      return 'bg-taskpriority-low/10 text-taskpriority-low border-taskpriority-low';
  }
};

export const TaskCard: React.FC<TaskCardProps> = ({ 
  task, 
  category, 
  onComplete, 
  onDelete 
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  
  const handleComplete = () => {
    onComplete(task.id);
  };
  
  const handleDelete = () => {
    onDelete(task.id);
    setDeleteDialogOpen(false);
  };
  
  const priorityText = task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
  
  return (
    <div 
      className={`task-card ${task.completed ? 'completed' : ''} task-priority-${task.priority}`}
    >
      <div className="flex justify-between">
        <div className="flex-1">
          <div className="flex items-start">
            <button 
              onClick={handleComplete}
              className="mt-0.5 mr-2 focus:outline-none"
              aria-label={task.completed ? "Mark as incomplete" : "Mark as complete"}
            >
              {task.completed ? (
                <CheckCircle className="h-5 w-5 text-green-500" />
              ) : (
                <Circle className="h-5 w-5 text-gray-400" />
              )}
            </button>
            
            <div>
              <h3 className={`font-medium text-base ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h3>
              
              <p className={`text-sm mt-1 text-gray-600 ${task.completed ? 'text-gray-400' : ''}`}>
                {task.description}
              </p>
              
              <div className="flex flex-wrap gap-2 mt-3">
                <Badge 
                  variant="outline" 
                  className="rounded-md" 
                  style={{ backgroundColor: `${category.color}20`, borderColor: category.color, color: category.color }}
                >
                  {category.name}
                </Badge>
                
                <Badge variant="outline" className={`rounded-md ${getPriorityColor(task.priority)}`}>
                  {priorityText}
                </Badge>
                
                {task.dueDate && (
                  <Badge variant="outline" className="rounded-md flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    <span>{format(new Date(task.dueDate), 'MMM d')}</span>
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-start space-x-1">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Task</DialogTitle>
              </DialogHeader>
              <EditTaskForm task={task} />
            </DialogContent>
          </Dialog>
          
          <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Trash2 className="h-4 w-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Delete Task</DialogTitle>
                <DialogDescription>
                  Are you sure you want to delete this task? This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="mt-3 text-xs text-gray-500 flex items-center">
        <Clock className="h-3 w-3 mr-1" />
        Created {format(new Date(task.createdAt), 'MMM d, yyyy')}
      </div>
    </div>
  );
};
