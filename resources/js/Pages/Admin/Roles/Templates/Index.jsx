import { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import AdminLayout from '@/Layouts/AdminLayout';
import {
    Plus,
    Search,
    Settings,
    Download,
    Upload,
    CopyIcon,
    Tag
} from 'lucide-react';
import { LoadingButton } from '@/Components/LoadingState';
import { Notification } from '@/Components/Notification';

const TemplateCard = ({ template }) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleUseTemplate = () => {
        setIsLoading(true);
        router.post(route('admin.roles.templates.create-role', template.id), {}, {
            onFinish: () => setIsLoading(false),
        });
    };

    return (
        <div className="bg-gray-50 dark:bg-gray-900 rounded-lg shadow-sm p-6 relative">
            <div className="flex justify-between items-start mb-4">
                <div className="space-y-1">
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {template.name}
                    </h3>
                    {template.category && (
                        <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            {template.category}
                        </span>
                    )}
                </div>
                <Link
                    href={route('admin.roles.templates.edit', template.id)}
                    className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                    <Settings className="h-5 w-5" />
                </Link>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                {template.description || 'No description provided'}
            </p>

            {template.tags && template.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {template.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {template.permissions_count} permissions
                </span>
                <LoadingButton
                    onClick={handleUseTemplate}
                    loading={isLoading}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                >
                    <CopyIcon className="w-4 h-4 mr-2" />
                    Use Template
                </LoadingButton>
            </div>
        </div>
    );
};

export default function TemplatesIndex({ templates = [], categories = [], popularTags = [] }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedTags, setSelectedTags] = useState([]);
    const [isExporting, setIsExporting] = useState(false);
    const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

    const handleExport = async () => {
        try {
            setIsExporting(true);
            const response = await fetch(route('admin.roles.templates.export'), {
                method: 'GET',
            });

            if (!response.ok) throw new Error('Export failed');

            // Get the filename from the content-disposition header
            const contentDisposition = response.headers.get('content-disposition');
            let filename = 'role-templates.xlsx';
            if (contentDisposition) {
                const match = contentDisposition.match(/filename="(.+)"/);
                if (match) filename = match[1];
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);

            setNotification({
                show: true,
                message: 'Templates exported successfully',
                type: 'success'
            });
        } catch (error) {
            console.error('Export error:', error);
            setNotification({
                show: true,
                message: 'Failed to export templates',
                type: 'error'
            });
        } finally {
            setIsExporting(false);
        }
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

            <Notification
                show={notification.show}
                message={notification.message}
                type={notification.type}
                onClose={() => setNotification(prev => ({ ...prev, show: false }))}
            />

            <div className="space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                            Role Templates
                        </h2>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                            Pre-configured role templates for quick setup
                        </p>
                    </div>
                    <div className="flex space-x-3">
                        <LoadingButton
                            onClick={handleExport}
                            loading={isExporting}
                            className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            {isExporting ? 'Exporting...' : 'Export'}
                        </LoadingButton>
                        <label className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-md cursor-pointer">
                            <Upload className="w-4 h-4 mr-2" />
                            Import
                            <input
                                type="file"
                                className="hidden"
                                onChange={(e) => {
                                    if (e.target.files?.length) {
                                        const formData = new FormData();
                                        formData.append('file', e.target.files[0]);
                                        router.post(route('admin.roles.templates.import'), formData);
                                    }
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
                                    onClick={() => {
                                        setSelectedTags(prev =>
                                            prev.includes(tag)
                                                ? prev.filter(t => t !== tag)
                                                : [...prev, tag]
                                        );
                                    }}
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

                {/* Templates Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTemplates.map((template) => (
                        <TemplateCard key={template.id} template={template} />
                    ))}
                </div>

                {/* Empty State */}
                {filteredTemplates.length === 0 && (
                    <div className="text-center py-12">
                        <div className="w-24 h-24 mx-auto mb-4 flex items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900">
                            <CopyIcon className="h-12 w-12 text-gray-400" />
                        </div>
                        <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No templates found</h3>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {searchTerm || selectedCategory !== 'all' || selectedTags.length > 0
                                ? 'Try adjusting your filters or search term'
                                : 'Get started by creating a new template'}
                        </p>
                        <div className="mt-6">
                            <Link
                                href={route('admin.roles.templates.create')}
                                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                New Template
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
