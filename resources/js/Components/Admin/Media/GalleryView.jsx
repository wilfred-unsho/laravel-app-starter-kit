import { LayoutGrid, List } from 'lucide-react';

export default function GalleryView({ viewMode, onViewModeChange, children }) {
    return (
        <div>
            <div className="flex justify-end mb-4 gap-2">
                <button
                    onClick={() => onViewModeChange('grid')}
                    className={`p-2 rounded ${viewMode === 'grid' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                >
                    <LayoutGrid className="w-5 h-5" />
                </button>
                <button
                    onClick={() => onViewModeChange('list')}
                    className={`p-2 rounded ${viewMode === 'list' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                >
                    <List className="w-5 h-5" />
                </button>
            </div>

            <div className={viewMode === 'grid'
                ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4'
                : 'space-y-2'
            }>
                {children}
            </div>
        </div>
    );
}
