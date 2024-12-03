import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Monitor, Smartphone, Globe, Clock, LogOut, AlertTriangle } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function Sessions({ sessions }) {
    const handleTerminate = (sessionId) => {
        if (confirm('Are you sure you want to terminate this session?')) {
            router.delete(route('admin.security.sessions.destroy', sessionId));
        }
    };

    const handleTerminateAll = () => {
        if (confirm('Are you sure you want to terminate all other sessions?')) {
            router.post(route('admin.security.sessions.destroy-all'));
        }
    };

    const getDeviceIcon = (deviceType) => {
        switch (deviceType?.toLowerCase()) {
            case 'desktop':
                return <Monitor className="h-4 w-4" />;
            case 'mobile':
                return <Smartphone className="h-4 w-4" />;
            default:
                return <Globe className="h-4 w-4" />;
        }
    };

    return (
        <AdminLayout>
            <Head title="Active Sessions" />

            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Active Sessions
                        </h1>

                        {sessions.length > 1 && (
                            <button
                                onClick={handleTerminateAll}
                                className="inline-flex items-center px-4 py-2 bg-red-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-red-700"
                            >
                                <LogOut className="h-4 w-4 mr-2" />
                                Terminate Other Sessions
                            </button>
                        )}
                    </div>

                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {sessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="p-6 hover:bg-gray-50 dark:hover:bg-gray-900/50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="flex-shrink-0">
                                                {getDeviceIcon(session.device_type)}
                                            </div>
                                            <div>
                                                <div className="flex items-center">
                                                    <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {session.browser} on {session.platform}
                                                    </h3>
                                                    {session.is_current && (
                                                        <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                            Current Session
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                    {session.ip_address} · {session.device_type}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                    <Clock className="inline-block h-3 w-3 mr-1" />
                                                    Last active {dayjs.unix(session.last_activity).fromNow()}
                                                </p>
                                            </div>
                                        </div>

                                        {!session.is_current && (
                                            <button
                                                onClick={() => handleTerminate(session.id)}
                                                className="text-sm text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                                            >
                                                Terminate
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {sessions.length === 0 && (
                                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                    No active sessions found.
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                            <AlertTriangle className="h-4 w-4" />
                            <p>
                                Terminating a session will force the user to log in again on that device.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
