<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\BrowseController;
use App\Http\Controllers\EbookController;
use App\Http\Controllers\EbookDownloadController;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('LandingPage');
});

Route::get('/browse', [BrowseController::class, 'index'])
     ->name('browse');

Route::get('/ebooks/{ebook}', [EbookController::class, 'show'])
     ->name('ebooks.show');

// Breeze / Inertia auth routes
require __DIR__ . '/auth.php';

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard Inertia page
    Route::get('/dashboard', function () {
        return Inertia::render('Dashboard');
    })->name('dashboard');

    // Profile pages
    Route::get('/profile', [ProfileController::class, 'edit'])
         ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
         ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
         ->name('profile.destroy');

    // E-Book download (requires login & purchase-check later)
    Route::get('/ebooks/{ebook}/download', [EbookDownloadController::class, 'download'])
         ->name('ebooks.download');
});
