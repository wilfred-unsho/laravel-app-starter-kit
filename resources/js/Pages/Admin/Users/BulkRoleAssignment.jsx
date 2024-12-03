import { useState, useEffect } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Shield, Save, Search, RefreshCw } from 'lucide-react';

export default function BulkRoleAssignment({ users, roles, userRoles }) {
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        users: [],
        roles: [],
    });

    // Filter users based on search term
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleUser = (userId) => {
        const newSelection = selectedUsers.includes(userId)
            ? selectedUsers.filter(id => id !== userId)
            : [...selectedUsers, userId];

        setSelectedUsers(newSelection);
        setData('users', newSelection);
    };

    const toggleAllUsers = () => {
        const newSelection = selectedUsers.length === filteredUsers.length
            ? []
            : filteredUsers.map(user => user.id);

        setSelectedUsers(newSelection);
        setData('users', newSelection);
    };

    const handleRoleChange = (roleId) => {
        const currentRoles = [...data.roles];
        const index = currentRoles.indexOf(roleId);

        if (index === -1) {
            currentRoles.push(roleId);
        } else {
            currentRoles.splice(index, 1);
        }

        setData('roles', currentRoles);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        post(route('admin.users.bulk-roles'), {
            onSuccess: () => {
                setSelectedUsers([]);
                setData('roles', []);
                setLoading(false);
            },
        });
    };

    return (
        <AdminLayout>
            <Head title="Bulk Role Assignment" />

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center">
                            <Shield className="h-6 w-6 text-gray-400 mr-3" />
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                Bulk Role Assignment
                            </h2>
                        </div>
                        {loading && (
                            <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />
                        )}
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="space-y-6">
                            {/* Search Users */}
                            <div>
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search users..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-4 py-2 pl-10 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                </div>
                            </div>

                            {/* Users Table */}
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                    <thead className="bg-gray-50 dark:bg-gray-900">
                                    <tr>
                                        <th className="px-6 py-3 text-left">
                                            <input
                                                type="checkbox"
                                                checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                                                onChange={toggleAllUsers}
                                                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                            />
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            Current Roles
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td className="px-6 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedUsers.includes(user.id)}
                                                    onChange={() => toggleUser(user.id)}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </td>
                                            <td className="px-6 py-4">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-wrap gap-2">
                                                    {userRoles[user.id]?.map((role) => (
                                                        <span
                                                            key={role.id}
                                                            className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                                        >
                                                                {role.name}
                                                            </span>
                                                    ))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Role Selection */}
                            <div className="border-t pt-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                                    Select Roles to Assign
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {roles.map((role) => (
                                        <div key={role.id} className="relative flex items-start">
                                            <div className="flex h-5 items-center">
                                                <input
                                                    type="checkbox"
                                                    id={`role-${role.id}`}
                                                    checked={data.roles.includes(role.id)}
                                                    onChange={() => handleRoleChange(role.id)}
                                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                />
                                            </div>
                                            <div className="ml-3">
                                                <label
                                                    htmlFor={`role-${role.id}`}
                                                    className="text-sm font-medium text-gray-700 dark:text-gray-300"
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
                            </div>

                            {/* Error Messages */}
                            {errors.users && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.users}</p>
                            )}
                            {errors.roles && (
                                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.roles}</p>
                            )}

                            {/* Submit Button */}
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={processing || selectedUsers.length === 0 || data.roles.length === 0}
                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    Assign Roles
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
