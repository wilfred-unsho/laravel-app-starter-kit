<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\MediaCategory;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MediaCategoryController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Media/Categories/Index', [
            'categories' => MediaCategory::withCount('files')->get()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:media_categories',
            'description' => 'nullable|string'
        ]);

        MediaCategory::create($request->all());
        return redirect()->back();
    }

    public function update(Request $request, MediaCategory $category)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:media_categories,name,' . $category->id,
            'description' => 'nullable|string'
        ]);

        $category->update($request->all());
        return redirect()->back();
    }

    public function destroy(MediaCategory $category)
    {
        $category->delete();
        return redirect()->back();
    }
}
