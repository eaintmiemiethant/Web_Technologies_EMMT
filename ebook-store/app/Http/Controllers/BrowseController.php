<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Category;
use App\Models\Ebook;

class BrowseController extends Controller
{
    public function index(Request $request)
    {
        // Load all categories for the dropdown
        $categories = Category::orderBy('name')
            ->get(['id','name','slug']);

        // Build the e-book query
        $query = Ebook::with('category')
            ->orderBy('title');

        // If a category slug was passed, filter by it
        if ($slug = $request->query('category')) {
            $query->whereHas('category', function($q) use ($slug) {
                $q->where('slug', $slug);
            });
        }

        // Paginate results (12 per page)
        $ebooks = $query->paginate(12)
            // preserve the category query param in links
            ->appends(['category' => $slug]);

        // Render the Inertia page
        return Inertia::render('Browse', [
            'categories'     => $categories,
            'ebooks'         => $ebooks,
            'selectedCategory' => $slug,
        ]);
    }
}
