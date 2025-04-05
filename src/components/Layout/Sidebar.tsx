
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, ListTodo, Tag, CheckSquare, Clock, Settings, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTasks } from '@/context/TaskContext';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AddCategoryForm } from '@/components/Tasks/AddCategoryForm';

export const Sidebar: React.FC = () => {
  const { categories } = useTasks();

  return (
    <aside className="w-64 bg-sidebar text-sidebar-foreground hidden md:flex md:flex-col border-r">
      <div className="p-4 flex items-center">
        <ListTodo className="h-6 w-6 text-blue-400 mr-2" />
        <span className="font-bold text-xl">TaskKeeper</span>
      </div>
      
      <Button asChild variant="default" className="mx-4 my-3">
        <NavLink to="/new-task">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </NavLink>
      </Button>
      
      <ScrollArea className="flex-1">
        <nav className="space-y-1 p-2">
          <NavLink 
            to="/" 
            className={({ isActive }) => 
              `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                isActive 
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`
            }
          >
            <Home className="h-4 w-4 mr-2" />
            Dashboard
          </NavLink>
          
          <NavLink 
            to="/tasks" 
            className={({ isActive }) => 
              `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                isActive 
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`
            }
          >
            <ListTodo className="h-4 w-4 mr-2" />
            All Tasks
          </NavLink>
          
          <NavLink 
            to="/completed" 
            className={({ isActive }) => 
              `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                isActive 
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`
            }
          >
            <CheckSquare className="h-4 w-4 mr-2" />
            Completed
          </NavLink>
          
          <NavLink 
            to="/upcoming" 
            className={({ isActive }) => 
              `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                isActive 
                  ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
              }`
            }
          >
            <Clock className="h-4 w-4 mr-2" />
            Upcoming
          </NavLink>
          
          <div className="pt-4 pb-2">
            <div className="flex items-center justify-between px-3 py-2">
              <h3 className="text-xs font-semibold text-sidebar-foreground/70 uppercase tracking-wider">
                Categories
              </h3>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-5 w-5">
                    <Plus className="h-3 w-3" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Category</DialogTitle>
                  </DialogHeader>
                  <AddCategoryForm />
                </DialogContent>
              </Dialog>
            </div>
            
            {categories.map((category) => (
              <NavLink 
                key={category.id}
                to={`/category/${category.id}`}
                className={({ isActive }) => 
                  `flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    isActive 
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`
                }
              >
                <span 
                  className="h-2 w-2 mr-2 rounded-full"
                  style={{ backgroundColor: category.color }}
                />
                {category.name}
              </NavLink>
            ))}
          </div>
        </nav>
      </ScrollArea>
      
      <div className="p-4 border-t border-sidebar-border">
        <NavLink 
          to="/settings" 
          className="flex items-center px-3 py-2 text-sm rounded-md text-sidebar-foreground hover:bg-sidebar-accent/50 transition-colors"
        >
          <Settings className="h-4 w-4 mr-2" />
          Settings
        </NavLink>
      </div>
    </aside>
  );
};
