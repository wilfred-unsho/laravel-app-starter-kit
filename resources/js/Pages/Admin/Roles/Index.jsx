import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Plus, Search, Edit, Trash2, Shield, ChevronRight, ChevronDown, Copy, Info } from 'lucide-react';
import Pagination from '@/Components/Pagination';

const RoleTreeItem = ({ role, level = 0, expanded, onToggle, onEdit, onDelete }) => {
    const hasChildren = role.children && role.children.length > 0;
    const indentClass = `pl-${level * 6}`;

    return (
        <>
            <tr className={level > 0 ? 'bg-gray-50 dark:bg-gray-900' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">
                    <div className={`flex items-center ${indentClass}`}>
                        {hasChildren && (
                            <button
                                onClick={() => onToggle(role.id)}
                                className="mr-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                {expanded.includes(role.id) ? (
                                    <ChevronDown className="w-4 h-4" />
                                ) : (
                                    <ChevronRight className="w-4 h-4" />
                                )}
                            </button>
                        )}
                        <Shield className="h-5 w-5 text-gray-400 mr-3" />
                        <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {role.name}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                {role.slug}
                            </div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-white">
                        {role.description || 'No description'}
                    </div>
                </td>
                <td className="px-6 py-4">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                        {role.users_count} users
                    </span>
                </td>
                <td className="px-6 py-4">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                        {role.permissions_count} permissions
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {!role.is_system && (
                        <>
                            <button
                                onClick={() => onEdit(role.id)}
                                className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-4"
                            >
                                <Edit className="h-4 w-4 inline" />
                            </button>
                            <button
                                onClick={() => onDelete(role.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                            >
                                <Trash2 className="h-4 w-4 inline" />
                            </button>
                        </>
                    )}
                </td>
            </tr>
            {hasChildren && expanded.includes(role.id) && role.children.map(child => (
                <RoleTreeItem
                    key={child.id}
                    role={child}
                    level={level + 1}
                    expanded={expanded}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                />
            ))}
        </>
    );
};

export default function RolesIndex({ roles }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRoles, setExpandedRoles] = useState([]);

    const toggleRole = (roleId) => {
        setExpandedRoles(prev =>
            prev.includes(roleId)
                ? prev.filter(id => id !== roleId)
                : [...prev, roleId]
        );
    };

    const handleEdit = (roleId) => {
        window.location.href = route('admin.roles.edit', roleId);
    };

    const handleDelete = async (roleId) => {
        if (confirm('Are you sure you want to delete this role?')) {
            await router.delete(route('admin.roles.destroy', roleId));
        }
    };

    const filterRoles = (roles, term) => {
        if (!term) return roles;

        return roles.filter(role => {
            const matchesSearch =
                role.name.toLowerCase().includes(term.toLowerCase()) ||
                role.description?.toLowerCase().includes(term.toLowerCase());

            const hasMatchingChildren = role.children &&
                role.children.some(child =>
                    child.name.toLowerCase().includes(term.toLowerCase()) ||
                    child.description?.toLowerCase().includes(term.toLowerCase())
                );

            return matchesSearch || hasMatchingChildren;
        });
    };

    const filteredRoles = filterRoles(roles || [], searchTerm);

    return (
        <AdminLayout>
            <Head title="Role Management" />

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="p-6">
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
                                href="/admin/roles/templates"
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
                                        You can use Role Templates to quickly create pre-configured roles with common
                                        permission sets.{' '}
                                        <Link
                                            href="/admin/roles/templates"
                                            className="font-medium text-yellow-800 dark:text-yellow-200 underline hover:text-yellow-600 dark:hover:text-yellow-100"
                                        >
                                            View Templates
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search roles..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 pl-10 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"/>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead className="bg-gray-50 dark:bg-gray-900">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Role Name
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Description
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Users
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Permissions
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                            </thead>
                            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredRoles.map(role => (
                                <RoleTreeItem
                                    key={role.id}
                                    role={role}
                                    level={0}
                                    expanded={expandedRoles}
                                    onToggle={toggleRole}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
