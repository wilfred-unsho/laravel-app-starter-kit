import {useState} from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import {Head, Link} from '@inertiajs/react';
import {Plus, Edit, Trash2, Eye} from 'lucide-react';

export default function Index({pages}) {
    return (
        <AdminLayout>
            <Head title="Pages"/>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-semibold">Pages</h1>
                            <Link
                                href={route('admin.pages.create')}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="w-4 h-4 mr-2"/>
                                New Page
                            </Link>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Updated</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                            {pages.data.map((page) => (
                                <tr key={page.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">{page.title}</div>
                                        <div className="text-sm text-gray-500">{page.slug}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                            <span
                                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    page.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {page.status}
                                            </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(page.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(page.updated_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end items-center space-x-2">
                                            <Link
                                                href={route('admin.pages.preview', page.id)}
                                                className="text-gray-400 hover:text-gray-500"
                                            >
                                                <Eye className="w-4 h-4"/>
                                            </Link>
                                            <Link
                                                href={route('admin.pages.edit', page.id)}
                                                className="text-blue-600 hover:text-blue-700"
                                            >
                                                <Edit className="w-4 h-4"/>
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this page?')) {
                                                        // Handle delete
                                                    }
                                                }}
                                                className="text-red-600 hover:text-red-700"
                                            >
                                                <Trash2 className="w-4 h-4"/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
