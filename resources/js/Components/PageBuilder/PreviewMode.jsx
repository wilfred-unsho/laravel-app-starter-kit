import { useState } from 'react';
import { Monitor, Tablet, Smartphone, X } from 'lucide-react';
import * as Blocks from './blocks';

export default function PreviewMode({ page, onClose }) {
    const [device, setDevice] = useState('desktop');

    const deviceWidths = {
        desktop: 'max-w-full',
        tablet: 'max-w-[768px]',
        mobile: 'max-w-[375px]'
    };

    const renderBlock = (block, index) => {
        const Component = Blocks[block.type];
        return Component ? (
            <div key={index} className="my-4">
                <Component data={block.data} preview />
            </div>
        ) : null;
    };

    return (
        <div className="fixed inset-0 bg-gray-100">
            <div className="flex h-full flex-col">
                <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
                    <div className="flex gap-4">
                        <button
                            onClick={() => setDevice('desktop')}
                            className={`p-2 rounded ${device === 'desktop' ? 'bg-gray-100' : ''}`}
                        >
                            <Monitor className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setDevice('tablet')}
                            className={`p-2 rounded ${device === 'tablet' ? 'bg-gray-100' : ''}`}
                        >
                            <Tablet className="w-5 h-5" />
                        </button>
                        <button
                            onClick={() => setDevice('mobile')}
                            className={`p-2 rounded ${device === 'mobile' ? 'bg-gray-100' : ''}`}
                        >
                            <Smartphone className="w-5 h-5" />
                        </button>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="flex-1 overflow-auto p-4">
                    <div className={`mx-auto bg-white shadow-lg ${deviceWidths[device]} transition-all duration-300`}>
                        <div className="p-4">
                            <h1 className="text-3xl font-bold mb-6">{page.title}</h1>
                            {page.content.map((block, index) => renderBlock(block, index))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
