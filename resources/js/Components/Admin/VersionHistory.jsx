import { Clock, ArrowDown, Check, ArrowLeft } from 'lucide-react';

export function VersionHistory({ versions, currentVersion, onVersionSelect }) {
    return (
        <div className="relative">
            <div className="absolute top-0 bottom-0 left-8 w-px bg-gray-200 dark:bg-gray-700" />

            <ul className="space-y-6">
                {versions.map((version, index) => (
                    <li key={version.id} className="relative">
                        <div className="relative flex items-center">
                            <div className={`absolute -left-2 h-4 w-4 rounded-full ${
                                version.version === currentVersion
                                    ? 'bg-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                                    : 'bg-gray-200 dark:bg-gray-700'
                            }`}>
                                {version.version === currentVersion && (
                                    <Check className="h-3 w-3 text-white" />
                                )}
                            </div>

                            <button
                                onClick={() => onVersionSelect(version)}
                                className={`ml-6 flex flex-col items-start rounded-lg p-3 w-full hover:bg-gray-50 dark:hover:bg-gray-800 ${
                                    version.version === currentVersion
                                        ? 'bg-blue-50 dark:bg-blue-900/20'
                                        : ''
                                }`}
                            >
                                <div className="flex items-center text-sm font-medium text-gray-900 dark:text-white">
                                    <span>Version {version.version}</span>
                                    {version.version === currentVersion && (
                                        <span className="ml-2 text-xs font-medium text-blue-600 dark:text-blue-400">
                                            (Current)
                                        </span>
                                    )}
                                </div>

                                <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {new Date(version.created_at).toLocaleDateString()}
                                </div>

                                {version.changelog && (
                                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                        {version.changelog}
                                    </p>
                                )}
                            </button>
                        </div>

                        {index !== versions.length - 1 && (
                            <div className="absolute -bottom-4 left-8 -translate-x-1/2 text-gray-400 dark:text-gray-600">
                                <ArrowDown className="h-4 w-4" />
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
