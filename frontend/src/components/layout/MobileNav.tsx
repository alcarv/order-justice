import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, UserCog, Settings, Contact as FileContract, Calendar } from 'lucide-react';

const MobileNav = () => {
  const location = useLocation();
  
  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Clients', href: '/clients', icon: Users },
    { name: 'Processes', href: '/processes', icon: FileText },
    { name: 'Contracts', href: '/contracts', icon: FileContract },
    { name: 'Calendar', href: '/calendar', icon: Calendar },
    { name: 'Employees', href: '/employees', icon: UserCog },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path || 
      (path !== '/' && location.pathname.startsWith(path));
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200">
      <div className="grid grid-cols-7">
        {navigation.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`flex flex-col items-center justify-center py-2 text-xs font-medium ${
                active ? 'text-yellow-600' : 'text-slate-600'
              }`}
            >
              <item.icon className={`h-5 w-5 mb-1 ${active ? 'text-yellow-600' : 'text-slate-500'}`} />
              <span className="text-xs">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileNav;