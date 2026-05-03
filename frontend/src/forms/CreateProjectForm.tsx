import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '../api/projects';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { PROJECT_COLORS } from '../constants';

const projectSchema = z.object({
  name: z.string().min(1, 'Project name is required').max(100),
  description: z.string().optional(),
  color: z.string(),
});

type ProjectForm = z.infer<typeof projectSchema>;

interface CreateProjectFormProps {
  onSuccess: () => void;
}

export const CreateProjectForm = ({ onSuccess }: CreateProjectFormProps) => {
  const queryClient = useQueryClient();
  const [selectedColor, setSelectedColor] = useState(PROJECT_COLORS[0]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      color: PROJECT_COLORS[0],
    },
  });

  const createMutation = useMutation({
    mutationFn: projectsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      onSuccess();
    },
  });

  const onSubmit = (data: ProjectForm) => {
    createMutation.mutate({ ...data, color: selectedColor });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Project Name"
        placeholder="e.g., Website Redesign"
        error={errors.name?.message}
        {...register('name')}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          rows={3}
          placeholder="Brief description of the project"
          {...register('description')}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Project Color</label>
        <div className="grid grid-cols-6 gap-2">
          {PROJECT_COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={`w-10 h-10 rounded-lg transition-all ${
                selectedColor === color ? 'ring-2 ring-offset-2 ring-primary-500 scale-110' : ''
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {createMutation.isError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {(createMutation.error as any)?.response?.data?.message || 'Failed to create project'}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1" isLoading={createMutation.isPending}>
          Create Project
        </Button>
      </div>
    </form>
  );
};
