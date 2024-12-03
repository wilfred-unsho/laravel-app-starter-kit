import { formatDistanceToNow } from 'date-fns';
import { History, RotateCcw, Clock } from 'lucide-react';

export default function RevisionHistory({ revisions, onRestore }) {
    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-gray-400">
                <History className="w-4 h-4" />
                <h3 className="text-sm font-medium uppercase tracking-wider">Revision History</h3>
            </div>

            <div className="space-y-3">
                {revisions.length > 0 ? (
                    revisions.map(revision => (
                        <div
                            key={revision.id}
                            className="p-3 rounded-lg bg-gray-800/50 border border-gray-700/50 hover:bg-gray-800/70 transition-colors"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="text-sm font-medium text-gray-200">
                                        {revision.created_by?.name}
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                                        <Clock className="w-3 h-3" />
                                        {formatDistanceToNow(new Date(revision.created_at), { addSuffix: true })}
                                    </div>
                                </div>
                                <button
                                    onClick={() => onRestore(revision.id)}
                                    className="p-1.5 text-gray-400 hover:text-blue-400 hover:bg-blue-500/10 rounded-md transition-colors"
                                    title="Restore this version"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-sm text-gray-400 text-center py-4">
                        No revisions available
                    </div>
                )}
            </div>
        </div>
    );
}
