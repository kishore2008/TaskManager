
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTasks } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { DialogClose } from '@/components/ui/dialog';

const formSchema = z.object({
  name: z.string().min(1, 'Category name is required'),
  color: z.string().min(1, 'Color is required')
});

type FormValues = z.infer<typeof formSchema>;

const DEFAULT_COLORS = [
  '#3b82f6', // blue
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ef4444', // red
  '#64748b', // slate
];

export const AddCategoryForm: React.FC = () => {
  const { addCategory } = useTasks();
  const [selectedColor, setSelectedColor] = React.useState(DEFAULT_COLORS[0]);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      color: DEFAULT_COLORS[0]
    }
  });
  
  const onSubmit = (data: FormValues) => {
    addCategory(data.name, data.color);
    form.reset();
  };
  
  const handleColorSelect = (color: string) => {
    setSelectedColor(color);
    form.setValue('color', color);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
              <FormControl>
                <Input placeholder="Work, Personal, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Color</FormLabel>
              <FormControl>
                <div className="flex flex-wrap gap-2">
                  {DEFAULT_COLORS.map((color) => (
                    <button
                      key={color}
                      type="button"
                      className={`h-6 w-6 rounded-full border-2 ${
                        selectedColor === color ? 'border-gray-900' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorSelect(color)}
                    />
                  ))}
                  <Input 
                    type="color" 
                    className="h-6 w-6" 
                    value={field.value} 
                    onChange={(e) => {
                      field.onChange(e);
                      setSelectedColor(e.target.value);
                    }} 
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <DialogClose asChild>
            <Button type="button" variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Add Category</Button>
        </div>
      </form>
    </Form>
  );
};
