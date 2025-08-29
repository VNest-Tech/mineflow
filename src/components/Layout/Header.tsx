import React from 'react';
import { Menu, User, ChevronDown } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Language } from '../../types';

interface HeaderProps {
  onMenuClick: () => void;
  userRole?: 'admin' | 'driver' | 'operator';
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, userRole = 'admin' }) => {
  const { language, setLanguage, t } = useLanguage();

  const languages: { code: Language; label: string; native: string }[] = [
    { code: 'en', label: t('english'), native: 'English' },
    { code: 'hi', label: t('hindi'), native: 'हिंदी' },
    { code: 'mr', label: t('marathi'), native: 'मराठी' }
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {userRole !== 'driver' && (
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <Menu className="h-6 w-6" />
            </button>
          )}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">MT</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {userRole === 'driver' ? 'Driver Portal' : 'Mining Truck Monitor'}
              </h1>
              <p className="text-sm text-gray-500">
                {userRole === 'driver' ? 'Delivery Management' : 'Dispatch Management System'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Language Dropdown */}
          <div className="relative group">
            <button className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:text-gray-900 rounded-md hover:bg-gray-100">
              <span>{languages.find(l => l.code === language)?.native}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <div className="absolute right-0 mt-1 w-32 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setLanguage(lang.code)}
                  className={`block w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                    language === lang.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {lang.native}
                </button>
              ))}
            </div>
          </div>

          {/* Profile */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-gray-600" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">
                {userRole === 'driver' ? 'राम शर्मा' : 'Admin User'}
              </p>
              <p className="text-xs text-gray-500">
                {userRole === 'driver' ? 'Driver' : 'Administrator'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;