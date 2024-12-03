import { Video } from 'lucide-react';

export default function VideoBlock({ data, onChange }) {
    return (
        <div className="w-full">
            <input
                type="text"
                value={data?.url || ''}
                onChange={(e) => onChange({ ...data, url: e.target.value })}
                placeholder="Video URL (YouTube, Vimeo)"
                className="w-full p-2 border rounded mb-2"
            />
            {data?.url && (
                <div className="relative pt-[56.25%]">
                    <iframe
                        src={data.url}
                        className="absolute inset-0 w-full h-full rounded"
                        allowFullScreen
                    />
                </div>
            )}
        </div>
    );
}
