<?php

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Controllers\CheckoutController;
use App\Models\{User, Category, Ebook, CartItem};
use Stripe\Exception\ApiErrorException;
use Stripe\Exception\InvalidArgumentException;
use Stripe\Stripe;
use Stripe\PaymentIntent;

uses(TestCase::class, RefreshDatabase::class);

/**
 * Helper – create a user and optionally seed one cart item.
 */
function makeUserWithCart(bool $withItem = false): User
{
    $uid = uniqid();

    $user = User::create([
        'name'              => 'Buyer '.$uid,
        'email'             => "$uid@example.com",
        'password'          => 'secret',
        'email_verified_at' => now(),
    ]);

    if ($withItem) {
        // ensure a Category exists
        $category = Category::create([
            'name' => 'Cat '.$uid,
            'slug' => 'cat-'.$uid,
        ]);

        $ebook = Ebook::create([
            'external_id' => random_int(1, 1_000_000),
            'title'       => 'Book '.$uid,
            'author'      => 'Anon',
            'price'       => 10.00,
            'category_id' => $category->id,
            'cover_image' => 'dummy.jpg',
            'file_path'   => 'dummy.pdf',
            'description' => 'dummy',
            'subjects'    => [],
        ]);

        CartItem::create([
            'user_id'  => $user->id,
            'ebook_id' => $ebook->id,
            'quantity' => 2,
        ]);
    }

    return $user;
}

it('createPaymentIntent returns 422 if the cart is empty', function () {
    $user = makeUserWithCart(false);

    $request = Request::create('/checkout/intent', 'POST', []);
    $request->setUserResolver(fn() => $user);

    $response = (new CheckoutController)->createPaymentIntent($request);

    expect($response->getStatusCode())->toBe(422)
        ->and($response->getData(true))->toHaveKey('error')
        ->and($response->getData(true)['error'])->toBe('Cart is empty');
});

it('createPaymentIntent returns clientSecret when cart has items', function () {
    $user = makeUserWithCart(true);

    // Stub Stripe::setApiKey so it doesn't error
    Stripe::setApiKey('sk_test_dummy');

    // Alias-mock the static PaymentIntent::create call
    Mockery::mock('alias:Stripe\PaymentIntent')
        ->shouldReceive('create')
        ->once()
        ->andReturn((object)['client_secret' => 'test_secret']);

    $request = Request::create('/checkout/intent', 'POST', []);
    $request->setUserResolver(fn() => $user);

    $response = (new CheckoutController)->createPaymentIntent($request);
    $data     = $response->getData(true);

    expect($response->getStatusCode())->toBe(200)
        ->and($data)->toHaveKey('clientSecret')
        ->and($data['clientSecret'])->toBe('test_secret');
});
