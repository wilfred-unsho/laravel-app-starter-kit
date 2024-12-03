import { Dropdown } from '@/Components/Dropdown/index';
import { User, Settings, Shield, LogOut } from 'lucide-react';

export default function ProfileDropdown({ user }) {
    return (
        <Dropdown>
            <Dropdown.Trigger>
                <button className="flex items-center text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none">
                    <span className="mr-2">{user.name}</span>
                    <div className="h-8 w-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                        <User className="h-5 w-5" />
                    </div>
                </button>
            </Dropdown.Trigger>

            <Dropdown.Content>
                <Dropdown.Link href={route('admin.users.profile.show', user.id)} className="flex items-center">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                </Dropdown.Link>

                <Dropdown.Link href={route('admin.security.2fa')} className="flex items-center">
                    <Shield className="mr-2 h-4 w-4" />
                    Two-Factor Auth
                </Dropdown.Link>

                <Dropdown.Link href={route('admin.security.login-attempts')} className="flex items-center">
                    <Settings className="mr-2 h-4 w-4" />
                    Login Activity
                </Dropdown.Link>

                <Dropdown.Link href={route('logout')} method="post" className="flex items-center">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Dropdown.Link>
            </Dropdown.Content>
        </Dropdown>
    );
}
