<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Ebook;
use Illuminate\Http\Request;
use Inertia\Inertia;

class EbookController extends Controller
{
    public function index(Request $request)
    {
        // Allowed sortable columns
        $allowed = ['id', 'title', 'price'];

        // Default sort
        $sort      = in_array($request->sort, $allowed) ? $request->sort : 'id';
        $direction = $request->direction === 'desc'      ? 'desc' : 'asc';

        $ebooks = Ebook::orderBy($sort, $direction)
            ->paginate(10)
            // preserve sort params in pagination links
            ->appends(compact('sort', 'direction'))
            ->through(fn($book) => [
                'id'    => $book->id,
                'title' => $book->title,
                'price' => $book->price,
            ]);

        return Inertia::render('Admin/Ebooks/Index', [
            'ebooks'    => $ebooks,
            'sort'      => $sort,
            'direction' => $direction,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Ebooks/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'external_id' => 'nullable|integer|unique:ebooks,external_id',
            'title'       => 'required|string|max:255',
            'author'      => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'cover_image' => 'nullable|url',
            'file_path'   => 'nullable|url',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        Ebook::create($data);

        return redirect()
            ->route('admin.ebooks.index')
            ->with('success', 'E-book added successfully.');
    }

    public function edit(Ebook $ebook)
    {
        return Inertia::render('Admin/Ebooks/Edit', [
            'ebook' => $ebook->only([
                'id',
                'external_id',
                'title',
                'author',
                'description',
                'price',
                'cover_image',
                'file_path',
                'category_id'
            ]),
        ]);
    }

    public function update(Request $request, Ebook $ebook)
    {
        $data = $request->validate([
            'external_id' => 'nullable|integer|unique:ebooks,external_id,' . $ebook->id,
            'title'       => 'required|string|max:255',
            'author'      => 'nullable|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'cover_image' => 'nullable|url',
            'file_path'   => 'nullable|url',
            'category_id' => 'nullable|exists:categories,id',
        ]);

        $ebook->update($data);

        return redirect()
            ->route('admin.ebooks.index')
            ->with('success', 'E-book updated successfully!');
    }

    public function destroy(Ebook $ebook)
    {
        $ebook->delete();

        return redirect()
            ->route('admin.ebooks.index')
            ->with('success', 'E-book deleted.');
    }
}
