import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { History, X } from 'lucide-react';
import { useForm } from '@inertiajs/react';
import { LoadingButton } from '@/Components/LoadingState';

export function ChangelogForm({
                                  isOpen,
                                  onClose,
                                  template,
                                  onSubmit
                              }) {
    const { data, setData, reset, errors } = useForm({
        changelog: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(data, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
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
                            <Dialog.Panel className="w-full max-w-md transform rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center">
                                        <History className="h-6 w-6 text-gray-400 mr-3" />
                                        <div>
                                            <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                                                Create New Version
                                            </Dialog.Title>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Describe the changes in this version
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

                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label
                                            htmlFor="changelog"
                                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Changelog Message
                                        </label>
                                        <textarea
                                            id="changelog"
                                            value={data.changelog}
                                            onChange={e => setData('changelog', e.target.value)}
                                            rows={4}
                                            placeholder="Describe what has changed in this version..."
                                            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        />
                                        {errors.changelog && (
                                            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                                {errors.changelog}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-6 flex justify-end space-x-3">
                                        <button
                                            type="button"
                                            onClick={onClose}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300"
                                        >
                                            Cancel
                                        </button>
                                        <LoadingButton
                                            type="submit"
                                            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                                        >
                                            <History className="w-4 h-4 mr-2" />
                                            Create Version
                                        </LoadingButton>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
