import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Shield, Save, X, Loader } from 'lucide-react';
import { ErrorBoundary } from '@/Components/ErrorBoundary';

const PermissionGroup = ({ group, permissions, selectedIds, onChange }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="border dark:border-gray-700 rounded-lg overflow-hidden">
            <button
                type="button"
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-900 flex items-center justify-between"
            >
                <span className="font-medium text-gray-900 dark:text-white">
                    {group.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {permissions.filter(p => selectedIds.includes(p.id)).length} of {permissions.length} selected
                </span>
            </button>
            {isExpanded && (
                <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {permissions.map(permission => (
                        <label key={permission.id} className="relative flex items-start">
                            <div className="flex h-5 items-center">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(permission.id)}
                                    onChange={() => onChange(permission.id)}
                                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                            </div>
                            <div className="ml-3 text-sm">
                                <span className="font-medium text-gray-700 dark:text-gray-300">
                                    {permission.name}
                                </span>
                                {permission.description && (
                                    <p className="text-gray-500 dark:text-gray-400">
                                        {permission.description}
                                    </p>
                                )}
                            </div>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

const EditForm = ({ template, permissions, categories, availableTags }) => {
    const { data, setData, put, processing, errors } = useForm({
        name: template.name,
        description: template.description || '',
        category: template.category || '',
        tags: template.tags || [],
        permissions: template.permissions || [],
        is_active: template.is_active,
    });

    const togglePermission = (permissionId) => {
        const currentPermissions = [...data.permissions];
        const index = currentPermissions.indexOf(permissionId);

        if (index === -1) {
            currentPermissions.push(permissionId);
        } else {
            currentPermissions.splice(index, 1);
        }

        setData('permissions', currentPermissions);
    };

    const handleTagInput = (e) => {
        if (e.key === 'Enter' && e.target.value) {
            e.preventDefault();
            const newTag = e.target.value.trim();
            if (newTag && !data.tags.includes(newTag)) {
                setData('tags', [...data.tags, newTag]);
            }
            e.target.value = '';
        }
    };

    const removeTag = (tagToRemove) => {
        setData('tags', data.tags.filter(tag => tag !== tagToRemove));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        put(route('admin.roles.templates.update', template.id));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Basic Information
                </h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Template Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={data.name}
                            onChange={e => setData('name', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.name && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>
                        )}
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={data.description}
                            onChange={e => setData('description', e.target.value)}
                            rows={3}
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                        {errors.description && (
                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.description}</p>
                        )}
                    </div>

                    <div className="flex space-x-4">
                        <div className="flex-1">
                            <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Category
                            </label>
                            <select
                                id="category"
                                value={data.category}
                                onChange={e => setData('category', e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="">Select a category</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex items-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={data.is_active}
                                    onChange={e => setData('is_active', e.target.checked)}
                                    className="sr-only peer"
                                />
                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                                <span className="ml-3 text-sm font-medium text-gray-700 dark:text-gray-300">Active</span>
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tags */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Tags
                </h3>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="tags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Add Tags
                        </label>
                        <input
                            type="text"
                            id="tags"
                            onKeyDown={handleTagInput}
                            placeholder="Press Enter to add tags"
                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {data.tags.map(tag => (
                            <span
                                key={tag}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="ml-1 inline-flex items-center p-0.5 text-blue-400 hover:text-blue-600"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </span>
                        ))}
                    </div>

                    {availableTags.length > 0 && (
                        <div>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                Suggested tags:
                            </span>
                            <div className="mt-2 flex flex-wrap gap-2">
                                {availableTags.map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        onClick={() => !data.tags.includes(tag) && setData('tags', [...data.tags, tag])}
                                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Permissions */}
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                    Permissions
                </h3>
                <div className="space-y-4">
                    {Object.entries(permissions).map(([group, groupPermissions]) => (
                        <PermissionGroup
                            key={group}
                            group={group}
                            permissions={groupPermissions}
                            selectedIds={data.permissions}
                            onChange={togglePermission}
                        />
                    ))}
                </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-3">
                <Link
                    href={route('admin.roles.templates.index')}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                    Cancel
                </Link>
                <button
                    type="submit"
                    disabled={processing}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                    {processing ? (
                        <>
                            <Loader className="w-4 h-4 mr-2 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

export default function Edit({ template, permissions, categories, availableTags }) {
    return (
        <AdminLayout>
            <Head title={`Edit Template - ${template.name}`} />

            <ErrorBoundary>
                <div className="space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Shield className="h-6 w-6 text-gray-400 mr-3" />
                            <div>
                                <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                    Edit Template
                                </h2>
                                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                    Modify template settings and permissions
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Edit Form */}
                    <EditForm
                        template={template}
                        permissions={permissions}
                        categories={categories}
                        availableTags={availableTags}
                    />
                </div>
            </ErrorBoundary>
        </AdminLayout>
    );
}
