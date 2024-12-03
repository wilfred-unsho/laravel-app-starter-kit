export default function VideoBlock({ data = {}, onChange, preview = false }) {
    if (preview) {
        return (
            <div className="aspect-w-16 aspect-h-9">
                <iframe
                    src={data.url}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>
        );
    }

    return (
        <input
            type="text"
            value={data.url || ''}
            onChange={(e) => onChange({ url: e.target.value })}
            placeholder="Video URL (YouTube, Vimeo)"
            className="w-full p-2 border rounded-md"
        />
    );
}
