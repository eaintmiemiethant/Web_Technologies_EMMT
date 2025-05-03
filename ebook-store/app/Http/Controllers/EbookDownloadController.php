<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use App\Models\Ebook;
use Illuminate\Support\Str;

class EbookDownloadController extends Controller
{
    /**
     * Stream the e-book file to the user, after enforcing purchase.
     */
    public function download(Request $request, Ebook $ebook)
    {
        $user = $request->user();

        // 1) Check if the user has purchased this e-book
        if (! $user->purchasedEbooks()->where('ebook_id', $ebook->id)->exists()) {
            // If you don't have a pivot table yet, replace the above with your purchase-check logic
            abort(403, 'You must purchase this e-book before downloading.');
        }

        // 2) Stream the file from storage
        $diskPath = $ebook->file_path;
        $filename = Str::slug($ebook->title) . '.pdf';

        return Storage::disk('public')
                      ->download($diskPath, $filename);
    }
}
