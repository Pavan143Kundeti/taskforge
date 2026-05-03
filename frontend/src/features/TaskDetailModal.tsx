import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { tasksApi } from '../api/tasks';
import { usersApi } from '../api/users';
import { Modal } from '../components/Modal';
import { Button } from '../components/Button';
import { Select } from '../components/Select';
import { Avatar } from '../components/Avatar';
import { Badge } from '../components/Badge';
import { Task, TaskStatus, TaskPriority } from '../types';
import { formatDate } from '../utils/date';
import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS, TASK_STATUS_COLORS, TASK_PRIORITY_COLORS } from '../constants';

interface TaskDetailModalProps {
  task: Task;
  onClose: () => void;
  onUpdate: () => void;
}

export const TaskDetailModal = ({ task, onClose, onUpdate }: TaskDetailModalProps) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    status: task.status,
    priority: task.priority,
    assigneeId: task.assigneeId || '',
  });

  const { data: users } = useQuery({
    queryKey: ['users'],
    queryFn: usersApi.getAll,
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => tasksApi.update(task.id, data),
    onSuccess: () => {
      onUpdate();
      setIsEditing(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => tasksApi.delete(task.id),
    onSuccess: () => {
      onUpdate();
      onClose();
    },
  });

  const handleUpdate = () => {
    updateMutation.mutate({
      status: editData.status,
      priority: editData.priority,
      assigneeId: editData.assigneeId || null,
    });
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Task Details" size="lg">
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{task.title}</h2>
          {task.description && (
            <p className="text-gray-600">{task.description}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            {isEditing ? (
              <Select
                options={Object.entries(TASK_STATUS_LABELS).map(([value, label]) => ({
                  value,
                  label,
                }))}
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value as TaskStatus })}
              />
            ) : (
              <Badge className={TASK_STATUS_COLORS[task.status]}>
                {TASK_STATUS_LABELS[task.status]}
              </Badge>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
            {isEditing ? (
              <Select
                options={Object.entries(TASK_PRIORITY_LABELS).map(([value, label]) => ({
                  value,
                  label,
                }))}
                value={editData.priority}
                onChange={(e) => setEditData({ ...editData, priority: e.target.value as TaskPriority })}
              />
            ) : (
              <Badge className={TASK_PRIORITY_COLORS[task.priority]}>
                {TASK_PRIORITY_LABELS[task.priority]}
              </Badge>
            )}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Assignee</label>
          {isEditing ? (
            <Select
              options={[
                { value: '', label: 'Unassigned' },
                ...(users?.map((user) => ({
                  value: user.id,
                  label: user.name,
                })) || []),
              ]}
              value={editData.assigneeId}
              onChange={(e) => setEditData({ ...editData, assigneeId: e.target.value })}
            />
          ) : task.assignee ? (
            <div className="flex items-center gap-2">
              <Avatar src={task.assignee.avatar} name={task.assignee.name} size="sm" />
              <span className="text-gray-900">{task.assignee.name}</span>
            </div>
          ) : (
            <span className="text-gray-500">Unassigned</span>
          )}
        </div>

        {task.dueDate && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
            <p className="text-gray-900">{formatDate(task.dueDate)}</p>
          </div>
        )}

        <div className="pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Created by {task.creator.name}</span>
            <span>•</span>
            <span>{formatDate(task.createdAt)}</span>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          {isEditing ? (
            <>
              <Button onClick={handleUpdate} isLoading={updateMutation.isPending}>
                Save Changes
              </Button>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </>
          ) : (
            <>
              <Button onClick={() => setIsEditing(true)}>Edit</Button>
              <Button
                variant="danger"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this task?')) {
                    deleteMutation.mutate();
                  }
                }}
                isLoading={deleteMutation.isPending}
              >
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};
