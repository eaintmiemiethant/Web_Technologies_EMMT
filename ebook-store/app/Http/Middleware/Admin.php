<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Admin
{
    public function handle(Request $request, Closure $next): Response
    {
        // 1) not logged in → send to login
        if (! $request->user()) {
            return redirect()->route('login');
        }

        // 2) logged in but not admin → send back to landing
        if (! $request->user()->is_admin) {
            return redirect()->route('landing')
                             ->with('error', 'You must be an admin to access that page.');
        }

        return $next($request);
    }
}
