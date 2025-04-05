
import React from 'react';
import { CheckSquare, Circle, ArrowUpDown } from 'lucide-react';
import { Category } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

interface TaskFiltersProps {
  categories: Category[];
  statusFilter: string;
  categoryFilter: string;
  searchQuery: string;
  sortOrder: string;
  onStatusChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onSearchChange: (value: string) => void;
  onSortChange: (value: string) => void;
}

export const TaskFilters: React.FC<TaskFiltersProps> = ({
  categories,
  statusFilter,
  categoryFilter,
  searchQuery,
  sortOrder,
  onStatusChange,
  onCategoryChange,
  onSearchChange,
  onSortChange
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="text-sm font-medium mb-1 block">Search</label>
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Status</label>
          <Select value={statusFilter} onValueChange={onStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="pending">
                <div className="flex items-center">
                  <Circle className="h-3 w-3 mr-2 text-blue-500" />
                  Pending
                </div>
              </SelectItem>
              <SelectItem value="completed">
                <div className="flex items-center">
                  <CheckSquare className="h-3 w-3 mr-2 text-green-500" />
                  Completed
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Category</label>
          <Select value={categoryFilter} onValueChange={onCategoryChange}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              <Separator className="my-1" />
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  <div className="flex items-center">
                    <span 
                      className="h-2 w-2 rounded-full mr-2"
                      style={{ backgroundColor: category.color }}
                    />
                    {category.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <label className="text-sm font-medium mb-1 block">Sort</label>
          <Select value={sortOrder} onValueChange={onSortChange}>
            <SelectTrigger>
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">
                <div className="flex items-center">
                  <ArrowUpDown className="h-3 w-3 mr-2" />
                  Newest first
                </div>
              </SelectItem>
              <SelectItem value="oldest">
                <div className="flex items-center">
                  <ArrowUpDown className="h-3 w-3 mr-2" />
                  Oldest first
                </div>
              </SelectItem>
              <SelectItem value="priority">
                <div className="flex items-center">
                  <ArrowUpDown className="h-3 w-3 mr-2" />
                  Priority (High to Low)
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};
