import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft, Activity, Clock } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function ActivityLog({ user, activities }) {
    const getActionStyles = (action) => {
        switch (action) {
            case 'created':
                return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
            case 'updated':
                return 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300';
            case 'deleted':
                return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
            case 'login':
                return 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300';
            default:
                return 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300';
        }
    };

    return (
        <AdminLayout>
            <Head title={`Activity Log - ${user.name}`} />

            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link
                            href={route('admin.users.index')}
                            className="mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Activity Log - {user.name}
                        </h1>
                    </div>
                </div>

                {/* Activity List */}
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                    {activities.length > 0 ? (
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {activities.map((activity) => (
                                <div key={activity.id} className="p-6">
                                    <div className="flex items-start space-x-4">
                                        {/* Action Icon */}
                                        <div className={`p-2 rounded-full ${getActionStyles(activity.action)}`}>
                                            <Activity className="h-5 w-5" />
                                        </div>

                                        {/* Activity Details */}
                                        <div className="flex-1 min-w-0">
                                            {/* Description */}
                                            <p className="text-sm text-gray-900 dark:text-white">
                                                {activity.description}
                                            </p>

                                            {/* Properties */}
                                            {activity.properties && Object.keys(activity.properties).length > 0 && (
                                                <div className="mt-2 bg-gray-50 dark:bg-gray-900 rounded p-3">
                                                    <pre className="text-xs text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-mono">
                                                        {JSON.stringify(activity.properties, null, 2)}
                                                    </pre>
                                                </div>
                                            )}

                                            {/* Metadata */}
                                            <div className="mt-2 flex items-center text-sm text-gray-500 dark:text-gray-400 space-x-4">
                                                <div className="flex items-center">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    {dayjs(activity.created_at).fromNow()}
                                                </div>
                                                {activity.ip_address && (
                                                    <div>
                                                        IP: {activity.ip_address}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                            No activity recorded yet.
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
