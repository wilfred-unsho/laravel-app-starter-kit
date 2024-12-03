import React from 'react';
import { Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

export default function Breadcrumbs({ items = [] }) {
    if (items.length === 0) return null;

    return (
        <nav className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
            <ol className="flex items-center space-x-2 text-sm">
                <li>
                    <Link
                        href="/admin"
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                        Dashboard
                    </Link>
                </li>
                {items.map((item, index) => (
                    <li key={index} className="flex items-center space-x-2">
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        {index === items.length - 1 ? (
                            <span className="text-gray-700 dark:text-gray-300">
                                {item.label}
                            </span>
                        ) : (
                            <Link
                                href={item.url}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                            >
                                {item.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
