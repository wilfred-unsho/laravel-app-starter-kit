import { useState } from 'react';
import { AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

export default function TextBlock({ data, onChange }) {
    const [content, setContent] = useState(data?.content || '');
    const [alignment, setAlignment] = useState(data?.alignment || 'left');

    const handleChange = (newContent) => {
        setContent(newContent);
        onChange({ content: newContent, alignment });
    };

    const handleAlignment = (newAlignment) => {
        setAlignment(newAlignment);
        onChange({ content, alignment: newAlignment });
    };

    return (
        <div className="w-full">
            <div className="mb-2 flex justify-end gap-2">
                <button
                    onClick={() => handleAlignment('left')}
                    className={`p-1 rounded ${alignment === 'left' ? 'bg-blue-100' : ''}`}
                >
                    <AlignLeft className="w-4 h-4" />
                </button>
                <button
                    onClick={() => handleAlignment('center')}
                    className={`p-1 rounded ${alignment === 'center' ? 'bg-blue-100' : ''}`}
                >
                    <AlignCenter className="w-4 h-4" />
                </button>
                <button
                    onClick={() => handleAlignment('right')}
                    className={`p-1 rounded ${alignment === 'right' ? 'bg-blue-100' : ''}`}
                >
                    <AlignRight className="w-4 h-4" />
                </button>
            </div>
            <textarea
                value={content}
                onChange={(e) => handleChange(e.target.value)}
                className="w-full p-2 border rounded"
                rows={4}
            />
        </div>
    );
}
