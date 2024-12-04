import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

export default function Pagination({ links }) {
    if (links.length <= 3) return null;

    const showPage = (link, index) => {
        if (index === 0) return false; // "Previous" link
        if (index === links.length - 1) return false; // "Next" link
        return true;
    };

    return (
        <div className="flex justify-between items-center">
            <div className="flex gap-1">
                {/* Previous */}
                <Link
                    href={links[0].url}
                    className={`px-3 py-1 rounded-md ${
                        links[0].url
                            ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            : 'text-gray-300 cursor-not-allowed'
                    }`}
                >
                    <ChevronLeft className="w-5 h-5" />
                </Link>

                {/* Page Numbers */}
                {links.map((link, i) =>
                        showPage(link, i) && (
                            <Link
                                key={i}
                                href={link.url}
                                className={`px-3 py-1 rounded-md ${
                                    link.active
                                        ? 'bg-blue-600 text-white'
                                        : link.url
                                            ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                                            : 'text-gray-300 cursor-not-allowed'
                                }`}
                            >
                                {link.label.replace(/&laquo;|&raquo;/g, '')}
                            </Link>
                        )
                )}

                {/* Next */}
                <Link
                    href={links[links.length - 1].url}
                    className={`px-3 py-1 rounded-md ${
                        links[links.length - 1].url
                            ? 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                            : 'text-gray-300 cursor-not-allowed'
                    }`}
                >
                    <ChevronRight className="w-5 h-5" />
                </Link>
            </div>
        </div>
    );
}
