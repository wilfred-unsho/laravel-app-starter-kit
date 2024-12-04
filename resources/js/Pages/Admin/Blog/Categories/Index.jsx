import { useState } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import {
    Plus, Edit, Trash2, MoveUp, MoveDown, Folder,
    ChevronRight, ChevronDown
} from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export default function Index({ categories }) {
    const [showNewForm, setShowNewForm] = useState(false);
    const [editingCategory, setEditingCategory] = useState(null);
    const [expandedCategories, setExpandedCategories] = useState([]);

    const { data, setData, post, put, processing, errors, reset } = useForm({
        name: '',
        description: '',
        parent_id: null,
        order: 0
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (editingCategory) {
            put(route('admin.blog.categories.update', editingCategory.id), {
                onSuccess: () => {
                    setEditingCategory(null);
                    reset();
                }
            });
        } else {
            post(route('admin.blog.categories.store'), {
                onSuccess: () => {
                    setShowNewForm(false);
                    reset();
                }
            });
        }
    };

    const toggleCategory = (categoryId) => {
        setExpandedCategories(prev =>
            prev.includes(categoryId)
                ? prev.filter(id => id !== categoryId)
                : [...prev, categoryId]
        );
    };

    const handleDragEnd = ({ source, destination }) => {
        if (!destination) return;

        const reorderedCategories = Array.from(categories);
        const [movedCategory] = reorderedCategories.splice(source.index, 1);
        reorderedCategories.splice(destination.index, 0, movedCategory);

        // Update order values
        const updatedCategories = reorderedCategories.map((category, index) => ({
            id: category.id,
            order: index
        }));

        // Send to server
        post(route('admin.blog.categories.reorder'), {
            categories: updatedCategories
        });
    };

    return (
        <AdminLayout>
            <Head title="Blog Categories" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow">
                    {/* Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-semibold">Categories</h1>
                            <button
                                onClick={() => {
                                    setShowNewForm(true);
                                    setEditingCategory(null);
                                    reset();
                                }}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                New Category
                            </button>
                        </div>
                    </div>

                    {/* Category Form */}
                    {(showNewForm || editingCategory) && (
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

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">
                                            Parent Category
                                        </label>
                                        <select
                                            value={data.parent_id || ''}
                                            onChange={e => setData('parent_id', e.target.value || null)}
                                            className="mt-1 block w-full rounded-md border-gray-300"
                                        >
                                            <option value="">None</option>
                                            {categories.map(category => (
                                                <option
                                                    key={category.id}
                                                    value={category.id}
                                                    disabled={editingCategory?.id === category.id}
                                                >
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowNewForm(false);
                                                setEditingCategory(null);
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
                                            {processing ? 'Saving...' : editingCategory ? 'Update' : 'Create'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Categories List */}
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <Droppable droppableId="categories">
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    className="divide-y divide-gray-200"
                                >
                                    {categories.map((category, index) => (
                                        <Draggable
                                            key={category.id}
                                            draggableId={category.id.toString()}
                                            index={index}
                                        >
                                            {(provided) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    className="p-4 hover:bg-gray-50"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            <div {...provided.dragHandleProps} className="mr-3">
                                                                <MoveUp className="w-5 h-5 text-gray-400" />
                                                            </div>
                                                            <button
                                                                onClick={() => toggleCategory(category.id)}
                                                                className="mr-2"
                                                            >
                                                                {expandedCategories.includes(category.id)
                                                                    ? <ChevronDown className="w-5 h-5" />
                                                                    : <ChevronRight className="w-5 h-5" />
                                                                }
                                                            </button>
                                                            <Folder className="w-5 h-5 mr-2 text-gray-400" />
                                                            <div>
                                                                <h3 className="text-sm font-medium">{category.name}</h3>
                                                                {category.parent && (
                                                                    <p className="text-xs text-gray-500">
                                                                        Parent: {category.parent.name}
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-3">
                                                            <span className="text-sm text-gray-500">
                                                                {category.posts_count} posts
                                                            </span>
                                                            <button
                                                                onClick={() => {
                                                                    setEditingCategory(category);
                                                                    setData({
                                                                        name: category.name,
                                                                        description: category.description,
                                                                        parent_id: category.parent?.id || null
                                                                    });
                                                                }}
                                                                className="text-blue-600 hover:text-blue-700"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => {
                                                                    if (confirm('Are you sure you want to delete this category?')) {
                                                                        destroy(route('admin.blog.categories.destroy', category.id));
                                                                    }
                                                                }}
                                                                className="text-red-600 hover:text-red-700"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {expandedCategories.includes(category.id) && (
                                                        <div className="mt-2 pl-12">
                                                            <p className="text-sm text-gray-500">
                                                                {category.description || 'No description'}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </DragDropContext>
                </div>
            </div>
        </AdminLayout>
    );
}
