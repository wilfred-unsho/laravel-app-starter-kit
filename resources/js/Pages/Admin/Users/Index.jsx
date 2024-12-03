import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Search, Download, UserPlus, ChevronDown } from 'lucide-react';
import { Dropdown } from '@/Components/Dropdown/index';
import Pagination from '@/Components/Pagination';

export default function Users({ users, filters, can }) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [processing, setProcessing] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get('/admin/users', { search: searchTerm }, {
            preserveState: true,
            preserveScroll: true
        });
    };

    const toggleSelectAll = () => {
        setSelectedUsers(prev =>
            prev.length === users.data.length ? [] : users.data.map(user => user.id)
        );
    };

    const toggleSelect = (userId) => {
        setSelectedUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleExport = (format) => {
        router.post(route('admin.users.export'), {
            format,
            selected: selectedUsers.length ? selectedUsers : null
        });
    };

    const handleDelete = (userId) => {
        if (confirm('Are you sure you want to delete this user?')) {
            router.delete(`/admin/users/${userId}`);
        }
    };

    return (
        <AdminLayout>
            <Head title="User Management" />

            <div className="p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
                        User Management
                        {selectedUsers.length > 0 && (
                            <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                                ({selectedUsers.length} selected)
                            </span>
                        )}
                    </h1>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => handleExport('csv')}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800
                                border border-gray-300 dark:border-gray-700 rounded-lg text-sm
                                text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                                transition-colors duration-200"
                        >
                            <Download className="h-4 w-4" />
                            CSV
                        </button>
                        <button
                            onClick={() => handleExport('xlsx')}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800
                                border border-gray-300 dark:border-gray-700 rounded-lg text-sm
                                text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700
                                transition-colors duration-200"
                        >
                            <Download className="h-4 w-4" />
                            Excel
                        </button>
                        <Link
                            href={route('admin.users.create')}
                            className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600
                                text-white rounded-lg text-sm hover:bg-blue-700 transition-colors duration-200"
                        >
                            <UserPlus className="h-4 w-4" />
                            Add User
                        </Link>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch(e)}
                        className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border
                            border-gray-300 dark:border-gray-700 rounded-lg text-gray-900
                            dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400
                            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                </div>

                {/* Table */}
                <div className="relative overflow-x-auto bg-white dark:bg-gray-800
                    rounded-lg border border-gray-200 dark:border-gray-700">
                    <table className="w-full text-left text-gray-900 dark:text-gray-100">
                        <thead className="text-xs uppercase bg-gray-50 dark:bg-gray-900/50">
                        <tr>
                            <th className="p-4 w-4">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 dark:border-gray-700
                                            text-blue-600 shadow-sm focus:ring-blue-500
                                            dark:focus:ring-offset-gray-800"
                                    checked={selectedUsers.length === users.data.length}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">Name</th>
                            <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">Email</th>
                            <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">Role</th>
                            <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium">Status</th>
                            <th className="px-6 py-3 text-gray-500 dark:text-gray-400 font-medium text-right">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {users.data.map((user) => (
                            <tr
                                key={user.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                            >
                                <td className="p-4 w-4">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 dark:border-gray-700
                                                text-blue-600 shadow-sm focus:ring-blue-500
                                                dark:focus:ring-offset-gray-800"
                                        checked={selectedUsers.includes(user.id)}
                                        onChange={() => toggleSelect(user.id)}
                                    />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">
                                    {user.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-300">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs
                                            font-medium bg-gray-100 dark:bg-gray-900 text-gray-800
                                            dark:text-gray-200 capitalize">
                                            {user.role}
                                        </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs
                                            font-medium capitalize ${
                                            user.is_active
                                                ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                                                : 'bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-gray-300'
                                        }`}>
                                            {user.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button className="inline-flex items-center gap-x-1.5 text-sm text-gray-500
            dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                                                Actions
                                                <ChevronDown className="h-4 w-4" />
                                            </button>
                                        </Dropdown.Trigger>
                                        <Dropdown.Content>
                                            {/* View Profile */}
                                            <Dropdown.Link href={route('admin.users.profile.show', user.id)}>
                                                View Profile
                                            </Dropdown.Link>

                                            {/* Edit User */}
                                            {can.edit_users && (
                                                <Dropdown.Link href={route('admin.users.edit', user.id)}>
                                                    Edit User
                                                </Dropdown.Link>
                                            )}

                                            {/* View Activity */}
                                            <Dropdown.Link href={route('admin.users.activity', user.id)}>
                                                View Activity
                                            </Dropdown.Link>

                                            {/* Delete User */}
                                            {can.delete_users && (
                                                <Dropdown.Button
                                                    className="text-red-600 dark:text-red-400"
                                                    onClick={() => handleDelete(user.id)}
                                                >
                                                    Delete User
                                                </Dropdown.Button>
                                            )}
                                        </Dropdown.Content>
                                    </Dropdown>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>

                <Pagination links={users.links}/>
            </div>
        </AdminLayout>
    );
}
