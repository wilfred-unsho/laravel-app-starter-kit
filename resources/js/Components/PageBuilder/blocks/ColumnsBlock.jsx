import { useState } from 'react';
import { LayoutGrid, Grid2x2, Grid3x3, ChevronDown } from 'lucide-react';

export default function ColumnsBlock({ data = {}, onChange, children, preview = false }) {
    const columns = data.columns || 2;
    const gap = data.gap || 4;

    if (preview) {
        return (
            <div className={`grid grid-cols-${columns} gap-${gap}`}>
                {children}
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <div className="relative">
                    <select
                        value={columns}
                        onChange={(e) => onChange({ ...data, columns: parseInt(e.target.value) })}
                        className="w-full border rounded-md p-2 pr-8 appearance-none"
                    >
                        <option value={2}>2 Columns</option>
                        <option value={3}>3 Columns</option>
                        <option value={4}>4 Columns</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>

                <div className="relative">
                    <select
                        value={gap}
                        onChange={(e) => onChange({ ...data, gap: parseInt(e.target.value) })}
                        className="w-full border rounded-md p-2 pr-8 appearance-none"
                    >
                        <option value={2}>Small Gap</option>
                        <option value={4}>Medium Gap</option>
                        <option value={6}>Large Gap</option>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            <div className={`grid grid-cols-${columns} gap-${gap} min-h-[100px] border-2 border-dashed border-gray-300 rounded-lg p-4`}>
                {children || (
                    <div className="col-span-full flex items-center justify-center text-gray-400">
                        <LayoutGrid className="w-6 h-6 mr-2" />
                        <span>Add blocks to columns</span>
                    </div>
                )}
            </div>
        </div>
    );
}
