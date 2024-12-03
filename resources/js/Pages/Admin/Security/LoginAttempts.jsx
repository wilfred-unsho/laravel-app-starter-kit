import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, AlertCircle, CheckCircle, Monitor, Globe, Smartphone } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import Pagination from '@/Components/Pagination';

dayjs.extend(relativeTime);

export default function LoginAttempts({ attempts, filters }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.security.login-attempts'), {
            search: searchTerm,
            status
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const getDeviceIcon = (device) => {
        switch (device?.toLowerCase()) {
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
            <Head title="Login Attempts" />

            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Login Attempts
                        </h1>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by email or IP..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100"
                                />
                            </div>
                        </div>
                        <select
                            value={status}
                            onChange={(e) => {
                                setStatus(e.target.value);
                                router.get(route('admin.security.login-attempts'), {
                                    search: searchTerm,
                                    status: e.target.value
                                }, { preserveState: true });
                            }}
                            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100"
                        >
                            <option value="">All attempts</option>
                            <option value="success">Successful only</option>
                            <option value="failed">Failed only</option>
                        </select>
                    </div>

                    {/* Attempts Table */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Email/User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    IP Address
                                </th>
                                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Device Info
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Time
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {attempts.data.map((attempt) => (
                                <tr key={attempt.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {attempt.was_successful ? (
                                            <div className="flex items-center text-green-600 dark:text-green-400">
                                                <CheckCircle className="h-5 w-5 mr-1.5" />
                                                <span className="hidden sm:inline">Success</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-red-600 dark:text-red-400">
                                                <AlertCircle className="h-5 w-5 mr-1.5" />
                                                <span className="hidden sm:inline">Failed</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm">
                                            {attempt.user ? (
                                                <Link
                                                    href={route('admin.users.show', attempt.user.id)}
                                                    className="text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                                                >
                                                    {attempt.user.name}
                                                </Link>
                                            ) : (
                                                <span className="text-gray-500 dark:text-gray-400">
                                                        {attempt.email}
                                                    </span>
                                            )}
                                        </div>
                                        {attempt.failure_reason && (
                                            <div className="text-xs text-red-500 dark:text-red-400 mt-1">
                                                {attempt.failure_reason}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {attempt.ip_address}
                                    </td>
                                    <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                            {getDeviceIcon(attempt.device)}
                                            <span className="ml-2">
                                                    {attempt.browser} / {attempt.platform}
                                                </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        <time title={dayjs(attempt.created_at).format('YYYY-MM-DD HH:mm:ss')}>
                                            {dayjs(attempt.created_at).fromNow()}
                                        </time>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                            <Pagination links={attempts.links} />
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
