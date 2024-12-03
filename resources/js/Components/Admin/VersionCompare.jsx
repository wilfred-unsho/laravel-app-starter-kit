import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import {
    History,
    X,
    Plus,
    Minus,
    ArrowRight,
    Check
} from 'lucide-react';

export function VersionCompare({ isOpen, onClose, comparison, oldVersion, newVersion }) {
    const renderDiff = (field, oldValue, newValue) => {
        if (oldValue === newValue) {
            return (
                <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Check className="h-4 w-4 mr-2 text-green-500" />
                    {newValue}
                </div>
            );
        }

        return (
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                    <div className="flex items-center text-red-600 dark:text-red-400">
                        <Minus className="h-4 w-4 mr-2" />
                        <span>Removed</span>
                    </div>
                    <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded">
                        {oldValue}
                    </div>
                </div>
                <div className="space-y-1">
                    <div className="flex items-center text-green-600 dark:text-green-400">
                        <Plus className="h-4 w-4 mr-2" />
                        <span>Added</span>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded">
                        {newValue}
                    </div>
                </div>
            </div>
        );
    };

    const renderArrayDiff = (title, added, removed) => {
        if (!added.length && !removed.length) return null;

        return (
            <div className="space-y-2">
                <h4 className="font-medium text-gray-900 dark:text-white">{title}</h4>
                <div className="grid grid-cols-2 gap-4">
                    {removed.length > 0 && (
                        <div className="space-y-1">
                            <div className="flex items-center text-red-600 dark:text-red-400">
                                <Minus className="h-4 w-4 mr-2" />
                                <span>Removed</span>
                            </div>
                            <div className="bg-red-50 dark:bg-red-900/20 p-2 rounded space-y-1">
                                {removed.map((item, index) => (
                                    <div key={index} className="text-sm">{item}</div>
                                ))}
                            </div>
                        </div>
                    )}
                    {added.length > 0 && (
                        <div className="space-y-1">
                            <div className="flex items-center text-green-600 dark:text-green-400">
                                <Plus className="h-4 w-4 mr-2" />
                                <span>Added</span>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 p-2 rounded space-y-1">
                                {added.map((item, index) => (
                                    <div key={index} className="text-sm">{item}</div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
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
                            <Dialog.Panel className="w-full max-w-3xl transform overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center">
                                        <History className="h-6 w-6 text-gray-400 mr-3" />
                                        <div>
                                            <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-white">
                                                Compare Versions
                                            </Dialog.Title>
                                            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                                Comparing Version {oldVersion} with Version {newVersion}
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

                                <div className="space-y-6">
                                    {/* Basic Information */}
                                    <div className="space-y-4">
                                        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                                            Basic Information
                                        </h3>
                                        {Object.entries(comparison).map(([field, values]) => {
                                            if (field === 'permissions' || field === 'tags') return null;
                                            return (
                                                <div key={field} className="space-y-2">
                                                    <h4 className="font-medium text-gray-900 dark:text-white capitalize">
                                                        {field.replace('_', ' ')}
                                                    </h4>
                                                    {renderDiff(field, values.old, values.new)}
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {/* Permissions Changes */}
                                    {renderArrayDiff(
                                        'Permissions',
                                        comparison.permissions?.added || [],
                                        comparison.permissions?.removed || []
                                    )}

                                    {/* Tags Changes */}
                                    {renderArrayDiff(
                                        'Tags',
                                        comparison.tags?.added || [],
                                        comparison.tags?.removed || []
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
