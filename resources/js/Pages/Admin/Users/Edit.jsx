
import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { ArrowLeft } from 'lucide-react';

export default function Edit({ user }) {
    const { data, setData, patch, processing, errors } = useForm({
        name: user.name,
        email: user.email,
        password: '',
        password_confirmation: '',
        role: user.role,
        is_active: user.is_active,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        patch(route('admin.users.update', user.id));
    };

    return (
        <AdminLayout>
            <Head title={`Edit User - ${user.name}`} />

            <div className="p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center">
                        <Link
                            href={route('admin.users.index')}
                            className="inline-flex items-center mr-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                            Edit User - {user.name}
                        </h1>
                    </div>
                </div>

                {/* Form */}
                <div className="max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {/* Name */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                                )}
                            </div>

                            {/* Email */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={data.email}
                                    onChange={e => setData('email', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email}</p>
                                )}
                            </div>

                            {/* Password (Optional) */}
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    New Password (leave blank to keep current)
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={data.password}
                                    onChange={e => setData('password', e.target.value)}
                                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.password}</p>
                                )}
                            </div>

                            {/* Password Confirmation */}
                            {data.password && (
                                <div>
                                    <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Confirm New Password
                                    </label>
                                    <input
                                        type="password"
                                        id="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={e => setData('password_confirmation', e.target.value)}
                                        className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                    />
                                </div>
                            )}

                            {/* Role */}
                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Role
                                </label>
                                <select
                                    id="role"
                                    value={data.role}
                                    onChange={e => setData('role', e.target.value)}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                </select>
                                {errors.role && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.role}</p>
                                )}
                            </div>

                            {/* Active Status */}
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                    <input
                                        id="is_active"
                                        type="checkbox"
                                        checked={data.is_active}
                                        onChange={e => setData('is_active', e.target.checked)}
                                        className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 dark:border-gray-700 rounded"
                                    />
                                </div>
                                <div className="ml-3 text-sm">
                                    <label htmlFor="is_active" className="font-medium text-gray-700 dark:text-gray-300">
                                        Active
                                    </label>
                                    <p className="text-gray-500 dark:text-gray-400">User can login and access the system</p>
                                </div>
                            </div>
                        </div>

                        {/* Form Actions */}
                        <div className="mt-6 flex items-center justify-end space-x-3">
                            <Link
                                href={route('admin.users.index')}
                                className="inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-700 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                {processing ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
