import { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Package, X, Trash2, Archive, AlertTriangle } from 'lucide-react';
import { LoadingButton } from '@/Components/LoadingButton';

export function BatchVersionOperations({
                                           isOpen,
                                           onClose,
                                           versions,
                                           onDelete,
                                           onArchive,
                                           selectedVersions,
                                           setSelectedVersions,
                                           isLoading
                                       }) {
    const [operation, setOperation] = useState(null);
    const [showConfirmation, setShowConfirmation] = useState(false);

    const handleOperation = (type) => {
        setOperation(type);
        setShowConfirmation(true);
    };

    const handleConfirm = () => {
        if (operation === 'delete') {
            onDelete(selectedVersions);
        } else if (operation === 'archive') {
            onArchive(selectedVersions);
        }
        setShowConfirmation(false);
    };

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
                                {!showConfirmation ? (
                                    <>
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center">
                                                <Package className="h-6 w-6 text-gray-400 mr-3" />
                                                <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                                                    Batch Version Operations
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
                                            {/* Version Selection */}
                                            <div className="max-h-64 overflow-y-auto">
                                                <div className="space-y-2">
                                                    {versions.map((version) => (
                                                        <label
                                                            key={version.id}
                                                            className="flex items-center p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={selectedVersions.includes(version.id)}
                                                                onChange={() => {
                                                                    setSelectedVersions(prev =>
                                                                        prev.includes(version.id)
                                                                            ? prev.filter(id => id !== version.id)
                                                                            : [...prev, version.id]
                                                                    );
                                                                }}
                                                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                                            />
                                                            <div className="ml-3">
                                                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                                                    Version {version.version}
                                                                </div>
                                                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                    {new Date(version.created_at).toLocaleDateString()}
                                                                </div>
                                                            </div>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Operation Buttons */}
                                            <div className="flex justify-end space-x-3">
                                                <button
                                                    type="button"
                                                    onClick={() => handleOperation('archive')}
                                                    disabled={selectedVersions.length === 0}
                                                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                                >
                                                    <Archive className="w-4 h-4 mr-2" />
                                                    Archive Selected
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => handleOperation('delete')}
                                                    disabled={selectedVersions.length === 0}
                                                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                                                >
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete Selected
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    // Confirmation Dialog
                                    <div>
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center text-yellow-600 dark:text-yellow-500">
                                                <AlertTriangle className="h-6 w-6 mr-3" />
                                                <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                                                    Confirm {operation === 'delete' ? 'Deletion' : 'Archive'}
                                                </Dialog.Title>
                                            </div>
                                            <button
                                                onClick={() => setShowConfirmation(false)}
                                                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                            >
                                                <X className="h-6 w-6" />
                                            </button>
                                        </div>

                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                            Are you sure you want to {operation === 'delete' ? 'delete' : 'archive'} the selected versions?
                                            {operation === 'delete' && ' This action cannot be undone.'}
                                        </p>

                                        <div className="mt-6 flex justify-end space-x-3">
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirmation(false)}
                                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                            >
                                                Cancel
                                            </button>
                                            <LoadingButton
                                                onClick={handleConfirm}
                                                loading={isLoading}
                                                className={`inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                                                    operation === 'delete'
                                                        ? 'bg-red-600 hover:bg-red-700'
                                                        : 'bg-blue-600 hover:bg-blue-700'
                                                }`}
                                            >
                                                {operation === 'delete' ? (
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                ) : (
                                                    <Archive className="w-4 h-4 mr-2" />
                                                )}
                                                Confirm {operation === 'delete' ? 'Delete' : 'Archive'}
                                            </LoadingButton>
                                        </div>
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
