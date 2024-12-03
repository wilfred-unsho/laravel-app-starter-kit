import React from 'react';
import { X } from 'lucide-react';

export default function ActivityDetailsModal({ activity, onClose }) {
    if (!activity) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                        Activity Details
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="px-6 py-4">
                    <dl className="space-y-4">
                        <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Action
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white capitalize">
                                {activity.action.replace('_', ' ')}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Timestamp
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                {new Date(activity.created_at).toLocaleString()}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                IP Address
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                {activity.ip_address}
                            </dd>
                        </div>

                        <div>
                            <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                Device Information
                            </dt>
                            <dd className="mt-1 text-sm text-gray-900 dark:text-white">
                                <div className="space-y-1">
                                    <div>Type: {activity.device_type}</div>
                                    <div>Browser: {activity.browser}</div>
                                    <div>Platform: {activity.platform}</div>
                                </div>
                            </dd>
                        </div>

                        {activity.details && (
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Additional Details
                                </dt>
                                <dd className="mt-1">
                                    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 font-mono text-xs overflow-auto max-h-48">
                                        <pre className="text-gray-900 dark:text-gray-100">
                                            {JSON.stringify(activity.details, null, 2)}
                                        </pre>
                                    </div>
                                </dd>
                            </div>
                        )}

                        {activity.session_id && (
                            <div>
                                <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Session ID
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 dark:text-white font-mono">
                                    {activity.session_id}
                                </dd>
                            </div>
                        )}
                    </dl>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end space-x-3">
                    {activity.ip_address && (
                        <button
                            onClick={() => {
                                // You can implement IP blocking functionality here
                                console.log('Block IP:', activity.ip_address);
                            }}
                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            Block IP
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
