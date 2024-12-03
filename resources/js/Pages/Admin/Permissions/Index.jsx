import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Search, Edit, Trash2, Lock } from 'lucide-react';
import Pagination from '@/Components/Pagination';

export default function PermissionsIndex({ permissions }) {
    const [searchTerm, setSearchTerm] = useState('');

    return (
        <AdminLayout>
            <Head title="Permission Management" />

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Permission Management
                        </h2>
                        <Link
                            href={route('admin.permissions.create')}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Permission
                        </Link>
                    </div>

                    <div className="mb-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search permissions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 pl-10 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Permission Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Group
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {permissions.data.filter(permission =>
                                permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                permission.description?.toLowerCase().includes(searchTerm.toLowerCase())
                            ).map((permission) => (
                                <tr key={permission.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Lock className="h-5 w-5 text-gray-400 mr-3" />
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {permission.name}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {permission.slug}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                                                {permission.group}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900 dark:text-white">
                                            {permission.description || 'No description'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link
                                            href={route('admin.permissions.edit', permission.id)}
                                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                                        >
                                            <Edit className="h-4 w-4 inline" />
                                        </Link>
                                        <Link
                                            href={route('admin.permissions.destroy', permission.id)}
                                            method="delete"
                                            as="button"
                                            className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                        >
                                            <Trash2 className="h-4 w-4 inline" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6">
                        <Pagination links={permissions.links} />
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
