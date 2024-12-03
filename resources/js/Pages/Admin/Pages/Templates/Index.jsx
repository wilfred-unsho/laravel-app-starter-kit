import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link } from '@inertiajs/react';
import { Plus, Edit, Trash2, Layout } from 'lucide-react';

export default function Index({ templates }) {
    return (
        <AdminLayout>
            <Head title="Page Templates" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow">
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-semibold">Page Templates</h1>
                            <Link
                                href={route('admin.page-templates.create')}
                                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                New Template
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                        {templates.map(template => (
                            <div key={template.id} className="border rounded-lg p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-lg font-medium">{template.name}</h3>
                                        <p className="text-sm text-gray-500 mt-1">{template.description}</p>
                                    </div>
                                    <Layout className="text-gray-400 w-6 h-6" />
                                </div>

                                <div className="mt-6 flex items-center justify-end space-x-3">
                                    <Link
                                        href={route('admin.page-templates.edit', template.id)}
                                        className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => {
                                            if (confirm('Are you sure you want to delete this template?')) {
                                                // Handle delete
                                            }
                                        }}
                                        className="text-sm font-medium text-red-600 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
