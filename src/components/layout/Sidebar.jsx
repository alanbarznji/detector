import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Camera, Activity, Archive, BarChart3, Settings } from 'lucide-react';
import clsx from 'clsx';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'لوحة التحكم' },
  { to: '/cameras', icon: Camera, label: 'الكاميرات' },
  { to: '/sensors', icon: Activity, label: 'الحساسات' },
  { to: '/archive', icon: Archive, label: 'الأرشيف' },
  { to: '/analytics', icon: BarChart3, label: 'التحليلات' },
  { to: '/settings', icon: Settings, label: 'الإعدادات' },
];

export const Sidebar = () => {
  return (
    <aside className="fixed right-0 top-0 h-screen w-64 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          نظام المراقبة والإنذار
        </h1>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                    isActive
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  )
                }
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          النسخة 1.0.0
        </div>
      </div>
    </aside>
  );
};
