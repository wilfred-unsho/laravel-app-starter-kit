import { useState } from 'react';

export default function ImageBlock({ data = {}, onChange, preview = false }) {
    if (preview) {
        return (
            <img
                src={data.src}
                alt={data.alt || ''}
                className="max-w-full h-auto"
            />
        );
    }

    return (
        <div className="space-y-2">
            <input
                type="text"
                value={data.src || ''}
                onChange={(e) => onChange({ ...data, src: e.target.value })}
                placeholder="Image URL"
                className="w-full p-2 border rounded-md"
            />
            <input
                type="text"
                value={data.alt || ''}
                onChange={(e) => onChange({ ...data, alt: e.target.value })}
                placeholder="Alt text"
                className="w-full p-2 border rounded-md"
            />
        </div>
    );
}
