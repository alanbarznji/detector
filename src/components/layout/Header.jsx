import React from 'react';
import { Bell, Moon, Sun, User } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useAppSelector, useAppDispatch } from '../../hooks/useRedux';
import { toggleTheme } from '../../store/slices/settingsSlice';

export const Header = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.settings.theme);
  const alerts = useAppSelector((state) => state.alerts.items);
  const activeAlerts = alerts.filter(a => !a.resolved).length;

  // Mock user data - you can add a user slice later if needed
  const user = {
    name: 'أحمد محمد',
    role: 'admin'
  };

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <header className="fixed top-0 left-0 right-64 h-16 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
      <div className="h-full px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            مرحباً، {user?.name}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleTheme}
            icon={theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          >
          </Button>

          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              icon={<Bell className="w-5 h-5" />}
            >
            </Button>
            {activeAlerts > 0 && (
              <Badge
                variant="danger"
                size="sm"
                className="absolute -top-1 -left-1 min-w-[20px] h-5 flex items-center justify-center p-0 px-1"
              >
                {activeAlerts}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="text-sm">
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {user?.name}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {user?.role === 'admin' ? 'مدير' : user?.role === 'operator' ? 'مشغل' : 'مشاهد'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
