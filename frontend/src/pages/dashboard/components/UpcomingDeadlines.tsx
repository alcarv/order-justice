import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { Process } from '../../../types';

interface UpcomingDeadlinesProps {
  deadlines: Process[];
}

const UpcomingDeadlines: React.FC<UpcomingDeadlinesProps> = ({ deadlines }) => {
  if (deadlines.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500">
        <Clock className="w-10 h-10 mx-auto text-slate-400" />
        <p className="mt-2">No upcoming deadlines</p>
      </div>
    );
  }
  
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'low': return 'bg-blue-100 text-blue-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'urgent': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-3">
      {deadlines.map((process) => {
        const dueDate = new Date(process.dueDate!);
        const isToday = new Date().toDateString() === dueDate.toDateString();
        const isTomorrow = 
          new Date(new Date().setDate(new Date().getDate() + 1)).toDateString() === 
          dueDate.toDateString();
        
        let dateLabel = format(dueDate, 'MMM d');
        if (isToday) dateLabel = 'Today';
        if (isTomorrow) dateLabel = 'Tomorrow';
        
        return (
          <Link 
            key={process.id} 
            to={`/processes/${process.id}`}
            className="block p-3 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-slate-900 line-clamp-1">
                  {process.title}
                </p>
                <p className="text-sm text-slate-500 mt-1">
                  <span className="inline-flex items-center mr-3">
                    <Clock className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {dateLabel} - {format(dueDate, 'h:mm a')}
                  </span>
                  {process.court && (
                    <span className="text-slate-500">
                      {process.court}
                    </span>
                  )}
                </p>
              </div>
              <div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getPriorityColor(process.priority)}`}>
                  {process.priority}
                </span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default UpcomingDeadlines;