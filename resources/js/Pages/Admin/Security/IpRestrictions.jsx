import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Shield, ShieldOff, Clock, Plus, AlertTriangle } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export default function IpRestrictions({ restrictions, filters }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        ip_address: '',
        type: 'blacklist',
        reason: '',
        expires_at: ''
    });
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedType, setSelectedType] = useState(filters.type || '');
    const [selectedStatus, setSelectedStatus] = useState(filters.status || '');
    const [selectedItems, setSelectedItems] = useState([]);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('admin.security.ip-restrictions'), {
            search: searchTerm,
            type: selectedType,
            status: selectedStatus
        }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('admin.security.ip-restrictions.store'), formData, {
            onSuccess: () => {
                setIsModalOpen(false);
                setFormData({
                    ip_address: '',
                    type: 'blacklist',
                    reason: '',
                    expires_at: ''
                });
            }
        });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to remove this restriction?')) {
            router.delete(route('admin.security.ip-restrictions.destroy', id));
        }
    };

    const handleBulkDelete = () => {
        if (confirm('Are you sure you want to remove the selected restrictions?')) {
            router.post(route('admin.security.ip-restrictions.bulk-delete'), {
                selected: selectedItems
            });
        }
    };

    return (
        <AdminLayout>
            <Head title="IP Restrictions" />

            <div className="p-6">
                <div className="max-w-7xl mx-auto">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            IP Restrictions
                            {selectedItems.length > 0 && (
                                <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                    ({selectedItems.length} selected)
                                </span>
                            )}
                        </h1>

                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-blue-700"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Add Restriction
                        </button>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by IP or reason..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100"
                                />
                            </div>
                        </div>

                        <select
                            value={selectedType}
                            onChange={(e) => {
                                setSelectedType(e.target.value);
                                router.get(route('admin.security.ip-restrictions'), {
                                    search: searchTerm,
                                    type: e.target.value,
                                    status: selectedStatus
                                }, { preserveState: true });
                            }}
                            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100"
                        >
                            <option value="">All types</option>
                            <option value="blacklist">Blacklist</option>
                            <option value="whitelist">Whitelist</option>
                        </select>

                        <select
                            value={selectedStatus}
                            onChange={(e) => {
                                setSelectedStatus(e.target.value);
                                router.get(route('admin.security.ip-restrictions'), {
                                    search: searchTerm,
                                    type: selectedType,
                                    status: e.target.value
                                }, { preserveState: true });
                            }}
                            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg text-gray-900 dark:text-gray-100"
                        >
                            <option value="">All statuses</option>
                            <option value="active">Active</option>
                            <option value="expired">Expired</option>
                        </select>

                        {selectedItems.length > 0 && (
                            <button
                                onClick={handleBulkDelete}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Delete Selected
                            </button>
                        )}
                    </div>

                    {/* IP Restrictions Table */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="w-4 p-4">
                                    <input
                                        type="checkbox"
                                        checked={selectedItems.length === restrictions.data.length}
                                        onChange={(e) => {
                                            setSelectedItems(
                                                e.target.checked
                                                    ? restrictions.data.map(r => r.id)
                                                    : []
                                            );
                                        }}
                                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                    />
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    IP Address
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Reason
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Added By
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Expires
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {restrictions.data.map((restriction) => (
                                <tr key={restriction.id} className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
                                    <td className="w-4 p-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(restriction.id)}
                                            onChange={(e) => {
                                                setSelectedItems(prev =>
                                                    e.target.checked
                                                        ? [...prev, restriction.id]
                                                        : prev.filter(id => id !== restriction.id)
                                                );
                                            }}
                                            className="rounded border-gray-300 text-blue-600 shadow-sm focus:ring-blue-500"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {restriction.type === 'blacklist' ? (
                                            <div className="flex items-center text-red-600 dark:text-red-400">
                                                <ShieldOff className="h-4 w-4 mr-1.5" />
                                                Blacklist
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-green-600 dark:text-green-400">
                                                <Shield className="h-4 w-4 mr-1.5" />
                                                Whitelist
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4">
                                        {restriction.ip_address}
                                    </td>
                                    <td className="px-6 py-4">
                                        {restriction.reason || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {restriction.creator?.name || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {restriction.expires_at ? (
                                            <div className="flex items-center">
                                                <Clock className="h-4 w-4 mr-1.5 text-gray-400" />
                                                <time title={dayjs(restriction.expires_at).format('YYYY-MM-DD HH:mm:ss')}>
                                                    {dayjs(restriction.expires_at).fromNow()}
                                                </time>
                                            </div>
                                        ) : (
                                            'Never'
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <button
                                            onClick={() => handleDelete(restriction.id)}
                                            className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add IP Restriction Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full p-6">
                        <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                            Add IP Restriction
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    IP Address
                                </label>
                                <input
                                    type="text"
                                    value={formData.ip_address}
                                    onChange={(e) => setFormData({ ...formData, ip_address: e.target.value })}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="192.168.1.1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Type
                                </label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="blacklist">Blacklist</option>
                                    <option value="whitelist">Whitelist</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Reason (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Reason for restriction"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Expires At (Optional)
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.expires_at}
                                    onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                                    className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 dark:bg-gray-900 shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    min={dayjs().format('YYYY-MM-DDTHH:mm')}
                                />
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Add Restriction
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
