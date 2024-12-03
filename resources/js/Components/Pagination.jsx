import {Link} from '@inertiajs/react';
import {ChevronLeft, ChevronRight} from 'lucide-react';

export default function Pagination({links}) {
    // If there's only 1 page, don't show pagination
    if (links.length <= 3) {
        return null;
    }

    return (
        <div
            className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                {/* Mobile pagination */}
                {links.find(link => link.label === '&laquo; Previous') && (
                    <Link
                        href={links.find(link => link.label === '&laquo; Previous').url}
                        className="relative inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        <ChevronLeft className="w-5 h-5"/>
                        <span className="ml-2">Previous</span>
                    </Link>
                )}
                {links.find(link => link.label === 'Next &raquo;') && (
                    <Link
                        href={links.find(link => link.label === 'Next &raquo;').url}
                        className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-gray-700 bg-white dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        <span className="mr-2">Next</span>
                        <ChevronRight className="w-5 h-5"/>
                    </Link>
                )}
            </div>

            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                        Showing page{' '}
                        <span className="font-medium">
                            {links.findIndex(link => link.active) === -1
                                ? 1
                                : links.findIndex(link => link.active)}
                        </span>
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        {/* Desktop pagination */}
                        {links.map((link, index) => {
                            // Skip if it's a Previous/Next link and there's no URL
                            if ((!link.url && (link.label === '&laquo; Previous' || link.label === 'Next &raquo;'))) {
                                return null;
                            }

                            return (
                                <Link
                                    key={index}
                                    href={link.url ?? '#'}
                                    className={`relative inline-flex items-center px-4 py-2 text-sm font-medium ${
                                        link.url
                                            ? 'hover:bg-gray-50 dark:hover:bg-gray-700'
                                            : 'cursor-not-allowed'
                                    } ${
                                        index === 0
                                            ? 'rounded-l-md'
                                            : ''
                                    } ${
                                        index === links.length - 1
                                            ? 'rounded-r-md'
                                            : ''
                                    } ${
                                        link.active
                                            ? 'z-10 bg-blue-50 dark:bg-blue-900 border-blue-500 text-blue-600 dark:text-blue-300'
                                            : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400'
                                    } border`}
                                    dangerouslySetInnerHTML={{
                                        __html: link.label
                                    }}
                                />
                            );
                        })}
                    </nav>
                </div>
            </div>
        </div>
    );
}
