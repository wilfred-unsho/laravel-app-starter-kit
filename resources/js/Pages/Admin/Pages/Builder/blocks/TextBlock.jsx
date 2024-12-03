import { useState } from 'react';

export default function TextBlock({ data = {}, onChange, preview = false }) {
    if (preview) {
        return <div dangerouslySetInnerHTML={{ __html: data.content }} />;
    }

    return (
        <textarea
            value={data.content || ''}
            onChange={(e) => onChange({ content: e.target.value })}
            className="w-full p-2 border rounded-md"
            rows={4}
        />
    );
}
