// resources/js/Pages/Admin/Media/Collections/Index.jsx
import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { Plus, Folder, X } from 'lucide-react';

export default function Index({ collections }) {
    const [showNewForm, setShowNewForm] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        description: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('admin.media-collections.store'), {
            onSuccess: () => {
                reset();
                setShowNewForm(false);
            }
        });
    };

    return (
        <AdminLayout>
            <Head title="Media Collections" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">Media Collections</h2>
                    <button
                        onClick={() => setShowNewForm(true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        New Collection
                    </button>
                </div>

                {showNewForm && (
                    <div className="mb-6 bg-white p-4 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium">New Collection</h3>
                            <button onClick={() => setShowNewForm(false)}>
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Description</label>
                                <textarea
                                    value={data.description}
                                    onChange={e => setData('description', e.target.value)}
                                    className="w-full border-gray-300 rounded-md shadow-sm"
                                    rows="3"
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={processing}
                                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                            >
                                {processing ? 'Creating...' : 'Create Collection'}
                            </button>
                        </form>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {collections.map(collection => (
                        <div key={collection.id} className="bg-white p-4 rounded-lg shadow">
                            <div className="flex items-center gap-3 mb-2">
                                <Folder className="w-6 h-6 text-blue-500" />
                                <h3 className="text-lg font-medium">{collection.name}</h3>
                            </div>
                            {collection.description && (
                                <p className="text-gray-600 text-sm mb-2">{collection.description}</p>
                            )}
                            <div className="flex justify-between items-center text-sm text-gray-500">
                                <span>{collection.files_count} files</span>
                                <a
                                    href={route('admin.media.index', { collection: collection.slug })}
                                    className="text-blue-500 hover:text-blue-600"
                                >
                                    View Files
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
