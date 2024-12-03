import { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import { Bell, X } from 'lucide-react';

export default function NotificationsDropdown({ children }) {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        // TODO: Implement real-time notifications with Laravel Echo
        // For now, we'll use dummy data
        setNotifications([
            {
                id: 1,
                type: 'info',
                message: 'System update scheduled for tonight',
                time: '5m ago',
                read: false
            },
            {
                id: 2,
                type: 'success',
                message: 'Backup completed successfully',
                time: '1h ago',
                read: false
            }
        ]);
        setUnreadCount(2);
    }, []);

    const markAsRead = (id) => {
        setNotifications(notifications.map(notif =>
            notif.id === id ? { ...notif, read: true } : notif
        ));
        setUnreadCount(prev => Math.max(0, prev - 1));
    };

    return (
        <div className="relative">
            <div onClick={() => setIsOpen(!isOpen)} className="relative">
                {children}
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </div>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg ring-1 ring-black ring-opacity-5">
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
                                Notifications
                            </h3>
                            <Link
                                href="/admin/notifications"
                                className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-500"
                            >
                                View all
                            </Link>
                        </div>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="p-4 text-center text-gray-500 dark:text-gray-400">
                                No notifications
                            </p>
                        ) : (
                            <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                {notifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900/10' : ''}`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-900 dark:text-gray-100">
                                                    {notification.message}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                    {notification.time}
                                                </p>
                                            </div>
                                            {!notification.read && (
                                                <button
                                                    onClick={() => markAsRead(notification.id)}
                                                    className="ml-4 text-gray-400 hover:text-gray-500"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
