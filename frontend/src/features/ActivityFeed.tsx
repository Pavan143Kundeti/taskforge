import { Activity } from '../types';
import { Avatar } from '../components/Avatar';
import { getRelativeTime } from '../utils/date';
import { motion } from 'framer-motion';

interface ActivityFeedProps {
  activities: Activity[];
}

export const ActivityFeed = ({ activities }: ActivityFeedProps) => {
  return (
    <div className="space-y-4">
      {activities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex gap-3"
        >
          <Avatar src={activity.user.avatar} name={activity.user.name} size="sm" />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-gray-900">
              <span className="font-medium">{activity.user.name}</span>{' '}
              <span className="text-gray-600">{activity.description}</span>
            </p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-500">{getRelativeTime(activity.createdAt)}</span>
              {activity.project && (
                <>
                  <span className="text-gray-300">•</span>
                  <span
                    className="text-xs font-medium"
                    style={{ color: activity.project.color }}
                  >
                    {activity.project.name}
                  </span>
                </>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};
