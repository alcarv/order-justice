import React from 'react';
import { Link } from 'react-router-dom';
import { File, ArrowRight, MessageSquare } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import { Activity } from '../../../types';

interface RecentActivitiesProps {
  activities: (Activity & { processTitle: string })[];
}

const RecentActivities: React.FC<RecentActivitiesProps> = ({ activities }) => {
  if (activities.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <MessageSquare className="w-10 h-10 mx-auto text-slate-400" />
        <p className="mt-2">No recent activity</p>
      </div>
    );
  }
  
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'status_change':
        return <ArrowRight className="h-5 w-5 text-green-500" />;
      case 'document_added':
        return <File className="h-5 w-5 text-amber-500" />;
      default:
        return <MessageSquare className="h-5 w-5 text-slate-500" />;
    }
  };

  return (
    <div className="flow-root">
      <ul className="-mb-8">
        {activities.map((activity, activityIdx) => (
          <li key={activity.id}>
            <div className="relative pb-8">
              {activityIdx !== activities.length - 1 ? (
                <span
                  className="absolute top-5 left-5 -ml-px h-full w-0.5 bg-slate-200"
                  aria-hidden="true"
                />
              ) : null}
              <div className="relative flex items-start space-x-3">
                <div className="relative">
                  <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <div>
                    <div className="text-sm">
                      <Link
                        to={`/processes/${activity.processId}`}
                        className="font-medium text-slate-900 hover:text-slate-700"
                      >
                        {activity.processTitle}
                      </Link>
                    </div>
                    <p className="mt-0.5 text-sm text-slate-500">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  <div className="mt-2 text-sm text-slate-700">
                    <p>{activity.description}</p>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentActivities;