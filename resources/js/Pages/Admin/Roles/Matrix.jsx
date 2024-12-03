import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Shield, Save, Search, Check, Minus } from 'lucide-react';

const PermissionCell = ({ roleId, permission, hasPermission, inherited, onChange }) => {
    return (
        <td className="px-4 py-2 text-center">
            <button
                type="button"
                onClick={() => onChange(roleId, permission.id)}
                className={`p-1 rounded-md ${
                    inherited
                        ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed'
                        : hasPermission
                            ? 'bg-green-100 dark:bg-green-900 hover:bg-green-200 dark:hover:bg-green-800'
                            : 'bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                }`}
                disabled={inherited}
                title={inherited ? 'Inherited from parent role' : ''}
            >
                {inherited ? (
                    <Minus className="w-4 h-4 text-gray-400" />
                ) : hasPermission ? (
                    <Check className="w-4 h-4 text-green-600 dark:text-green-400" />
                ) : (
                    <div className="w-4 h-4" />
                )}
            </button>
        </td>
    );
};

export default function PermissionMatrix({ roles, permissions: allPermissions }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGroup, setSelectedGroup] = useState('all');
    const { data, setData, post, processing } = useForm({
        permissions: roles.reduce((acc, role) => {
            acc[role.id] = role.permissions.reduce((pAcc, p) => {
                pAcc[p.id] = p.has_permission;
                return pAcc;
            }, {});
            return acc;
        }, {}),
    });

    const groups = ['all', ...new Set(allPermissions.map(p => p.group))];

    const filteredPermissions = allPermissions.filter(permission => {
        const matchesSearch = permission.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGroup = selectedGroup === 'all' || permission.group === selectedGroup;
        return matchesSearch && matchesGroup;
    });

    const handlePermissionToggle = (roleId, permissionId) => {
        setData('permissions', {
            ...data.permissions,
            [roleId]: {
                ...data.permissions[roleId],
                [permissionId]: !data.permissions[roleId][permissionId]
            }
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.roles.matrix.update'));
    };

    return (
        <AdminLayout>
            <Head title="Permission Matrix" />

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                Permission Matrix
                            </h2>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Manage role permissions in a matrix view
                            </p>
                        </div>
                    </div>

                    <div className="mb-6 flex space-x-4">
                        {/* Search */}
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Search permissions..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Group Filter */}
                        <div>
                            <select
                                value={selectedGroup}
                                onChange={(e) => setSelectedGroup(e.target.value)}
                                className="w-48 px-4 py-2 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                {groups.map(group => (
                                    <option key={group} value={group}>
                                        {group === 'all' ? 'All Groups' : group.split('-').map(word =>
                                            word.charAt(0).toUpperCase() + word.slice(1)
                                        ).join(' ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit}>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-900">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Permission
                                    </th>
                                    {roles.map(role => (
                                        <th key={role.id} className="px-4 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                            {role.name}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                {filteredPermissions.map(permission => (
                                    <tr key={permission.id}>
                                        <td className="px-4 py-2 whitespace-nowrap">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {permission.name}
                                                </div>
                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                    {permission.group}
                                                </div>
                                            </div>
                                        </td>
                                        {roles.map(role => (
                                            <PermissionCell
                                                key={`${role.id}-${permission.id}`}
                                                roleId={role.id}
                                                permission={permission}
                                                hasPermission={data.permissions[role.id][permission.id]}
                                                inherited={role.parent_id && roles.find(r => r.id === role.parent_id)?.permissions.some(p => p.id === permission.id)}
                                                onChange={handlePermissionToggle}
                                            />
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-6 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                            >
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AdminLayout>
    );
}
