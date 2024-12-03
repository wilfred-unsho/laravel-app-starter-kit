import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ template }) {
    const { data, setData, put, processing, errors } = useForm({
        name: template.name,
        description: template.description,
        layout: template.layout,
        meta_schema: template.meta_schema || {}
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.page-templates.update', template.id));
    };

    return (
        <AdminLayout>
            <Head title="Edit Template" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h1 className="text-2xl font-semibold mb-6">Edit Template: {template.name}</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-1">Name</label>
                            <input
                                type="text"
                                value={data.name}
                                onChange={e => setData('name', e.target.value)}
                                className="w-full rounded-md border-gray-300"
                            />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Description</label>
                            <textarea
                                value={data.description}
                                onChange={e => setData('description', e.target.value)}
                                className="w-full rounded-md border-gray-300"
                                rows={3}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Layout Options</label>
                            <div className="space-y-2">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.layout.header}
                                        onChange={e => setData('layout', { ...data.layout, header: e.target.checked })}
                                        className="rounded border-gray-300"
                                    />
                                    <span className="ml-2">Show Header</span>
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.layout.sidebar}
                                        onChange={e => setData('layout', { ...data.layout, sidebar: e.target.checked })}
                                        className="rounded border-gray-300"
                                    />
                                    <span className="ml-2">Show Sidebar</span>
                                </label>

                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={data.layout.footer}
                                        onChange={e => setData('layout', { ...data.layout, footer: e.target.checked })}
                                        className="rounded border-gray-300"
                                    />
                                    <span className="ml-2">Show Footer</span>
                                </label>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Width</label>
                            <select
                                value={data.layout.width}
                                onChange={e => setData('layout', { ...data.layout, width: e.target.value })}
                                className="w-full rounded-md border-gray-300"
                            >
                                <option value="contained">Contained</option>
                                <option value="full">Full Width</option>
                            </select>
                        </div>

                        <div className="flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => window.history.back()}
                                className="px-4 py-2 border rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
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
