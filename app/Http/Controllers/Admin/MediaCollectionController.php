<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaCollection;
use App\Models\MediaFile;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MediaCollectionController extends Controller
{
    public function index(Request $request)
    {
        $query = MediaFile::with('user');

        if ($request->search) {
            $query->where('original_name', 'like', "%{$request->search}%");
        }

        if ($request->type) {
            $query->where('mime_type', 'like', "{$request->type}%");
        }

        if ($request->collection) {
            $query->where('collection', $request->collection);
        }

        $files = $query->latest()->paginate(20)->withQueryString();

        return Inertia::render('Admin/Media/Index', [
            'files' => $files,
            'filters' => $request->only(['search', 'type', 'collection'])
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:media_collections,name',
            'description' => 'nullable|string'
        ]);

        MediaCollection::create($request->all());

        return redirect()->back();
    }

    public function destroy(MediaCollection $collection)
    {
        if ($collection->files()->exists()) {
            return back()->withErrors(['message' => 'Cannot delete collection with files']);
        }

        $collection->delete();
        return redirect()->back();
    }
}
