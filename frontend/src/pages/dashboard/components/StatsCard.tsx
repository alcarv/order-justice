import React, { ReactNode } from 'react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: ReactNode;
  description: string;
  color: 'blue' | 'green' | 'purple' | 'red' | 'amber';
}

const StatsCard: React.FC<StatsCardProps> = ({ 
  title, 
  value, 
  icon, 
  description, 
  color = 'blue' 
}) => {
  const getBgColor = () => {
    switch (color) {
      case 'blue': return 'bg-blue-50';
      case 'green': return 'bg-green-50';
      case 'purple': return 'bg-purple-50';
      case 'red': return 'bg-red-50';
      case 'amber': return 'bg-amber-50';
      default: return 'bg-blue-50';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-5">
        <div className="flex items-center">
          <div className={`rounded-md p-2 ${getBgColor()}`}>
            {icon}
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-slate-500 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-semibold text-slate-900">
                  {value}
                </div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-slate-50 px-5 py-3">
        <div className="text-sm text-slate-500">
          {description}
        </div>
      </div>
    </div>
  );
};

export default StatsCard;