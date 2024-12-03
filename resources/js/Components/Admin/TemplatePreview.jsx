import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, Shield } from 'lucide-react';

export default function TemplatePreview({ template, isOpen, onClose }) {
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
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center space-x-3">
                                        <Shield className="h-6 w-6 text-gray-400" />
                                        <div>
                                            <Dialog.Title
                                                as="h3"
                                                className="text-lg font-medium text-gray-900 dark:text-white"
                                            >
                                                {template.name}
                                            </Dialog.Title>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Template Preview
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                                        onClick={onClose}
                                    >
                                        <X className="h-6 w-6" />
                                    </button>
                                </div>

                                <div className="mt-6">
                                    <div className="space-y-6">
                                        {/* Description */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white">
                                                Description
                                            </h4>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                {template.description || 'No description provided'}
                                            </p>
                                        </div>

                                        {/* Permissions */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-3">
                                                Included Permissions
                                            </h4>
                                            <div className="space-y-4">
                                                {Object.entries(template.permissions).map(([group, permissions]) => (
                                                    <div key={group} className="space-y-2">
                                                        <h5 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                                                            {group.split('-').map(word =>
                                                                word.charAt(0).toUpperCase() + word.slice(1)
                                                            ).join(' ')}
                                                        </h5>
                                                        <div className="grid grid-cols-2 gap-2">
                                                            {permissions.map(permission => (
                                                                <div
                                                                    key={permission.id}
                                                                    className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-2 rounded"
                                                                >
                                                                    {permission.name}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-6 flex justify-end space-x-3">
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        onClick={() => {
                                            router.post(route('admin.roles.templates.create-role', template.id));
                                            onClose();
                                        }}
                                    >
                                        Use Template
                                    </button>
                                    <button
                                        type="button"
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        onClick={onClose}
                                    >
                                        Close
                                    </button>
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
