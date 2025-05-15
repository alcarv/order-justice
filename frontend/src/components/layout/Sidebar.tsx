import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, UserCog, Settings } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuthStore();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Processes', href: '/processes', icon: FileText },
    { name: 'Employees', href: '/employees', icon: UserCog },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];
  
  // Function to check if a nav item is active
  const isActive = (path: string) => {
    return location.pathname === path || 
      (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <div className="flex flex-col h-full text-white">
      <div className="p-6">
        <div className="flex items-center">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-yellow-500 text-slate-900 font-bold text-xl">
            L
          </div>
          <span className="ml-3 text-lg font-medium">LegalPro</span>
        </div>
      </div>
      
      <div className="flex-1 mt-4">
        <nav className="px-4 space-y-1">
          {navigation.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center px-2 py-3 text-sm font-medium rounded-md transition-colors ${
                  active 
                    ? 'bg-slate-700 text-white' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                }`}
              >
                <item.icon className={`mr-3 h-5 w-5 ${active ? 'text-yellow-400' : 'text-slate-400'}`} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </div>
      
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center">
          {user?.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-medium">
              {user?.name.charAt(0)}
            </div>
          )}
          <div className="ml-3">
            <p className="text-sm font-medium">{user?.name}</p>
            <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;