<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Ebook;
use Illuminate\Http\Request;

class EbookController extends Controller
{
    public function show(Ebook $ebook)
    {
        
        $ebook->load('category');

        return Inertia::render('Ebooks/Show', [
          'ebook' => $ebook
        ]);
    }
}
