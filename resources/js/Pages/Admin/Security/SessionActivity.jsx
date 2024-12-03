import { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import ActivityDetailsModal from '@/Components/Admin/ActivityDetailsModal';
import {
    Activity,
    AlertTriangle,
    Clock,
    Monitor,
    Smartphone,
    Globe,
    CheckCircle,
    XCircle,
    AlertCircle,
    Download
} from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function SessionActivity({ activities, statistics, unusualActivities }) {
    const [activeTab, setActiveTab] = useState('all');
    const [selectedActivity, setSelectedActivity] = useState(null);

    const getActionIcon = (action) => {
        switch (action) {
            case 'login':
                return <CheckCircle className="h-5 w-5 text-green-500" />;
            case 'logout':
                return <Clock className="h-5 w-5 text-blue-500" />;
            case 'timeout':
                return <XCircle className="h-5 w-5 text-red-500" />;
            case 'forced_logout':
                return <AlertCircle className="h-5 w-5 text-yellow-500" />;
            default:
                return <Activity className="h-5 w-5 text-gray-500" />;
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

    const handleExport = () => {
        // Create a hidden form and submit it
        const form = document.createElement('form');
        form.method = 'GET';
        form.action = route('admin.security.activity.export');
        document.body.appendChild(form);
        form.submit();
        document.body.removeChild(form);
    };

    return (
        <AdminLayout>
            <Head title="Session Activity"/>
            <button
                onClick={handleExport}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
                <Download className="h-4 w-4 mr-2"/>
                Export Activity
            </button>

            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                        Session Activity
                    </h1>

                    {/* Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <Activity className="h-8 w-8 text-blue-500"/>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Total Sessions
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        {statistics.total_sessions}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <Clock className="h-8 w-8 text-yellow-500"/>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Timeouts
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        {statistics.total_timeouts}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <Globe className="h-8 w-8 text-green-500"/>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Unique Devices
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        {statistics.devices}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                            <div className="flex items-center">
                                <AlertTriangle className="h-8 w-8 text-red-500"/>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                        Forced Logouts
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900 dark:text-white">
                                        {statistics.forced_logouts}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`${
                                    activeTab === 'all'
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                All Activity
                            </button>
                            <button
                                onClick={() => setActiveTab('unusual')}
                                className={`${
                                    activeTab === 'unusual'
                                        ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
                            >
                                Unusual Activity
                            </button>
                        </nav>
                    </div>

                    {/* Activity List */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {(activeTab === 'all' ? activities : unusualActivities).map((activity) => (
                                <div key={activity.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            {getActionIcon(activity.action)}
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {activity.action.replace('_', ' ').charAt(0).toUpperCase() +
                                                            activity.action.slice(1)}
                                                    </p>
                                                    <div
                                                        className="mt-1 flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <div className="flex items-center">
                                                            {getDeviceIcon(activity.device_type)}
                                                            <span className="ml-1">
                                                                {activity.browser} on {activity.platform}
                                                            </span>
                                                        </div>
                                                        <span>&bull;</span>
                                                        <span>{activity.ip_address}</span>
                                                    </div>
                                                </div>
                                                <div className="ml-4 flex-shrink-0">
                                                    <time
                                                        dateTime={activity.created_at}
                                                        className="text-sm text-gray-500 dark:text-gray-400"
                                                    >
                                                        {dayjs(activity.created_at).fromNow()}
                                                    </time>
                                                </div>
                                            </div>
                                            {activity.details && (
                                                <div className="mt-2">
                                                    <button
                                                        type="button"
                                                        className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
                                                        onClick={() => setSelectedActivity(activity)}
                                                    >
                                                        View details
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {(activeTab === 'all' ? activities : unusualActivities).length === 0 && (
                                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                    No {activeTab === 'unusual' ? 'unusual ' : ''}activity found.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Device Summary */}
                    <div className="mt-8 bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                            Device Summary
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    Most Used Device
                                </h3>
                                <p className="text-base font-medium text-gray-900 dark:text-white">
                                    {statistics.most_used_device || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    Browsers Used
                                </h3>
                                <div className="space-y-1">
                                    {statistics.browsers.map((browser, index) => (
                                        <p key={index} className="text-sm text-gray-900 dark:text-white">
                                            {browser}
                                        </p>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                    Platforms Used
                                </h3>
                                <div className="space-y-1">
                                    {statistics.platforms.map((platform, index) => (
                                        <p key={index} className="text-sm text-gray-900 dark:text-white">
                                            {platform}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {selectedActivity && (
                <ActivityDetailsModal
                    activity={selectedActivity}
                    onClose={() => setSelectedActivity(null)}
                />
            )}
        </AdminLayout>
    );
}
