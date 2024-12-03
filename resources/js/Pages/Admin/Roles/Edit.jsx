import {useState} from 'react';
import {Head, useForm} from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {Shield, Save} from 'lucide-react';
import PasswordStrengthMeter from '@/Components/PasswordStrengthMeter';

export default function EditRole({role, permissions, rolePermissions}) {
    const {data, setData, put, processing, errors} = useForm({
        name: role.name,
        description: role.description,
        permissions: rolePermissions,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.roles.update', role.id));
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
            <Head title={`Edit Role - ${role.name}`}/>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="p-6">
                    <div className="flex items-center mb-6">
                        <Shield className="h-6 w-6 text-gray-400 mr-3"/>
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                Edit Role
                            </h2>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Slug: {role.slug}
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
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
                                    disabled={role.is_system}
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
                                    disabled={role.is_system}
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
                                                {group.split('-').map(word =>
                                                    word.charAt(0).toUpperCase() + word.slice(1)
                                                ).join(' ')}
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                {groupPermissions.map((permission) => (
                                                    <div key={permission.id} className="relative flex items-start">
                                                        <div className="flex h-5 items-center">
                                                            <input
                                                                type="checkbox"
                                                                id={`permission-${permission.id}`}
                                                                checked={data.permissions.includes(permission.id)}
                                                                onChange={() => togglePermission(permission.id)}
                                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                        </div>
                                                        <div className="ml-3">
                                                            <label
                                                                htmlFor={`permission-${permission.id}`}
                                                                className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                                            >
                                                                {permission.name}
                                                            </label>
                                                            {permission.description && (
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
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
                            <div className="flex justify-end space-x-3">
                                <a
                                    href={route('admin.roles.index')}
                                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Cancel
                                </a>
                                <button
                                    type="submit"
                                    disabled={processing || role.is_system}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4 mr-2"/>
                                    Update Role
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
