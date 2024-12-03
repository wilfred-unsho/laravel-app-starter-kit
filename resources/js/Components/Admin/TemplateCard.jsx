import { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Settings, CopyIcon, History, Copy } from 'lucide-react';
import { LoadingButton } from '@/Components/LoadingState';
import { VersionHistoryModal } from './VersionHistoryModal';
import { ChangelogForm } from './ChangelogForm';
import { DuplicateTemplateModal } from './DuplicateTemplateModal';

export function TemplateCard({ template }) {
    const [isLoading, setIsLoading] = useState(false);
    const [showVersionHistory, setShowVersionHistory] = useState(false);
    const [showChangelogForm, setShowChangelogForm] = useState(false);
    const [showDuplicateModal, setShowDuplicateModal] = useState(false);
    const [versions, setVersions] = useState([]);
    const [isLoadingVersions, setIsLoadingVersions] = useState(false);

    const handleUseTemplate = () => {
        setIsLoading(true);
        router.post(route('admin.roles.templates.create-role', template.id), {}, {
            onFinish: () => setIsLoading(false),
        });
    };

    const loadVersionHistory = async () => {
        setIsLoadingVersions(true);
        try {
            const response = await fetch(route('admin.roles.templates.versions', template.id));
            const data = await response.json();
            setVersions(data.versions);
            setShowVersionHistory(true);
        } catch (error) {
            console.error('Failed to load version history:', error);
        } finally {
            setIsLoadingVersions(false);
        }
    };

    const handleCreateVersion = (data, options) => {
        router.post(route('admin.roles.templates.create-version', template.id), data, options);
    };

    return (
        <>
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
                    <div className="flex space-x-2">
                        <button
                            onClick={loadVersionHistory}
                            className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                            title="Version History"
                        >
                            <History className="h-5 w-5" />
                        </button>
                        <button
                            onClick={() => setShowDuplicateModal(true)}
                            className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                            title="Duplicate Template"
                        >
                            <Copy className="h-5 w-5" />
                        </button>
                        <Link
                            href={route('admin.roles.templates.edit', template.id)}
                            className="p-2 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                            title="Edit Template"
                        >
                            <Settings className="h-5 w-5" />
                        </Link>
                    </div>
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
                    <div className="flex items-center space-x-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {template.permissions_count} permissions
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            Version {template.version}
                        </span>
                    </div>
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

            {/* Version History Modal */}
            <VersionHistoryModal
                isOpen={showVersionHistory}
                onClose={() => setShowVersionHistory(false)}
                template={template}
                versions={versions}
                currentVersion={template.version}
                onVersionSelect={(version) => {
                    router.post(route('admin.roles.templates.revert', template.id), {
                        version: version.version
                    });
                }}
                onCreateVersion={() => setShowChangelogForm(true)}
                isLoading={isLoadingVersions}
            />

            {/* Changelog Form Modal */}
            <ChangelogForm
                isOpen={showChangelogForm}
                onClose={() => setShowChangelogForm(false)}
                template={template}
                onSubmit={handleCreateVersion}
            />

            {/* Duplicate Template Modal */}
            <DuplicateTemplateModal
                isOpen={showDuplicateModal}
                onClose={() => setShowDuplicateModal(false)}
                template={template}
            />
        </>
    );
}
