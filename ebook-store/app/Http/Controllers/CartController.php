<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use App\Models\CartItem;

class CartController extends Controller
{
    /**
     * Display the user’s cart.
     */
    public function index(Request $request)
    {
        $cartItems = $request->user()
            ->cartItems()
            ->with('ebook:id,title,price,cover_image')
            ->get();

        return Inertia::render('Cart', [
            'cartItems' => $cartItems,
            // propagate any flash messages
            'flash'     => [
                'success' => session('success'),
                'error'   => session('error'),
            ],
        ]);
    }

    /**
     * Add an e-book to the cart (or increment quantity if already present).
     */
    public function store(Request $request): RedirectResponse
    {
        $data = $request->validate([
            'ebook_id' => 'required|exists:ebooks,id',
        ]);

        $userId  = $request->user()->id;
        $ebookId = $data['ebook_id'];

        // Update existing row or create a new one with quantity=1
        $cartItem = CartItem::firstOrNew(
            ['user_id' => $userId, 'ebook_id' => $ebookId]
        );

        $cartItem->quantity = $cartItem->exists
            ? $cartItem->quantity + 1
            : 1;

        $cartItem->save();

        return redirect()
            ->back()
            ->with('success', 'Book added to cart!');
    }

    /**
     * Update the quantity of a cart item.
     */
    public function update(Request $request, CartItem $cartItem): RedirectResponse
    {
        // Ensure the current user owns this cart item
        if ($cartItem->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized action.');
        }

        $data = $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        $cartItem->update(['quantity' => $data['quantity']]);

        return redirect()
            ->back()
            ->with('success', 'Cart updated.');
    }

    /**
     * Remove an item from the cart.
     */
    public function destroy(Request $request, CartItem $cartItem): RedirectResponse
    {
        // Ownership check
        if ($cartItem->user_id !== $request->user()->id) {
            abort(403, 'Unauthorized action.');
        }

        $cartItem->delete();

        return redirect()
            ->back()
            ->with('success', 'Item removed from cart.');
    }
}