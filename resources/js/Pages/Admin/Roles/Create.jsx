import { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Shield, Save, Info, Copy, Plus } from 'lucide-react';
import PasswordStrengthMeter from '@/Components/PasswordStrengthMeter';

export default function CreateRole({ permissions }) {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        permissions: [],
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.roles.store'));
    };

    const togglePermission = (permissionId) => {
        const currentPermissions = [...data.permissions];
        const index = currentPermissions.indexOf(permissionId);

        if (index === -1) {
            currentPermissions.push(permissionId);
        } else {
            currentPermissions.splice(index, 1);
        }

        setData('permissions', currentPermissions);
    };

    return (
        <AdminLayout>
            <Head title="Create Role" />

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="p-6">
                    <div className="flex items-center mb-6">
                        <Shield className="h-6 w-6 text-gray-400 mr-3" />
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Create New Role
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                        Role Management
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        Manage roles and their permissions
                                    </p>
                                </div>
                                <div className="flex space-x-4">
                                    <Link
                                        href={route('admin.roles.templates.index')}
                                        className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                                    >
                                        <Copy className="w-4 h-4 mr-2"/>
                                        Role Templates
                                    </Link>
                                    <Link
                                        href={route('admin.roles.create')}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                                    >
                                        <Plus className="w-4 h-4 mr-2"/>
                                        Add Role
                                    </Link>
                                </div>
                            </div>

                            {/* Template Selection */}
                            <div
                                className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-lg p-4 mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <Info className="h-5 w-5 text-yellow-400" aria-hidden="true"/>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                            Quick Tip
                                        </h3>
                                        <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                                            <p>
                                                You can use Role Templates to quickly create pre-configured roles with
                                                common permission sets.{' '}
                                                <Link
                                                    href={route('admin.roles.templates.index')}
                                                    className="font-medium text-yellow-800 dark:text-yellow-200 underline hover:text-yellow-600 dark:hover:text-yellow-100"
                                                >
                                                    View Templates
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Role Name */}
                            <div>
                                <label htmlFor="name"
                                       className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Role Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor="description"
                                       className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    rows={3}
                                    className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                                {errors.description && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                                )}
                            </div>

                            {/* Permissions */}
                            <div>
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    Permissions
                                </h3>
                                <div className="space-y-6">
                                    {Object.entries(permissions).map(([group, groupPermissions]) => (
                                        <div key={group} className="space-y-2">
                                            <h4 className="text-md font-medium text-gray-700 dark:text-gray-300">
                                                {group}
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {groupPermissions.map((permission) => (
                                                    <div key={permission.id} className="relative flex items-start">
                                                        <div className="flex h-5 items-center">
                                                            <input
                                                                type="checkbox"
                                                                checked={data.permissions.includes(permission.id)}
                                                                onChange={() => togglePermission(permission.id)}
                                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                        <div className="ml-3 text-sm">
                                                            <label
                                                                className="font-medium text-gray-700 dark:text-gray-300">
                                                                {permission.name}
                                                            </label>
                                                            {permission.description && (
                                                                <p className="text-gray-500 dark:text-gray-400">
                                                                    {permission.description}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                {errors.permissions && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.permissions}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4 mr-2"/>
                                    Save Role
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
