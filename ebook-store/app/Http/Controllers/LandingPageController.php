<?php

namespace App\Http\Controllers;

use App\Models\Ebook;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LandingPageController extends Controller
{
    public function index(Request $request)
    {
        $slides = [
            [
                'title'    => 'Atomic Habits',
                'subtitle' => 'Build better habits every day.',
                'cta'      => 'Shop Now',
                'image'    => '/storage/heroes/habits.jpg',
            ],
            [
                'title'    => 'The Alchemist',
                'subtitle' => 'Discover your destiny.',
                'cta'      => 'Explore',
                'image'    => '/storage/heroes/alchemist.jpg',
            ],
            [
                'title'    => 'Book Fair 2025',
                'subtitle' => 'Join the biggest event of the year.',
                'cta'      => 'Learn More',
                'image'    => '/storage/heroes/bookfair.jpg',
            ],
        ];

        // 2) Best Sellers: top 4 by number of purchases (orderItems_count)
        $bestSellers = Ebook::withCount('orderItems')
            ->orderBy('order_items_count', 'desc')
            ->take(4)
            ->get(['id','title','price','cover_image']);

        // 3) Features section
        $features = [
            [
                'icon'        => 'LockClosedIcon',
                'title'       => 'Secure Login',
                'description' => 'Protected by modern encryption and JWT tokens.',
            ],
            [
                'icon'        => 'BookOpenIcon',
                'title'       => 'Preview Books',
                'description' => 'Sample the first chapters before buying.',
            ],
            [
                'icon'        => 'ShoppingCartIcon',
                'title'       => 'Easy Checkout',
                'description' => 'Seamless payment flow with Stripe & PayPal.',
            ],
            [
                'icon'        => 'UserGroupIcon',
                'title'       => 'My Library',
                'description' => 'All your purchases in one personal space.',
            ],
            [
                'icon'        => 'ArrowDownTrayIcon',
                'title'       => 'Instant Download',
                'description' => 'Get your e-book immediately after purchase.',
            ],
            [
                'icon'        => 'GiftIcon',
                'title'       => 'Exclusive Deals',
                'description' => 'Limited-time promotions and discounts.',
            ],
        ];

        // 4) Render landing page with every section
        return Inertia::render('LandingPage', [
            'slides'      => $slides,
            'bestSellers' => $bestSellers,
            'features'    => $features,
        ]);
    }
}
