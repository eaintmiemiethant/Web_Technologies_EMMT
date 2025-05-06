<?php

use Illuminate\Routing\Middleware\SubstituteBindings;
use Illuminate\Foundation\Http\Middleware\ValidatePostSize;
use Illuminate\Cookie\Middleware\EncryptCookies;
use Illuminate\Cookie\Middleware\AddQueuedCookiesToResponse;
use Illuminate\Session\Middleware\StartSession;
use Illuminate\Routing\Middleware\ThrottleRequests;
use Illuminate\View\Middleware\ShareErrorsFromSession;
use Illuminate\Routing\Middleware\EnsureFrontendRequestsAreStateful;

return [

    /*
    |--------------------------------------------------------------------------
    | Global HTTP Middleware Stack
    |--------------------------------------------------------------------------
    |
    | These middleware run on every request to your application.
    |
    */
    'global' => [
        EncryptCookies::class,
        AddQueuedCookiesToResponse::class,
        StartSession::class,
        ValidatePostSize::class,
        SubstituteBindings::class,
        EnsureFrontendRequestsAreStateful::class, // for sanctum if you use it
    ],

    /*
    |--------------------------------------------------------------------------
    | Route Middleware
    |--------------------------------------------------------------------------
    |
    | These middleware may be assigned to routes or groups by name.
    |
    */
    'route' => [
        'auth'     => \App\Http\Middleware\Authenticate::class,
        'guest'    => \App\Http\Middleware\RedirectIfAuthenticated::class,
        'verified' => \Illuminate\Auth\Middleware\EnsureEmailIsVerified::class,

        // ← Add your Admin middleware alias here:
        'admin'    => \App\Http\Middleware\Admin::class,

        // you can add more custom middleware here…
        'throttle' => ThrottleRequests::class,
        'bindings' => SubstituteBindings::class,
        'errors'   => ShareErrorsFromSession::class,
    ],
];
