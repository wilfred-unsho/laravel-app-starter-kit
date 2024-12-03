import { useState } from 'react';
import { Link } from '@inertiajs/react';
import {
    LayoutDashboard,
    Users,
    Settings,
    ChevronDown,
    ChevronRight,
    Shield,
    Lock
} from 'lucide-react';

const menuItems = [
    {
        title: 'Dashboard',
        icon: LayoutDashboard,
        href: '/admin/dashboard'
    },
    {
        title: 'User Management',
        icon: Users,
        href: '/admin/users',
        submenu: [
            { title: 'All Users', href: '/admin/users' },
            { title: 'Add User', href: '/admin/users/create' },
        ]
    },
    {
        title: 'Role Management',
        icon: Shield,
        href: '/admin/roles',
        submenu: [
            { title: 'All Roles', href: '/admin/roles' },
            { title: 'Add Role', href: '/admin/roles/create' },
            { title: 'Role Templates', href: '/admin/roles/templates' },
            { title: 'Permissions', href: '/admin/permissions' }
        ]
    },
    {
        title: 'Settings',
        icon: Settings,
        href: '/admin/settings'
    }
];

// Rest of the component code remains the same
export default function Sidebar({ open }) {
    const [expandedItems, setExpandedItems] = useState([]);

    const toggleSubmenu = (index) => {
        setExpandedItems(prev => {
            if (prev.includes(index)) {
                return prev.filter(item => item !== index);
            }
            return [...prev, index];
        });
    };

    return (
        <div className={`${open ? 'w-64' : 'w-20'} transition-all duration-300 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}>
            <div className="flex flex-col h-full">
                {/* Logo */}
                <div className="h-16 flex items-center justify-center">
                    <span className={`text-xl font-bold text-gray-800 dark:text-white ${!open && 'hidden'}`}>
                        Admin Panel
                    </span>
                    {!open && <span className="text-xl font-bold text-gray-800 dark:text-white">AP</span>}
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto">
                    <ul className="py-4">
                        {menuItems.map((item, index) => (
                            <li key={item.title}>
                                {item.submenu ? (
                                    <div>
                                        <button
                                            onClick={() => toggleSubmenu(index)}
                                            className="w-full flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            <item.icon className="h-5 w-5" />
                                            {open && (
                                                <>
                                                    <span className="ml-4">{item.title}</span>
                                                    {expandedItems.includes(index) ? (
                                                        <ChevronDown className="ml-auto h-4 w-4" />
                                                    ) : (
                                                        <ChevronRight className="ml-auto h-4 w-4" />
                                                    )}
                                                </>
                                            )}
                                        </button>
                                        {open && expandedItems.includes(index) && (
                                            <ul className="bg-gray-50 dark:bg-gray-900">
                                                {item.submenu.map(subItem => (
                                                    <li key={subItem.title}>
                                                        <Link
                                                            href={subItem.href}
                                                            className="block px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 pl-12"
                                                        >
                                                            {subItem.title}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        href={item.href}
                                        className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                    >
                                        <item.icon className="h-5 w-5" />
                                        {open && <span className="ml-4">{item.title}</span>}
                                    </Link>
                                )}
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
}
