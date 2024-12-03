<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaFile;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Intervention\Image\Image;

class MediaFileController extends Controller
{
    public function index()
    {
        $files = MediaFile::with('user')
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Media/Index', [
            'files' => $files
        ]);
    }

    public function upload(Request $request)
    {

        $request->validate([
            'file' => 'required|file|max:10240',
            'collection' => 'nullable|string',
            'categories' => 'nullable|array',
            'categories.*' => 'exists:media_categories,id'
        ]);

        $file = $request->file('file');
        $collection = $request->input('collection', 'default');

        $fileName = Str::random(40) . '.' . $file->getClientOriginalExtension();
        $path = $file->storeAs("uploads/{$collection}", $fileName, 'public');

// Handle image optimization if it's an image
        if (Str::startsWith($file->getMimeType(), 'image/')) {
            $image = Image::make(Storage::disk('public')->path($path));

// Optimize the image while maintaining aspect ratio
            $image->resize(1920, 1920, function ($constraint) {
                $constraint->aspectRatio();
                $constraint->upsize();
            });

            $image->save(null, 80); // Save with 80% quality
        }

        $mediaFile = MediaFile::create([
            'user_id' => auth()->id(),
            'name' => $fileName,
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'collection' => $collection,
            'disk' => 'public',
            'meta' => [
                'dimensions' => Str::startsWith($file->getMimeType(), 'image/')
                    ? getimagesize(Storage::disk('public')->path($path))
                    : null
            ]
        ]);

        if ($request->categories) {
            $mediaFile->categories()->attach($request->categories);
        }

        return response()->json($mediaFile->load('categories'));
    }

    public function destroy(MediaFile $mediaFile)
    {
        Storage::disk($mediaFile->disk)->delete($mediaFile->path);
        $mediaFile->delete();

        return redirect()->back();
    }

    public function bulkDelete(Request $request)
    {
        $request->validate([
            'ids' => 'required|array'
        ]);

        $files = MediaFile::whereIn('id', $request->ids)->get();

        foreach ($files as $file) {
            Storage::disk($file->disk)->delete($file->path);
            $file->delete();
        }

        return redirect()->back();
    }
}
