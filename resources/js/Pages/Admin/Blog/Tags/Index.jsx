import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Edit, Trash2, Tag as TagIcon, Search, X } from 'lucide-react';

export default function Index({ tags }) {
    const [selectedTags, setSelectedTags] = useState([]);
    const [editingTag, setEditingTag] = useState(null);
    const [showNewForm, setShowNewForm] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        description: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingTag) {
            put(route('admin.blog.tags.update', editingTag.id), {
                onSuccess: () => {
                    setEditingTag(null);
                    reset();
                }
            });
        } else {
            post(route('admin.blog.tags.store'), {
                onSuccess: () => {
                    setShowNewForm(false);
                    reset();
                }
            });
        }
    };

    const handleBulkDelete = () => {
        if (!selectedTags.length) return;

        if (confirm(`Are you sure you want to delete ${selectedTags.length} tags?`)) {
            post(route('admin.blog.tags.bulk-destroy'), {
                data: { tags: selectedTags },
                onSuccess: () => setSelectedTags([])
            });
        }
    };

    const filteredTags = tags.filter(tag =>
        tag.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tag.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <AdminLayout>
            <Head title="Blog Tags" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-semibold">Tags</h1>
                            <button
                                onClick={() => {
                                    setShowNewForm(true);
                                    setEditingTag(null);
                                    reset();
                                }}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                New Tag
                            </button>
                        </div>

                        {/* Search & Actions */}
                        <div className="mt-4 flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <input
                                    type="text"
                                    placeholder="Search tags..."
                                    value={searchQuery}
                                    onChange={e => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border rounded-lg"
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>

                            {selectedTags.length > 0 && (
                                <button
                                    onClick={handleBulkDelete}
                                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                >
                                    <Trash2 className="w-5 h-5 mr-2" />
                                    Delete Selected ({selectedTags.length})
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Tag Form */}
                    {(showNewForm || editingTag) && (
                        <div className="p-6 border-b border-gray-200 bg-gray-50">
                            <form onSubmit={handleSubmit} className="max-w-2xl">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={e => setData('name', e.target.value)}
                                            className="mt-1 block w-full rounded-md border-gray-300"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Description
                                        </label>
                                        <textarea
                                            value={data.description}
                                            onChange={e => setData('description', e.target.value)}
                                            rows={3}
                                            className="mt-1 block w-full rounded-md border-gray-300"
                                        />
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowNewForm(false);
                                                setEditingTag(null);
                                                reset();
                                            }}
                                            className="px-4 py-2 border rounded-md hover:bg-gray-50"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={processing}
                                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                                        >
                                            {processing ? 'Saving...' : editingTag ? 'Update' : 'Create'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Tags Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-6">
                        {filteredTags.map(tag => (
                            <div
                                key={tag.id}
                                className={`relative group border rounded-lg p-4 transition-colors ${
                                    selectedTags.includes(tag.id)
                                        ? 'border-blue-500 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="flex items-start">
                                    <input
                                        type="checkbox"
                                        checked={selectedTags.includes(tag.id)}
                                        onChange={e => {
                                            setSelectedTags(prev =>
                                                e.target.checked
                                                    ? [...prev, tag.id]
                                                    : prev.filter(id => id !== tag.id)
                                            );
                                        }}
                                        className="mt-1 rounded border-gray-300"
                                    />
                                    <div className="ml-3 flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-sm font-medium">
                                                {tag.name}
                                            </h3>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => {
                                                        setEditingTag(tag);
                                                        setData({
                                                            name: tag.name,
                                                            description: tag.description
                                                        });
                                                    }}
                                                    className="text-blue-600 hover:text-blue-700"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        if (confirm('Are you sure you want to delete this tag?')) {
                                                            destroy(route('admin.blog.tags.destroy', tag.id));
                                                        }
                                                    }}
                                                    className="text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            {tag.description || 'No description'}
                                        </p>
                                        <div className="mt-2 text-xs text-gray-500">
                                            {tag.posts_count} posts
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
