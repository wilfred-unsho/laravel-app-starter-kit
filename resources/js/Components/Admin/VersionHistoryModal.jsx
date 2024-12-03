import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { History, X } from 'lucide-react';
import { VersionHistory } from './VersionHistory';
import { LoadingButton } from '@/Components/LoadingState';

export function VersionHistoryModal({
                                        isOpen,
                                        onClose,
                                        template,
                                        versions,
                                        currentVersion,
                                        onVersionSelect,
                                        onVersionRevert,
                                        isReverting = false
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
                            <Dialog.Panel className="w-full max-w-2xl transform rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center">
                                        <History className="h-6 w-6 text-gray-400 mr-3" />
                                        <div>
                                            <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                                                Version History
                                            </Dialog.Title>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                {template.name}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="mt-4">
                                    <VersionHistory
                                        versions={versions}
                                        currentVersion={currentVersion}
                                        onVersionSelect={onVersionSelect}
                                    />
                                </div>

                                {currentVersion !== versions[0].version && (
                                    <div className="mt-6 flex justify-end">
                                        <LoadingButton
                                            onClick={() => onVersionRevert(versions[0])}
                                            loading={isReverting}
                                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            <History className="h-4 w-4 mr-2" />
                                            Revert to Latest Version
                                        </LoadingButton>
                                    </div>
                                )}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
