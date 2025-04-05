
import React, { useState, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTasks } from '@/context/TaskContext';
import { TaskCard } from '@/components/Tasks/TaskCard';
import { TaskFilters } from '@/components/Tasks/TaskFilters';

interface TaskListPageProps {
  filter?: 'all' | 'completed' | 'category';
  title?: string;
}

const TaskListPage: React.FC<TaskListPageProps> = ({ filter = 'all', title }) => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { tasks, categories, toggleTaskCompletion, deleteTask } = useTasks();
  
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  
  // Set the initial categoryFilter when categoryId changes
  useEffect(() => {
    if (categoryId) {
      setCategoryFilter(categoryId);
    }
  }, [categoryId]);
  
  // Calculate filtered tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];
    
    // Apply page-level filter first
    if (filter === 'completed') {
      result = result.filter(task => task.completed);
    } else if (filter === 'category' && categoryId) {
      result = result.filter(task => task.categoryId === categoryId);
    }
    
    // Apply user-selected filters only when not using a page-level filter
    if (filter !== 'completed' && statusFilter !== 'all') {
      result = result.filter(task => 
        statusFilter === 'completed' ? task.completed : !task.completed
      );
    }
    
    // Apply category filter only when not already filtered by category
    if (filter !== 'category' && categoryFilter !== 'all') {
      result = result.filter(task => task.categoryId === categoryFilter);
    }
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        task => task.title.toLowerCase().includes(query) || 
               task.description.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      if (sortOrder === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortOrder === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortOrder === 'priority') {
        const priorityValue = { high: 3, medium: 2, low: 1 };
        return priorityValue[b.priority] - priorityValue[a.priority];
      }
      return 0;
    });
    
    return result;
  }, [tasks, filter, categoryId, statusFilter, categoryFilter, searchQuery, sortOrder]);
  
  // Get the category name for display
  const categoryName = useMemo(() => {
    if (filter === 'category' && categoryId) {
      const category = categories.find(c => c.id === categoryId);
      return category ? category.name : 'Unknown Category';
    }
    return '';
  }, [categories, categoryId, filter]);
  
  // Get page title
  const pageTitle = title || (
    filter === 'all' ? 'All Tasks' : 
    filter === 'completed' ? 'Completed Tasks' : 
    `${categoryName} Tasks`
  );
  
  // Find category by ID
  const getCategoryById = (categoryId: string) => {
    return categories.find(category => category.id === categoryId) || {
      id: '',
      name: 'Uncategorized',
      color: '#888888'
    };
  };
  
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">{pageTitle}</h1>
      
      <TaskFilters
        categories={categories}
        statusFilter={statusFilter}
        categoryFilter={categoryFilter}
        searchQuery={searchQuery}
        sortOrder={sortOrder}
        onStatusChange={setStatusFilter}
        onCategoryChange={setCategoryFilter}
        onSearchChange={setSearchQuery}
        onSortChange={setSortOrder}
      />
      
      <div>
        {filteredTasks.length > 0 ? (
          <div className="space-y-3">
            {filteredTasks.map(task => (
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
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-gray-500 mb-2">No tasks found</p>
            <p className="text-sm text-gray-400">
              {searchQuery ? 
                "Try adjusting your search or filters" : 
                "Start by adding a new task"
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskListPage;
