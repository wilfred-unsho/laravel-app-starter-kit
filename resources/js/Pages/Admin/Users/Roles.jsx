import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Shield, Save } from 'lucide-react';

export default function UserRoles({ user, userRoles, availableRoles, editUrl, backUrl }) {
    const { data, setData, put, processing, errors } = useForm({
        roles: userRoles,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(editUrl);
    };

    const toggleRole = (roleId) => {
        const currentRoles = [...data.roles];
        const index = currentRoles.indexOf(roleId);

        if (index === -1) {
            currentRoles.push(roleId);
        } else {
            currentRoles.splice(index, 1);
        }

        setData('roles', currentRoles);
    };

    return (
        <AdminLayout>
            <Head title={`Manage Roles - ${user.name}`} />

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="p-6">
                    <div className="flex items-center mb-6">
                        <Shield className="h-6 w-6 text-gray-400 mr-3" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                Manage Roles
                            </h2>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Manage roles for {user.name} ({user.email})
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 gap-6">
                                {availableRoles.map((role) => (
                                    <div key={role.id} className="relative flex items-start">
                                        <div className="flex h-6 items-center">
                                            <input
                                                type="checkbox"
                                                id={`role-${role.id}`}
                                                checked={data.roles.includes(role.id)}
                                                onChange={() => toggleRole(role.id)}
                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="ml-3">
                                            <label
                                                htmlFor={`role-${role.id}`}
                                                className="text-sm font-medium text-gray-900 dark:text-white"
                                            >
                                                {role.name}
                                            </label>
                                            {role.description && (
                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                    {role.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {errors.roles && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                    {errors.roles}
                                </p>
                            )}

                            <div className="flex justify-end space-x-3">
                                <a
                                    href={backUrl}
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
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
