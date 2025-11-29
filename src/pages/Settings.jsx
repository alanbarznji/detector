import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import {
  Settings as SettingsIcon,
  Users,
  Camera,
  Activity,
  Bell,
  Moon,
  Sun,
  Save,
  Shield,
} from 'lucide-react';

export const Settings = () => {
  const { settings, updateSettings, user } = useApp();
  const [localSettings, setLocalSettings] = useState(settings);
  const [activeTab, setActiveTab] = useState<'general' | 'cameras' | 'sensors' | 'users' | 'notifications'>('general');

  const handleSave = () => {
    updateSettings(localSettings);
  };

  const tabs = [
    { id: 'general', label: 'عام', icon: SettingsIcon },
    { id: 'cameras', label: 'الكاميرات', icon: Camera },
    { id: 'sensors', label: 'الحساسات', icon: Activity },
    { id: 'notifications', label: 'الإشعارات', icon: Bell },
    { id: 'users', label: 'المستخدمين', icon: Users },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
          الإعدادات
        </h1>
        <p className="text-gray-500 dark:text-gray-400">
          إدارة إعدادات النظام والتفضيلات
        </p>
      </div>

      <div className="flex gap-6">
        <Card className="w-64 flex-shrink-0 h-fit" padding="sm">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </Card>

        <div className="flex-1 space-y-6">
          {activeTab === 'general' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                الإعدادات العامة
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    المظهر
                  </label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setLocalSettings({ ...localSettings, theme: 'light' })}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                        localSettings.theme === 'light'
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <Sun className="w-5 h-5" />
                      <span>فاتح</span>
                    </button>
                    <button
                      onClick={() => setLocalSettings({ ...localSettings, theme: 'dark' })}
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg border-2 transition-colors ${
                        localSettings.theme === 'dark'
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      <Moon className="w-5 h-5" />
                      <span>داكن</span>
                    </button>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
                    معلومات الحساب
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">الاسم</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{user?.name}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">البريد الإلكتروني</span>
                      <span className="font-medium text-gray-900 dark:text-gray-100">{user?.email}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">الصلاحية</span>
                      <Badge variant="success">
                        <Shield className="w-3 h-3 ml-1" />
                        {user?.role === 'admin' ? 'مدير' : user?.role === 'operator' ? 'مشغل' : 'مشاهد'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'cameras' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                إعدادات الكاميرات
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    فترة إعادة الاتصال (بالثواني)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={localSettings.cameraSettings.reconnectInterval / 1000}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        cameraSettings: {
                          ...localSettings.cameraSettings,
                          reconnectInterval: parseInt(e.target.value) * 1000,
                        },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    الوقت الذي سيحاول النظام إعادة الاتصال بالكاميرا بعد انقطاع الاتصال
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    جودة البث
                  </label>
                  <select
                    value={localSettings.cameraSettings.streamQuality}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        cameraSettings: {
                          ...localSettings.cameraSettings,
                          streamQuality: e.target.value as any,
                        },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="low">منخفضة</option>
                    <option value="medium">متوسطة</option>
                    <option value="high">عالية</option>
                  </select>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    جودة أعلى تعني استهلاك أكبر للبيانات
                  </p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'sensors' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                إعدادات الحساسات
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    فترة التحديث (بالثواني)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="60"
                    value={localSettings.sensorSettings.updateInterval / 1000}
                    onChange={(e) =>
                      setLocalSettings({
                        ...localSettings,
                        sensorSettings: {
                          ...localSettings.sensorSettings,
                          updateInterval: parseInt(e.target.value) * 1000,
                        },
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    معدل تحديث قراءات الحساسات
                  </p>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      تنبيه تلقائي
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      إنشاء تنبيه تلقائي عند تجاوز القيم المحددة
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setLocalSettings({
                        ...localSettings,
                        sensorSettings: {
                          ...localSettings.sensorSettings,
                          autoAlert: !localSettings.sensorSettings.autoAlert,
                        },
                      })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      localSettings.sensorSettings.autoAlert
                        ? 'bg-primary-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        localSettings.sensorSettings.autoAlert ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                إعدادات الإشعارات
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      تفعيل الإشعارات
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      استقبال إشعارات عند حدوث تنبيهات جديدة
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setLocalSettings({
                        ...localSettings,
                        notifications: {
                          ...localSettings.notifications,
                          enabled: !localSettings.notifications.enabled,
                        },
                      })
                    }
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      localSettings.notifications.enabled
                        ? 'bg-primary-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        localSettings.notifications.enabled ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      تنبيه صوتي
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      تشغيل صوت عند حدوث تنبيه
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setLocalSettings({
                        ...localSettings,
                        notifications: {
                          ...localSettings.notifications,
                          sound: !localSettings.notifications.sound,
                        },
                      })
                    }
                    disabled={!localSettings.notifications.enabled}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
                      localSettings.notifications.sound
                        ? 'bg-primary-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        localSettings.notifications.sound ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      إشعارات البريد الإلكتروني
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      إرسال تنبيهات عبر البريد الإلكتروني
                    </p>
                  </div>
                  <button
                    onClick={() =>
                      setLocalSettings({
                        ...localSettings,
                        notifications: {
                          ...localSettings.notifications,
                          email: !localSettings.notifications.email,
                        },
                      })
                    }
                    disabled={!localSettings.notifications.enabled}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors disabled:opacity-50 ${
                      localSettings.notifications.email
                        ? 'bg-primary-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        localSettings.notifications.email ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'users' && (
            <Card>
              <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                إدارة المستخدمين
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary-600 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-gray-100">
                        {user?.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.email}
                      </p>
                    </div>
                  </div>
                  <Badge variant="success">
                    <Shield className="w-3 h-3 ml-1" />
                    {user?.role === 'admin' ? 'مدير' : user?.role === 'operator' ? 'مشغل' : 'مشاهد'}
                  </Badge>
                </div>

                <div className="pt-4">
                  <Button variant="primary" icon={<Users className="w-5 h-5" />}>
                    إضافة مستخدم جديد
                  </Button>
                </div>
              </div>
            </Card>
          )}

          <div className="flex justify-end gap-3">
            <Button variant="secondary">
              إلغاء
            </Button>
            <Button variant="primary" icon={<Save className="w-5 h-5" />} onClick={handleSave}>
              حفظ التغييرات
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
