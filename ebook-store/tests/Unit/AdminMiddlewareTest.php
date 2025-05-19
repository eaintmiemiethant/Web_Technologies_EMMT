<?php

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use App\Http\Middleware\Admin;
use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

uses(TestCase::class, RefreshDatabase::class);

/** Helper to invoke the middleware */
function runAdminMiddleware(?User $user): Response
{
    $request = Request::create('/admin/users', 'GET');
    $request->setUserResolver(fn () => $user);

    return (new Admin)->handle($request, fn () => response('OK'));
}

it('redirects guests to the login page', function () {
    $response = runAdminMiddleware(null);

    expect($response->getStatusCode())->toBe(Response::HTTP_FOUND) // 302
        ->and($response->headers->get('Location'))->toBe(route('login'));
});

it('redirects non-admin users to the landing page', function () {
    $user = User::create([
        'name'              => 'Normal User',
        'email'             => 'user@example.com',
        'password'          => 'secret',   // hashed by cast
        'is_admin'          => false,
        'email_verified_at' => now(),
    ]);

    $response = runAdminMiddleware($user);

    expect($response->getStatusCode())->toBe(Response::HTTP_FOUND) // 302
        ->and($response->headers->get('Location'))->toBe(route('landing'))
        ->and(session('error'))->toBe('You must be an admin to access that page.');
});

it('allows admin users to proceed', function () {
    $admin = User::create([
        'name'              => 'Site Admin',
        'email'             => 'admin@example.com',
        'password'          => 'secret',
        'is_admin'          => true,
        'email_verified_at' => now(),
    ]);

    $response = runAdminMiddleware($admin);

    expect($response->getStatusCode())->toBe(Response::HTTP_OK)
        ->and($response->getContent())->toBe('OK');
});
