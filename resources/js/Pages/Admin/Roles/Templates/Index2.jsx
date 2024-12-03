import { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Plus,
    Search,
    Edit,
    Trash2,
    CopyIcon,
    Download,
    Upload,
    Tag,
    Eye
} from 'lucide-react';

const CategoryBadge = ({ category }) => (
    <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
        {category || 'Uncategorized'}
    </span>
);

const TagList = ({ tags }) => (
    <div className="flex flex-wrap gap-1">
        {tags?.map(tag => (
            <span
                key={tag}
                className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
            >
                {tag}
            </span>
        ))}
    </div>
);

export default function TemplatesIndex({ templates, categories, popularTags }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedTags, setSelectedTags] = useState([]);

    const handleTagToggle = (tag) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const filteredTemplates = templates.filter(template => {
        const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            template.description?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;

        const matchesTags = selectedTags.length === 0 ||
            selectedTags.every(tag => template.tags?.includes(tag));

        return matchesSearch && matchesCategory && matchesTags;
    });

    return (
        <AdminLayout>
            <Head title="Role Templates" />

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                                Role Templates
                            </h2>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                Pre-configured role templates for quick setup
                            </p>
                        </div>
                        <div className="flex space-x-4">
                            <Link
                                href={route('admin.roles.templates.export')}
                                className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                            >
                                <Download className="w-4 h-4 mr-2" />
                                Export
                            </Link>
                            <label
                                htmlFor="import-file"
                                className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md cursor-pointer"
                            >
                                <Upload className="w-4 h-4 mr-2" />
                                Import
                                <input
                                    id="import-file"
                                    type="file"
                                    className="hidden"
                                    onChange={(e) => {
                                        const formData = new FormData();
                                        formData.append('file', e.target.files[0]);
                                        router.post(route('admin.roles.templates.import'), formData);
                                    }}
                                />
                            </label>
                            <Link
                                href={route('admin.roles.templates.create')}
                                className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Template
                            </Link>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="mb-6 space-y-4">
                        <div className="flex items-center space-x-4">
                            <div className="flex-1">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="Search templates..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full px-4 py-2 pl-10 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                </div>
                            </div>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="px-4 py-2 text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Categories</option>
                                {categories.map(category => (
                                    <option key={category} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Popular Tags */}
                        {popularTags.length > 0 && (
                            <div className="flex items-center space-x-2">
                                <Tag className="h-4 w-4 text-gray-400" />
                                <div className="flex flex-wrap gap-2">
                                    {popularTags.map(tag => (
                                        <button
                                            key={tag}
                                            onClick={() => handleTagToggle(tag)}
                                            className={`px-2 py-1 text-xs rounded-full ${
                                                selectedTags.includes(tag)
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                            }`}
                                        >
                                            {tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Templates Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTemplates.map((template) => (
                            <div
                                key={template.id}
                                className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow duration-200"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                            {template.name}
                                        </h3>
                                        <CategoryBadge category={template.category} />
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => router.get(route('admin.roles.templates.preview', template.id))}
                                            className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                            title="Preview Template"
                                        >
                                            <Eye className="h-5 w-5" />
                                        </button>
                                        <Link
                                            href={route('admin.roles.templates.edit', template.id)}
                                            className="p-1 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                            title="Edit Template"
                                        >
                                            <Edit className="h-5 w-5" />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(template.id)}
                                            className="p-1 text-gray-400 hover:text-red-500"
                                            title="Delete Template"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                    {template.description || 'No description'}
                                </p>

                                <div className="space-y-3">
                                    {template.tags && <TagList tags={template.tags} />}

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500 dark:text-gray-400">
                                            {template.permissions_count} permissions
                                        </span>
                                        <button
                                            onClick={() => router.post(route('admin.roles.templates.create-role', template.id))}
                                            className="inline-flex items-center px-3 py-1 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                                        >
                                            <CopyIcon className="w-4 h-4 mr-1" />
                                            Use Template
                                        </button>
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
