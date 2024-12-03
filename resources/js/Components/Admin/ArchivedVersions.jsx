import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Archive, X, RefreshCw } from 'lucide-react';
import { LoadingButton } from '@/Components/LoadingButton';

export function ArchivedVersions({
                                     isOpen,
                                     onClose,
                                     versions,
                                     onUnarchive,
                                     isLoading
                                 }) {
    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center">
                                        <Archive className="h-6 w-6 text-gray-400 mr-3" />
                                        <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                                            Archived Versions
                                        </Dialog.Title>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    {versions.length > 0 ? (
                                        <div className="space-y-4">
                                            {versions.map((version) => (
                                                <div
                                                    key={version.id}
                                                    className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4"
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                                                                Version {version.version}
                                                            </h3>
                                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                                Archived on: {new Date(version.archived_at).toLocaleDateString()}
                                                            </p>
                                                            {version.archive_reason && (
                                                                <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                                                    Reason: {version.archive_reason}
                                                                </p>
                                                            )}
                                                        </div>
                                                        <LoadingButton
                                                            onClick={() => onUnarchive(version.id)}
                                                            loading={isLoading}
                                                            className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-blue-700 bg-blue-100 hover:bg-blue-200 dark:text-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800"
                                                        >
                                                            <RefreshCw className="w-3 h-3 mr-1" />
                                                            Restore
                                                        </LoadingButton>
                                                    </div>
                                                    {version.changelog && (
                                                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                                            {version.changelog}
                                                        </p>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <Archive className="mx-auto h-12 w-12 text-gray-400" />
                                            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                                                No Archived Versions
                                            </h3>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                There are no archived versions to display.
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
