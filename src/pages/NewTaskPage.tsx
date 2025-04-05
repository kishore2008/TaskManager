
import React from 'react';
import { AddTaskForm } from '@/components/Tasks/AddTaskForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const NewTaskPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create New Task</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Task Details</CardTitle>
        </CardHeader>
        <CardContent>
          <AddTaskForm />
        </CardContent>
      </Card>
    </div>
  );
};

export default NewTaskPage;
