<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Models\OrderItem;
use Stripe\Stripe;
use Stripe\PaymentIntent;

class CheckoutController extends Controller
{
    /**
     * Show the checkout page with cart items & return Stripe publishable key.
     */
    public function index(Request $request)
    {
        $cartItems = $request->user()
            ->cartItems()
            ->with('ebook')
            ->get();

        return Inertia::render('Checkout', [
            'cartItems' => $cartItems,
            'stripeKey' => config('services.stripe.key'),
        ]);
    }

    /**
     * AJAX endpoint to create a Stripe PaymentIntent.
     */
    public function createPaymentIntent(Request $request)
    {
        $user = $request->user();
        $cart = $user->cartItems()->with('ebook')->get();

        if ($cart->isEmpty()) {
            return response()->json(['error' => 'Cart is empty'], 422);
        }

        // Calculate total in cents
        $amount = $cart->sum(fn($c) => $c->quantity * $c->ebook->price) * 100;

        Stripe::setApiKey(config('services.stripe.secret'));

        $intent = PaymentIntent::create([
            'amount'   => (int) $amount,
            'currency' => 'aud',
            'payment_method_types' => ['card'],
            'metadata' => [
                'user_id' => $user->id,
            ],
        ]);

        return response()->json([
            'clientSecret' => $intent->client_secret,
        ]);
    }

    public function confirm(Request $request)
    {
        $piId = $request->query('payment_intent');
        Stripe::setApiKey(config('services.stripe.secret'));
        $pi = PaymentIntent::retrieve($piId);

        if ($pi->status !== 'succeeded') {
            return redirect()
                ->route('checkout.index')
                ->with('error', 'Payment not completed.');
        }

        $user = $request->user();

        // Will hold the new order’s ID
        $newOrderId = null;

        DB::transaction(function () use ($user, $pi, &$newOrderId) {
            // Prevent double‐submit on retries
            if (Order::where('stripe_intent_id', $pi->id)->exists()) {
                return;
            }

            // Create the Order
            $order = Order::create([
                'user_id'          => $user->id,
                'total'            => $pi->amount_received / 100,
                'status'           => 'paid',
                'stripe_intent_id' => $pi->id,
            ]);

            // Create OrderItems
            $cart = $user->cartItems()->with('ebook')->get();
            foreach ($cart as $ci) {
                OrderItem::create([
                    'order_id'   => $order->id,
                    'ebook_id'   => $ci->ebook->id,
                    'quantity'   => $ci->quantity,
                    'unit_price' => $ci->ebook->price,
                ]);
            }

            // Clear the cart
            $user->cartItems()->delete();

            // Remember the created order’s ID
            $newOrderId = $order->id;
        });

        // Check if the order was created
        if (! $newOrderId) {
            return redirect()
                ->route('orders.index')
                ->with('success', 'Payment already processed.');
        }

        // Redirect to the show page with the real ID
        return redirect()
            ->route('orders.show', $newOrderId)
            ->with('success', 'Payment successful & order placed!');
    }
}
