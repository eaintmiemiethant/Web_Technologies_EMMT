<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Models\Order;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = $request->user()
            ->orders()
            ->with('orderItems.ebook')
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        
        $orders->getCollection()->transform(function ($order) {
            $order->total = (float) $order->total;
            return $order;
        });

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }
    public function show(Request $request, Order $order)
    {
        if ($order->user_id !== $request->user()->id) {
            abort(403);
        }
        $order->load('orderItems.ebook');
        $order->total = (float) $order->total;

        return Inertia::render('Orders/Show', [
            'order' => $order,
        ]);
    }
}
