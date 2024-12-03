import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Shield,
    ShieldOff,
    Users,
    Key,
    Clock,
    AlertTriangle,
    CheckCircle,
    XCircle
} from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function SecurityDashboard({ stats }) {
    const StatCard = ({ title, value, icon: Icon, to, color = 'blue' }) => (
        <Link
            href={to}
            className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow"
        >
            <div className="flex items-center">
                <div className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
                    <Icon className={`h-6 w-6 text-${color}-600 dark:text-${color}-400`} />
                </div>
                <div className="ml-4">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{value}</p>
                </div>
            </div>
        </Link>
    );

    return (
        <AdminLayout>
            <Head title="Security Dashboard" />

            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                        Security Dashboard
                    </h1>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <StatCard
                            title="Active Sessions"
                            value={stats.active_sessions}
                            icon={Clock}
                            to={route('admin.security.sessions')}
                            color="blue"
                        />
                        <StatCard
                            title="Blacklisted IPs"
                            value={stats.ip_restrictions.blacklisted}
                            icon={ShieldOff}
                            to={route('admin.security.ip-restrictions')}
                            color="red"
                        />
                        <StatCard
                            title="Whitelisted IPs"
                            value={stats.ip_restrictions.whitelisted}
                            icon={Shield}
                            to={route('admin.security.ip-restrictions')}
                            color="green"
                        />
                        <StatCard
                            title="2FA Enabled Users"
                            value={`${stats.two_factor.enabled}/${stats.two_factor.total_users}`}
                            icon={Key}
                            to={route('admin.security.2fa')}
                            color="purple"
                        />
                    </div>

                    {/* Recent Login Attempts */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                                Recent Login Attempts
                            </h2>
                        </div>
                        <div className="divide-y divide-gray-200 dark:divide-gray-700">
                            {stats.recent_attempts.map((attempt) => (
                                <div key={attempt.id} className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            {attempt.was_successful ? (
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                            ) : (
                                                <XCircle className="h-5 w-5 text-red-500" />
                                            )}
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {attempt.email}
                                                </p>
                                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                                    {attempt.ip_address} · {attempt.browser} on {attempt.platform}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {dayjs(attempt.created_at).fromNow()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {stats.recent_attempts.length === 0 && (
                                <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                                    No recent login attempts.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
