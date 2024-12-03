import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Save, Clock, Users, Key } from 'lucide-react';

export default function SecuritySettings({ settings }) {
    const [formData, setFormData] = useState(settings);
    const [saving, setSaving] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setSaving(true);
        router.post(route('admin.security.settings.update'), formData, {
            onFinish: () => setSaving(false)
        });
    };

    const handleInputChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const SettingInput = ({ setting }) => {
        switch (setting.type) {
            case 'boolean':
                return (
                    <div className="flex items-center space-x-3">
                        <input
                            type="checkbox"
                            id={setting.key}
                            checked={formData[setting.key]}
                            onChange={(e) => handleInputChange(setting.key, e.target.checked)}
                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                        />
                        <label htmlFor={setting.key} className="text-sm text-gray-700 dark:text-gray-300">
                            {setting.description}
                        </label>
                    </div>
                );
            case 'integer':
                return (
                    <div>
                        <label htmlFor={setting.key} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {setting.description}
                        </label>
                        <input
                            type="number"
                            id={setting.key}
                            value={formData[setting.key]}
                            onChange={(e) => handleInputChange(setting.key, parseInt(e.target.value))}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                );
            default:
                return (
                    <div>
                        <label htmlFor={setting.key} className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            {setting.description}
                        </label>
                        <input
                            type="text"
                            id={setting.key}
                            value={formData[setting.key]}
                            onChange={(e) => handleInputChange(setting.key, e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>
                );
        }
    };

    const sections = {
        sessions: {
            title: 'Session Management',
            icon: Clock,
        },
        authentication: {
            title: 'Authentication',
            icon: Key,
        },
        access: {
            title: 'Access Control',
            icon: Users,
        }
    };

    return (
        <AdminLayout>
            <Head title="Security Settings" />

            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Security Settings
                        </h1>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {Object.entries(sections).map(([group, { title, icon: Icon }]) => {
                                const groupSettings = Object.entries(settings)
                                    .filter(([_, setting]) => setting.group === group)
                                    .map(([key, setting]) => ({ key, ...setting }));

                                if (groupSettings.length === 0) return null;

                                return (
                                    <div key={group} className="bg-white dark:bg-gray-800 shadow rounded-lg">
                                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                                            <div className="flex items-center">
                                                <Icon className="h-5 w-5 text-gray-400 mr-2" />
                                                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                                    {title}
                                                </h2>
                                            </div>
                                        </div>
                                        <div className="p-6 space-y-6">
                                            {groupSettings.map(setting => (
                                                <SettingInput key={setting.key} setting={setting} />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={saving}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700 active:bg-blue-800 focus:outline-none focus:border-blue-800 focus:ring focus:ring-blue-200 disabled:opacity-25 transition"
                            >
                                <Save className="h-4 w-4 mr-2" />
                                {saving ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
