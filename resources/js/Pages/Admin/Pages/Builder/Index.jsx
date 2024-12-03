import {useState} from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import {Head} from '@inertiajs/react';
import {DragDropContext, Droppable, Draggable} from 'react-beautiful-dnd';
import {Plus, Settings, Eye, Save, ChevronDown, Trash2, Copy, ArrowLeft, FileText, Clock} from 'lucide-react';
import * as Blocks from '@/Components/PageBuilder/blocks';
import MetadataPanel from '@/Components/PageBuilder/MetadataPanel';
import RevisionHistory from '@/Components/PageBuilder/RevisionHistory';
import PreviewMode from '@/Components/PageBuilder/PreviewMode';

export default function Index({page = null, blocks}) {
    const [content, setContent] = useState(page?.content || []);
    const [selectedBlock, setSelectedBlock] = useState(null);
    const [showBlockList, setShowBlockList] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [activeTab, setActiveTab] = useState('blocks'); // blocks, metadata, revisions

    const handleDragEnd = (result) => {
        if (!result.destination) return;
        const items = Array.from(content);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setContent(items);
    };

    const addBlock = (type) => {
        setContent([...content, {type, data: {}}]);
        setShowBlockList(false);
    };

    const updateBlock = (index, data) => {
        const newContent = [...content];
        newContent[index].data = data;
        setContent(newContent);
    };

    const deleteBlock = (index) => {
        const newContent = [...content];
        newContent.splice(index, 1);
        setContent(newContent);
    };

    const duplicateBlock = (index) => {
        const newContent = [...content];
        newContent.splice(index + 1, 0, {...content[index]});
        setContent(newContent);
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            await fetch(page ? route('admin.pages.update', page.id) : route('admin.pages.store'), {
                method: page ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({content})
            });
            // Handle success
        } catch (error) {
            console.error('Save failed:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const BlockComponent = ({block, index}) => {
        const Component = Blocks[block.type];
        return (
            <Draggable draggableId={`block-${index}`} index={index}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="relative group bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4 hover:shadow-md transition-shadow"
                    >
                        <Component
                            data={block.data}
                            onChange={(data) => updateBlock(index, data)}
                        />
                        <div
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                            <button
                                onClick={() => setSelectedBlock(index)}
                                className="p-1 bg-white rounded shadow hover:bg-gray-50"
                            >
                                <Settings className="w-4 h-4"/>
                            </button>
                            <button
                                onClick={() => duplicateBlock(index)}
                                className="p-1 bg-white rounded shadow hover:bg-gray-50"
                            >
                                <Copy className="w-4 h-4"/>
                            </button>
                            <button
                                onClick={() => deleteBlock(index)}
                                className="p-1 bg-white rounded shadow hover:bg-gray-50 text-red-500"
                            >
                                <Trash2 className="w-4 h-4"/>
                            </button>
                        </div>
                    </div>
                )}
            </Draggable>
        );
    };

    const handleMetadataSave = async (metadata) => {
        setIsSaving(true);
        try {
            await fetch(route('admin.pages.update', page.id), {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                },
                body: JSON.stringify({...page, ...metadata})
            });
        } catch (error) {
            console.error('Save failed:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleRevisionRestore = async (revisionId) => {
        if (!confirm('Are you sure you want to restore this version?')) return;

        try {
            await fetch(route('admin.pages.restore', {page: page.id, revision: revisionId}), {
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                }
            });
            window.location.reload();
        } catch (error) {
            console.error('Restore failed:', error);
        }
    };

    return (
        <AdminLayout>
            <Head title={page ? 'Edit Page' : 'New Page'}/>

            {showPreview ? (
                <PreviewMode page={page} onClose={() => setShowPreview(false)}/>
            ) : (

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-lg shadow">
                        <div className="p-6 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <button
                                        onClick={() => window.history.back()}
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                    >
                                        <ArrowLeft className="w-5 h-5"/>
                                    </button>
                                    <h1 className="text-2xl font-semibold">
                                        {page ? 'Edit Page' : 'New Page'}
                                    </h1>
                                </div>
                                <div className="flex gap-3">
                                    <button
                                        onClick={() => setShowPreview(true)}
                                        className="inline-flex items-center px-4 py-2 border rounded-md text-gray-700 bg-white hover:bg-gray-50"
                                    >
                                        <Eye className="w-4 h-4 mr-2"/>
                                        Preview
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={isSaving}
                                        className="inline-flex items-center px-4 py-2 border border-transparent rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                                    >
                                        <Save className="w-4 h-4 mr-2"/>
                                        {isSaving ? 'Saving...' : 'Save'}
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex h-[calc(100vh-12rem)]">

                            <div className="w-64 border-r border-gray-200 p-4 overflow-y-auto">
                                <div className="space-y-4">
                                    <div className="flex border-b">
                                        <button
                                            onClick={() => setActiveTab('blocks')}
                                            className={`px-4 py-2 ${activeTab === 'blocks' ? 'border-b-2 border-blue-500' : ''}`}
                                        >
                                            <FileText className="w-5 h-5"/>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('metadata')}
                                            className={`px-4 py-2 ${activeTab === 'metadata' ? 'border-b-2 border-blue-500' : ''}`}
                                        >
                                            <Settings className="w-5 h-5"/>
                                        </button>
                                        <button
                                            onClick={() => setActiveTab('revisions')}
                                            className={`px-4 py-2 ${activeTab === 'revisions' ? 'border-b-2 border-blue-500' : ''}`}
                                        >
                                            <Clock className="w-5 h-5"/>
                                        </button>
                                    </div>

                                    {activeTab === 'blocks' && (
                                        <div className="space-y-4">
                                            {/* Existing block list code */}
                                        </div>
                                    )}

                                    {activeTab === 'metadata' && (
                                        <MetadataPanel
                                            page={page}
                                            onSave={handleMetadataSave}
                                        />
                                    )}

                                    {activeTab === 'revisions' && (
                                        <RevisionHistory
                                            revisions={page?.revisions || []}
                                            onRestore={handleRevisionRestore}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="w-64 border-r border-gray-200 p-4 overflow-y-auto">
                                <div className="sticky top-0 bg-white pb-4">
                                    <div className="relative">
                                        <button
                                            onClick={() => setShowBlockList(!showBlockList)}
                                            className="w-full inline-flex items-center justify-between px-4 py-2 border rounded-md bg-white hover:bg-gray-50"
                                        >
                                        <span className="flex items-center">
                                            <Plus className="w-4 h-4 mr-2"/>
                                            Add Block
                                        </span>
                                            <ChevronDown className="w-4 h-4"/>
                                        </button>

                                        {showBlockList && (
                                            <div
                                                className="absolute w-full mt-2 py-1 bg-white rounded-md shadow-lg z-10">
                                                {Object.entries(blocks).map(([key, block]) => (
                                                    <button
                                                        key={key}
                                                        onClick={() => addBlock(block.component)}
                                                        className="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center"
                                                    >
                                                    <span
                                                        className="w-8 h-8 mr-2 flex items-center justify-center text-gray-400">
                                                        {block.icon}
                                                    </span>
                                                        {block.name}
                                                    </button>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 p-6 overflow-y-auto">
                                <DragDropContext onDragEnd={handleDragEnd}>
                                    <Droppable droppableId="blocks">
                                        {(provided) => (
                                            <div
                                                {...provided.droppableProps}
                                                ref={provided.innerRef}
                                                className="space-y-4"
                                            >
                                                {content.map((block, index) => (
                                                    <BlockComponent
                                                        key={`block-${index}`}
                                                        block={block}
                                                        index={index}
                                                    />
                                                ))}
                                                {provided.placeholder}
                                            </div>
                                        )}
                                    </Droppable>
                                </DragDropContext>
                            </div>

                            {selectedBlock !== null && (
                                <div className="w-64 border-l border-gray-200 p-4 overflow-y-auto">
                                    <div className="sticky top-0 bg-white">
                                        <h3 className="text-lg font-medium mb-4">Block Settings</h3>
                                        {/* Block specific settings */}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
