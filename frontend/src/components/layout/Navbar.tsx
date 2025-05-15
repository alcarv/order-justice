import { useState } from 'react';
import { Bell, Search, Menu } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';

interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { user, logout } = useAuthStore();
  const [showDropdown, setShowDropdown] = useState(false);
  
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100 focus:outline-none"
              onClick={onMenuClick}
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="hidden md:block ml-3 font-serif font-medium text-xl text-slate-800">
              LegalPro
            </div>
          </div>
          
          <div className="hidden md:block flex-1 max-w-md mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 rounded-md border border-slate-300 bg-slate-50 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-yellow-500 sm:text-sm"
                placeholder="Search for clients, processes..."
              />
            </div>
          </div>
          
          <div className="flex items-center">
            <button 
              className="p-2 text-slate-600 hover:text-slate-900 focus:outline-none focus:text-slate-900 relative"
            >
              <Bell className="h-6 w-6" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-500"></span>
            </button>
            
            <div className="ml-3 relative">
              <div>
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                >
                  {user?.avatar ? (
                    <img 
                      src={user.avatar} 
                      alt={user.name} 
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-slate-600 flex items-center justify-center text-xs font-medium text-white">
                      {user?.name.charAt(0)}
                    </div>
                  )}
                </button>
              </div>
              
              {showDropdown && (
                <div 
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                >
                  <div className="py-1">
                    <div className="px-4 py-2 text-sm text-slate-700">
                      <p className="font-medium">{user?.name}</p>
                      <p className="text-slate-500 truncate">{user?.email}</p>
                    </div>
                    <div className="border-t border-slate-100"></div>
                    <button
                      onClick={() => logout()}
                      className="block w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                    >
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;