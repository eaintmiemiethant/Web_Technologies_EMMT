<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Ebook;
use App\Models\OrderItem;

class EbookDownloadController extends Controller
{
    /**
     * Redirect the user straight to the public PDF/EPUB URL after verifying purchase.
     */
    public function download(Request $request, Ebook $ebook)
    {
        $user = $request->user();

        // Check for a paid order containing this ebook
        $hasBought = OrderItem::where('ebook_id', $ebook->id)
            ->whereHas('order', fn($q) => $q
                ->where('user_id', $user->id)
                ->where('status', 'paid')
            )
            ->exists();

        if (! $hasBought) {
            abort(403, 'You must purchase this e-book before downloading.');
        }

        // Build the Gutenberg PDF (or EPUB) URL
        $id   = $ebook->id;
        $pdf  = "https://www.gutenberg.org/cache/epub/{$id}/pg{$id}.pdf";
        $epub = "https://www.gutenberg.org/cache/epub/{$id}/pg{$id}.epub";

        // Choose whichever you prefer—here, PDF by default
        $downloadUrl = $pdf;

        // Redirect the browser straight to the remote file
        return redirect()->away($downloadUrl);
    }
}
