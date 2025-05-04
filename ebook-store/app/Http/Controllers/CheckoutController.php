<?php
namespace App\Http\Controllers;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\Order;
use App\Models\OrderItem;

class CheckoutController extends Controller
{
    public function index(Request $req)
    {
        $cartItems = $req->user()
                         ->cartItems()
                         ->with('ebook')
                         ->get();
    
        return Inertia::render('Checkout', [
            'cartItems' => $cartItems,
            
        ]);
    }
    public function store(Request $req)
    {
        $user = $req->user();
        $cart = $user->cartItems()->with('ebook')->get();

        if($cart->isEmpty()){
            return back()->with('error','Cart is empty');
        }

        // Calculate total
        $total = $cart->sum(fn($c)=> $c->quantity * $c->ebook->price);

        DB::transaction(function() use($user,$cart,$total){
            $order = Order::create([
                'user_id'=> $user->id,
                'total'  => $total,
                'status' => 'paid',
            ]);

            foreach($cart as $c){
                OrderItem::create([
                    'order_id'  => $order->id,
                    'ebook_id'  => $c->ebook->id,
                    'quantity'  => $c->quantity,
                    'unit_price'=> $c->ebook->price,
                ]);
            }

            // clear cart
            $user->cartItems()->delete();
        });

        return redirect()->route('orders.show')->with('success','Order placed!');
    }
}
