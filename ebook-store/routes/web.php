<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\{
    BrowseController,
    EbookController,
    EbookDownloadController,
    CartController,
    CheckoutController,
    OrderController,
    ProfileController
};
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\EbookController as AdminEbookController;
use App\Http\Middleware\Admin;
use App\Http\Controllers\LandingPageController;

// Public (no login required)
// Route::get('/', fn() => Inertia::render('LandingPage'))
//     ->name('landing');
Route::get('/', [LandingPageController::class, 'index'])
     ->name('landing');

Route::get('/browse', [BrowseController::class, 'index'])
    ->name('browse');

Route::get('/ebooks/{ebook}', [EbookController::class, 'show'])
    ->name('ebooks.show');

// Breeze / Inertia Auth (login, register, password reset, etc.)
require __DIR__.'/auth.php';

// Authenticated (login + email-verified required)
Route::middleware(['auth', 'verified'])->group(function () {

    // Admin & authorization
    //  - must be logged in, verified, and pass your 'admin' middleware
    Route::prefix('admin')
         ->middleware(Admin::class)
         ->name('admin.')
         ->group(function () {
             Route::resource('users', UserController::class)
                  ->only(['index','edit','update','destroy']);
             Route::resource('ebooks', AdminEbookController::class)
             ->only(['index','create','store','edit','update','destroy']);
         });

    // Dashboard
    Route::get('/dashboard', fn() => Inertia::render('Dashboard'))
         ->name('dashboard');

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])
         ->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])
         ->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])
         ->name('profile.destroy');

    // Download purchased ebook
    Route::get('/ebooks/{ebook}/download', [EbookDownloadController::class, 'download'])
         ->name('ebooks.download');

    // Shopping Cart
    Route::get('/cart',    [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart',   [CartController::class, 'store'])->name('cart.store');
    Route::patch('/cart/{cartItem}',   [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cartItem}',  [CartController::class, 'destroy'])->name('cart.destroy');

    // Checkout
    Route::get('/checkout',  [CheckoutController::class, 'index'])->name('checkout.index');
    Route::post('/checkout', [CheckoutController::class, 'store'])->name('checkout.store');

    // Orders
    Route::get('/orders',         [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
});

