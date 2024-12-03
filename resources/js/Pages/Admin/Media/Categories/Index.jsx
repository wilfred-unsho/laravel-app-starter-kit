import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Plus, X, FolderOpen, Pencil, Trash2 } from 'lucide-react';

export default function Index({ categories }) {
    const [showNewForm, setShowNewForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        description: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        if (editingCategory) {
            put(route('admin.media-categories.update', editingCategory.id), {
                onSuccess: () => {
                    reset();
                    setEditingCategory(null);
                }
            });
        } else {
            post(route('admin.media-categories.store'), {
                onSuccess: () => {
                    reset();
                    setShowNewForm(false);
                }
            });
        }
    };

    const startEdit = (category) => {
        setEditingCategory(category);
        setData({
            name: category.name,
            description: category.description || ''
        });
        setShowNewForm(true);
    };

    return (
        <AdminLayout>
            <Head title="Media Categories" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Media Categories</h2>
                            <button
                                onClick={() => {
                                    setShowNewForm(true);
                                    setEditingCategory(null);
                                    reset();
                                }}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                New Category
                            </button>
                        </div>

                        {showNewForm && (
                            <div className="mb-8 bg-gray-50 dark:bg-gray-900 p-6 rounded-lg">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                        {editingCategory ? 'Edit Category' : 'New Category'}
                                    </h3>
                                    <button
                                        onClick={() => {
                                            setShowNewForm(false);
                                            setEditingCategory(null);
                                            reset();
                                        }}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Name
                                            </label>
                                            <input
                                                type="text"
                                                value={data.name}
                                                onChange={e => setData('name', e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                                required
                                            />
                                            {errors.name && (
                                                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                                            )}
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                                Description
                                            </label>
                                            <textarea
                                                value={data.description}
                                                onChange={e => setData('description', e.target.value)}
                                                rows="3"
                                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
                                            />
                                        </div>
                                        <div className="flex justify-end">
                                            <button
                                                type="submit"
                                                disabled={processing}
                                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                            >
                                                {processing ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            {categories.map(category => (
                                <div
                                    key={category.id}
                                    className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow duration-200"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center">
                                            <FolderOpen className="w-5 h-5 text-blue-500 mr-3" />
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                                    {category.name}
                                                </h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    {category.files_count} files
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => startEdit(category)}
                                                className="p-1 text-gray-400 hover:text-gray-500"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => {
                                                    if (confirm('Are you sure you want to delete this category?')) {
                                                        window.location.href = route('admin.media-categories.destroy', category.id);
                                                    }
                                                }}
                                                className="p-1 text-gray-400 hover:text-red-500"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                    {category.description && (
                                        <p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                                            {category.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
