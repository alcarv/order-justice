import { useEffect } from 'react';
import { useClientsStore } from '../../stores/clientsStore';
import { useProcessesStore } from '../../stores/processesStore';
import { useAuthStore } from '../../stores/authStore';
import { Clock, Users, FileText, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import StatsCard from './components/StatsCard';
import RecentActivities from './components/RecentActivities';
import UpcomingDeadlines from './components/UpcomingDeadlines';
import ProcessStatusChart from './components/ProcessStatusChart';

const Dashboard = () => {
  const { user } = useAuthStore();
  const { clients, fetchClients } = useClientsStore();
  const { processes, fetchProcesses } = useProcessesStore();
  
  useEffect(() => {
    fetchClients();
    fetchProcesses();
  }, [fetchClients, fetchProcesses]);
  
  // Get counts for stats cards
  const totalClients = clients.length;
  const totalProcesses = processes.length;
  const activeProcesses = processes.filter(p => 
    p.status !== 'closed' && p.status !== 'archived'
  ).length;
  const urgentProcesses = processes.filter(p => p.priority === 'urgent').length;
  
  // Get upcoming deadlines (processes with due dates in the next 7 days)
  const today = new Date();
  const nextWeek = new Date();
  nextWeek.setDate(today.getDate() + 7);
  
  const upcomingDeadlines = processes
    .filter(p => {
      if (!p.dueDate) return false;
      const dueDate = new Date(p.dueDate);
      return dueDate >= today && dueDate <= nextWeek;
    })
    .sort((a, b) => {
      return new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime();
    });
  
  // Get recent activities
  const allActivities = processes.flatMap(process => 
    process.activities.map(activity => ({
      ...activity,
      processTitle: process.title
    }))
  );
  
  const recentActivities = allActivities
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);
  
  return (
    <div className="space-y-6 pb-16">
      <div>
        <h1 className="text-2xl font-serif font-bold text-slate-900">
          Dashboard
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Welcome back, {user?.name}! Here's what's happening today - {format(new Date(), 'EEEE, MMMM do, yyyy')}
        </p>
      </div>
      
      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Clients" 
          value={totalClients} 
          icon={<Users className="h-6 w-6 text-blue-500" />}
          description="Registered clients"
          color="blue"
        />
        <StatsCard 
          title="Total Processes" 
          value={totalProcesses} 
          icon={<FileText className="h-6 w-6 text-purple-500" />}
          description="All legal processes"
          color="purple"
        />
        <StatsCard 
          title="Active Processes" 
          value={activeProcesses} 
          icon={<Clock className="h-6 w-6 text-green-500" />}
          description="In progress cases"
          color="green"
        />
        <StatsCard 
          title="Urgent Matters" 
          value={urgentProcesses} 
          icon={<AlertCircle className="h-6 w-6 text-red-500" />}
          description="High priority cases"
          color="red"
        />
      </div>
      
      {/* Charts and tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-medium text-slate-900 mb-4">Case Status Overview</h2>
            <div className="h-64">
              <ProcessStatusChart processes={processes} />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            <h2 className="text-lg font-medium text-slate-900 mb-4">Upcoming Deadlines</h2>
            <UpcomingDeadlines deadlines={upcomingDeadlines} />
          </div>
        </div>
      </div>
      
      {/* Recent activity */}
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6">
          <h2 className="text-lg font-medium text-slate-900 mb-4">Recent Activity</h2>
          <RecentActivities activities={recentActivities} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;