export default function ColumnsBlock({ data = {}, onChange, children, preview = false }) {
    const columns = data.columns || 2;

    return (
        <div className={`grid grid-cols-${columns} gap-4`}>
            {children}
        </div>
    );
}
