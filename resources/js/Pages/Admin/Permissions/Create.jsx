import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Lock, Save } from 'lucide-react';

const permissionGroups = [
    'user-management',
    'role-management',
    'permission-management',
    'content-management',
    'system-settings',
];

export default function CreatePermission() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        group: permissionGroups[0],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.permissions.store'));
    };

    return (
        <AdminLayout>
            <Head title="Create Permission" />

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="p-6">
                    <div className="flex items-center mb-6">
                        <Lock className="h-6 w-6 text-gray-400 mr-3" />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Create New Permission
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {/* Permission Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Permission Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="e.g., View Users"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    placeholder="Describe what this permission allows"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                                )}
                            </div>

                            {/* Permission Group */}
                            <div>
                                <label htmlFor="group" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Group
                                </label>
                                <select
                                    id="group"
                                    value={data.group}
                                    onChange={e => setData('group', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    {permissionGroups.map(group => (
                                        <option key={group} value={group}>
                                            {group.split('-').map(word =>
                                                word.charAt(0).toUpperCase() + word.slice(1)
                                            ).join(' ')}
                                        </option>
                                    ))}
                                </select>
                                {errors.group && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.group}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end space-x-3">
                                <a
                                    href={route('admin.permissions.index')}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </a>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Create Permission
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
