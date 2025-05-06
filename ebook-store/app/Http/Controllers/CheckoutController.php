<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Models\OrderItem;

class CheckoutController extends Controller
{
    public function index(Request $request)
    {
        $cartItems = $request->user()
                             ->cartItems()
                             ->with('ebook')
                             ->get();

        return Inertia::render('Checkout', [
            'cartItems' => $cartItems,
        ]);
    }

    public function store(Request $request)
    {
        $user     = $request->user();
        $cartItems = $user->cartItems()->with('ebook')->get();

        if ($cartItems->isEmpty()) {
            return back()->with('error', 'Your cart is empty.');
        }

        // Calculate total
        $total = $cartItems->sum(fn($ci) => $ci->quantity * $ci->ebook->price);

        // Prepare a variable to hold the created order
        $newOrder = null;

        DB::transaction(function () use ($user, $cartItems, $total, &$newOrder) {
            // 1) Create the Order
            $newOrder = Order::create([
                'user_id' => $user->id,
                'total'   => $total,
                'status'  => 'paid',
            ]);

            // 2) Create its OrderItems
            foreach ($cartItems as $ci) {
                OrderItem::create([
                    'order_id'   => $newOrder->id,
                    'ebook_id'   => $ci->ebook->id,
                    'quantity'   => $ci->quantity,
                    'unit_price' => $ci->ebook->price,
                ]);
            }

            // 3) Clear the cart
            $user->cartItems()->delete();
        });

        // 4) Redirect to the order details page
        return redirect()
            ->route('orders.show', $newOrder->id)
            ->with('success', 'Order placed successfully!');
    }
}
