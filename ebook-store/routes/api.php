<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Models\User;
use App\Http\Controllers\{
    ProfileController,
    EbookDownloadController,
    CartController,
    CheckoutController,
    OrderController
};

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');



Route::post('/generate-token', function (Request $request) {
    // Validate the user credentials as needed, then:
    $user = User::where('email', $request->email)->first();
    
    if (!$user) {
        return response()->json(['message' => 'User not found'], 404);
    }

    $token = $user->createToken('api-token')->plainTextToken;
    return response()->json([
        'access_token' => $token,
        'token_type'   => 'Bearer',
    ]);
});

Route::middleware('auth:sanctum')->group(function () {

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
    Route::get('/cart', [CartController::class, 'index'])->name('cart.index');
    Route::post('/cart', [CartController::class, 'store'])->name('cart.store');
    Route::patch('/cart/{cartItem}', [CartController::class, 'update'])->name('cart.update');
    Route::delete('/cart/{cartItem}', [CartController::class, 'destroy'])->name('cart.destroy');

    // Checkout
    // Show the checkout page & stripe clientSecret
    Route::get('/checkout', [CheckoutController::class, 'index'])
         ->name('checkout.index');

    // AJAX endpoint to create a new PaymentIntent
    Route::post('/checkout/intent', [CheckoutController::class, 'createPaymentIntent'])
         ->name('checkout.intent');

    // Callback after Stripe redirects/confirm
    Route::get('/checkout/confirm', [CheckoutController::class, 'confirm'])
         ->name('checkout.confirm');

    // Orders
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
});

// Public webhook for Stripe to call (if no auth is needed)
Route::post('/webhook/stripe', [CheckoutController::class, 'webhook'])
     ->name('stripe.webhook');