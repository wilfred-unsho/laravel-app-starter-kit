import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { History, AlertTriangle, X } from 'lucide-react';
import { LoadingButton } from '@/Components/LoadingButton';

export function RollbackConfirmation({
                                         isOpen,
                                         onClose,
                                         onConfirm,
                                         version,
                                         isLoading,
                                         currentVersion
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
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center text-yellow-600 dark:text-yellow-500">
                                        <AlertTriangle className="h-6 w-6 mr-3" />
                                        <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                                            Confirm Rollback
                                        </Dialog.Title>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="mt-4">
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Are you sure you want to roll back from version {currentVersion} to version {version.version}?
                                        This action cannot be undone and may affect templates using this version.
                                    </p>

                                    <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4">
                                        <div className="flex">
                                            <div className="ml-3">
                                                <h3 className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                                                    Warning
                                                </h3>
                                                <div className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
                                                    <ul className="list-disc pl-5 space-y-1">
                                                        <li>All changes made after version {version.version} will be lost</li>
                                                        <li>Existing roles using this template may be affected</li>
                                                        <li>You'll need to manually update any dependent templates</li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                        onClick={onClose}
                                    >
                                        Cancel
                                    </button>
                                    <LoadingButton
                                        onClick={onConfirm}
                                        loading={isLoading}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
                                    >
                                        <History className="w-4 h-4 mr-2" />
                                        Confirm Rollback
                                    </LoadingButton>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
