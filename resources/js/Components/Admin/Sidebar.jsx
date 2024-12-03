import { useState, useEffect } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    Settings,
    ChevronDown,
    ChevronRight,
    Shield,
    Lock,
    Image
} from 'lucide-react';

const ICON_MAP = {
    LayoutDashboard,
    Users,
    Settings,
    Shield,
    Lock,
    Image
};

export default function Sidebar({ open, onClose }) {
    const { menu_items } = usePage().props;
    const [expandedItems, setExpandedItems] = useState([]);

    // Debug: Log the menu items
    //console.log('Menu Items:', menu_items);

    const toggleSubmenu = (index) => {
        setExpandedItems(prev => {
            if (prev.includes(index)) {
                return prev.filter(item => item !== index);
            }
            return [...prev, index];
        });
    };

    const getIcon = (iconName) => {
        return ICON_MAP[iconName] || LayoutDashboard;
    };

    const MenuItem = ({ item, index, level = 0 }) => {
        const Icon = getIcon(item.icon);
        const hasSubmenu = item.submenu && item.submenu.length > 0;
        const isExpanded = expandedItems.includes(index);
        const paddingLeft = level * 1;

        // Debug: Log individual menu item
        //console.log('Rendering menu item:', item);

        if (hasSubmenu) {
            return (
                <div>
                    <button
                        onClick={() => toggleSubmenu(index)}
                        className={`w-full flex items-center px-4 py-3 text-gray-600 dark:text-gray-300
                            hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150
                            ${isExpanded ? 'bg-gray-50 dark:bg-gray-700' : ''}`}
                        style={{ paddingLeft: `${1 + paddingLeft}rem` }}
                    >
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        {open && (
                            <>
                                <span className="ml-4 text-sm">{item.title}</span>
                                {isExpanded ? (
                                    <ChevronDown className="ml-auto h-4 w-4" />
                                ) : (
                                    <ChevronRight className="ml-auto h-4 w-4" />
                                )}
                            </>
                        )}
                    </button>
                    {open && isExpanded && (
                        <ul className="bg-gray-50 dark:bg-gray-900">
                            {item.submenu.map((subItem, subIndex) => (
                                <MenuItem
                                    key={subItem.title}
                                    item={subItem}
                                    index={`${index}-${subIndex}`}
                                    level={level + 1}
                                />
                            ))}
                        </ul>
                    )}
                </div>
            );
        }

        return (
            <Link
                href={route(item.route)}
                className={`flex items-center px-4 py-3 text-gray-600 dark:text-gray-300
                    hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150
                    ${route().current(item.route) ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''}`}
                style={{ paddingLeft: `${1 + paddingLeft}rem` }}
            >
                {item.icon && <Icon className="h-5 w-5 flex-shrink-0" />}
                {open && <span className="ml-4 text-sm">{item.title}</span>}
            </Link>
        );
    };

    // Debug: Log when the component renders
    //console.log('Sidebar is rendering, open state:', open);

    return (
        <>
            <div
                className={`${open ? 'w-64' : 'w-20'} transition-all duration-300
                    bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
                    flex flex-col fixed h-full z-40 left-0 top-0`}
            >
                <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
                    <Link href="/admin" className="flex items-center">
                        {open ? (
                            <span className="text-xl font-bold text-gray-800 dark:text-white">
                                Admin Panel
                            </span>
                        ) : (
                            <span className="text-xl font-bold text-gray-800 dark:text-white">
                                AP
                            </span>
                        )}
                    </Link>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-1">
                        {/* Debug: Add conditional rendering to check if menu_items exists */}
                        {menu_items ? (
                            menu_items.map((item, index) => (
                                <li key={item.title}>
                                    <MenuItem item={item} index={index} />
                                </li>
                            ))
                        ) : (
                            <li className="px-4 py-2 text-gray-500">No menu items available</li>
                        )}
                    </ul>
                </nav>
            </div>

            {open && (
                <div
                    className="fixed inset-0 bg-gray-900/50 lg:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}
        </>
    );
}
