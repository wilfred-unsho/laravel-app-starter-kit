import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    History,
    Plus,
    Minus,
    Check,
    Shield,
    AlertTriangle
} from 'lucide-react';

const DiffBlock = ({ label, oldValue, newValue, type = 'text' }) => {
    if (oldValue === newValue) return null;

    return (
        <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </h4>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                    <div className="flex items-center text-red-700 dark:text-red-300 text-sm mb-1">
                        <Minus className="w-4 h-4 mr-1" />
                        Previous
                    </div>
                    <div className="text-gray-900 dark:text-gray-100">
                        {oldValue || 'None'}
                    </div>
                </div>
                <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                    <div className="flex items-center text-green-700 dark:text-green-300 text-sm mb-1">
                        <Plus className="w-4 h-4 mr-1" />
                        Current
                    </div>
                    <div className="text-gray-900 dark:text-gray-100">
                        {newValue || 'None'}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ArrayDiffBlock = ({ label, added, removed }) => {
    if (!added.length && !removed.length) return null;

    return (
        <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </h4>
            <div className="grid grid-cols-2 gap-4">
                {removed.length > 0 && (
                    <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded">
                        <div className="flex items-center text-red-700 dark:text-red-300 text-sm mb-1">
                            <Minus className="w-4 h-4 mr-1" />
                            Removed
                        </div>
                        <ul className="list-disc list-inside space-y-1">
                            {removed.map((item, index) => (
                                <li key={index} className="text-gray-900 dark:text-gray-100">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {added.length > 0 && (
                    <div className="bg-green-50 dark:bg-green-900/20 p-3 rounded">
                        <div className="flex items-center text-green-700 dark:text-green-300 text-sm mb-1">
                            <Plus className="w-4 h-4 mr-1" />
                            Added
                        </div>
                        <ul className="list-disc list-inside space-y-1">
                            {added.map((item, index) => (
                                <li key={index} className="text-gray-900 dark:text-gray-100">
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default function CompareVersions({ template, comparison, versions }) {
    return (
        <AdminLayout>
            <Head title="Compare Template Versions" />

            <div className="space-y-6">
                <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                    <div className="flex items-center mb-6">
                        <History className="h-6 w-6 text-gray-400 mr-3" />
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                Version Comparison
                            </h2>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Comparing changes between template versions
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Previous Version
                            </label>
                            <select
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:bg-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                value={versions.old}
                            >
                                {template.versions.map(version => (
                                    <option key={version} value={version}>
                                        Version {version}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Current Version
                            </label>
                            <select
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 dark:bg-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                value={versions.new}
                            >
                                {template.versions.map(version => (
                                    <option key={version} value={version}>
                                        Version {version}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-6">
                        {/* Basic Information Changes */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Basic Information
                            </h3>
                            <DiffBlock
                                label="Name"
                                oldValue={comparison.name.old}
                                newValue={comparison.name.new}
                            />
                            <DiffBlock
                                label="Description"
                                oldValue={comparison.description.old}
                                newValue={comparison.description.new}
                            />
                            <DiffBlock
                                label="Category"
                                oldValue={comparison.category.old}
                                newValue={comparison.category.new}
                            />
                        </div>

                        {/* Tags Changes */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Tags
                            </h3>
                            <ArrayDiffBlock
                                label="Tag Changes"
                                added={comparison.tags.added}
                                removed={comparison.tags.removed}
                            />
                        </div>

                        {/* Permissions Changes */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                Permissions
                            </h3>
                            <ArrayDiffBlock
                                label="Permission Changes"
                                added={comparison.permissions.added}
                                removed={comparison.permissions.removed}
                            />
                        </div>

                        {/* No Changes Message */}
                        {Object.keys(comparison).every(key =>
                            !comparison[key].changed &&
                            (!comparison[key].added?.length || !comparison[key].removed?.length)
                        ) && (
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                                <div className="flex">
                                    <Check className="h-5 w-5 text-green-400" />
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                            No Changes
                                        </h3>
                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                                            These versions are identical
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Version Navigation */}
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between">
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={() => {/* Handle previous version */}}
                            >
                                Previous Version
                            </button>
                            <button
                                type="button"
                                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={() => {/* Handle next version */}}
                            >
                                Next Version
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

const ComparisonList = ({ title, permissions, type = 'common' }) => {
    const getIcon = () => {
        switch (type) {
            case 'added':
                return <Plus className="w-4 h-4 text-green-500" />;
            case 'removed':
                return <Minus className="w-4 h-4 text-red-500" />;
            default:
                return <Check className="w-4 h-4 text-blue-500" />;
        }
    };

    const getTextColor = () => {
        switch (type) {
            case 'added':
                return 'text-green-700 dark:text-green-300';
            case 'removed':
                return 'text-red-700 dark:text-red-300';
            default:
                return 'text-blue-700 dark:text-blue-300';
        }
    };

    return permissions.length > 0 ? (
        <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">{title}</h4>
            <ul className="space-y-2">
                {permissions.map(permission => (
                    <li
                        key={permission.id}
                        className={`flex items-center space-x-2 text-sm ${getTextColor()}`}
                    >
                        {getIcon()}
                        <span>{permission.name}</span>
                    </li>
                ))}
            </ul>
        </div>
    ) : null;
};

export function CompareTemplate({ template, role, comparison }) {
    return (
        <AdminLayout>
            <Head title="Compare Template with Role" />

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                Template Comparison
                            </h2>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Comparing template "{template.name}" with role "{role.name}"
                            </p>
                        </div>
                        <Shield className="h-8 w-8 text-gray-400" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Template Info */}
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Template Details
                            </h3>
                            <dl className="space-y-2">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
                                    <dd className="text-sm text-gray-900 dark:text-white">{template.name}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</dt>
                                    <dd className="text-sm text-gray-900 dark:text-white">{template.category || 'Uncategorized'}</dd>
                                </div>
                                {template.tags && (
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Tags</dt>
                                        <dd className="text-sm">
                                            <div className="flex flex-wrap gap-2">
                                                {template.tags.map(tag => (
                                                    <span
                                                        key={tag}
                                                        className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                                    >
                                                        {tag}
                                                    </span>
                                                ))}
                                            </div>
                                        </dd>
                                    </div>
                                )}
                            </dl>
                        </div>

                        {/* Role Info */}
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                                Role Details
                            </h3>
                            <dl className="space-y-2">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</dt>
                                    <dd className="text-sm text-gray-900 dark:text-white">{role.name}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</dt>
                                    <dd className="text-sm text-gray-900 dark:text-white">
                                        {role.is_system ? 'System Role' : 'Custom Role'}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Permissions Comparison */}
                    <div className="mt-8">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                            Permission Changes
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                                <ComparisonList
                                    title="Permissions to Add"
                                    permissions={comparison.added}
                                    type="added"
                                />
                            </div>

                            <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                                <ComparisonList
                                    title="Permissions to Remove"
                                    permissions={comparison.removed}
                                    type="removed"
                                />
                            </div>

                            <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                                <ComparisonList
                                    title="Unchanged Permissions"
                                    permissions={comparison.common}
                                    type="common"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
