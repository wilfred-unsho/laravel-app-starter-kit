import { Loader } from 'lucide-react';

export function LoadingOverlay({ show = false, message = 'Loading...' }) {
    if (!show) return null;

    return (
        <div className="absolute inset-0 bg-white/50 dark:bg-gray-900/50 flex items-center justify-center backdrop-blur-sm rounded-lg">
            <div className="text-center">
                <Loader className="h-8 w-8 animate-spin text-blue-500 mx-auto" />
                <p className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    {message}
                </p>
            </div>
        </div>
    );
}
