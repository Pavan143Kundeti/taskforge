import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';
import { usersApi } from '../api/users';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Button } from '../components/Button';
import { TaskStatus, TaskPriority } from '../types';
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '../constants';

const taskSchema = z.object({
  title: z.string().min(1, 'Task title is required').max(200),
  description: z.string().optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueDate: z.string().optional(),
  assigneeId: z.string().optional(),
});

type TaskForm = z.infer<typeof taskSchema>;

interface CreateTaskFormProps {
  projectId: string;
  onSuccess: () => void;
}

export const CreateTaskForm = ({ projectId, onSuccess }: CreateTaskFormProps) => {
  const queryClient = useQueryClient();

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAll,
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      status: TaskStatus.TODO,
      priority: TaskPriority.MEDIUM,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: TaskForm) => tasksApi.create({ ...data, projectId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', projectId] });
      queryClient.invalidateQueries({ queryKey: ['taskStats', projectId] });
      onSuccess();
    },
  });

  const onSubmit = (data: TaskForm) => {
    createMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <Input
        label="Task Title"
        placeholder="e.g., Implement user authentication"
        error={errors.title?.message}
        {...register('title')}
      />

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description (optional)
        </label>
        <textarea
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all"
          rows={3}
          placeholder="Add more details about this task"
          {...register('description')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Select
          label="Status"
          options={Object.entries(TASK_STATUS_LABELS).map(([value, label]) => ({
            value,
            label,
          }))}
          {...register('status')}
        />

        <Select
          label="Priority"
          options={Object.entries(TASK_PRIORITY_LABELS).map(([value, label]) => ({
            value,
            label,
          }))}
          {...register('priority')}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Due Date (optional)"
          type="datetime-local"
          {...register('dueDate')}
        />

        <Select
          label="Assignee (optional)"
          options={[
            { value: '', label: 'Unassigned' },
            ...(users?.map((user) => ({
              value: user.id,
              label: user.name,
            })) || []),
          ]}
          {...register('assigneeId')}
        />
      </div>

      {createMutation.isError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {(createMutation.error as any)?.response?.data?.message || 'Failed to create task'}
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button type="submit" className="flex-1" isLoading={createMutation.isPending}>
          Create Task
        </Button>
      </div>
    </form>
  );
};
