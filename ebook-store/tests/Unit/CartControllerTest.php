<?php

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpKernel\Exception\HttpException;
use App\Http\Controllers\CartController;
use App\Models\{User, Category, Ebook, CartItem};

uses(TestCase::class, RefreshDatabase::class);

/**
 * Helper – create a user, a category, and an ebook.
 */
function makeUserAndBook(): array
{
    $uid = uniqid();

    $user = User::create([
        'name'              => 'Buyer ' . $uid,
        'email'             => "$uid@example.com",
        'password'          => 'secret',
        'email_verified_at' => now(),
    ]);

    $category = Category::create([
        'name' => 'Cat ' . $uid,
        'slug' => 'cat-' . $uid,
    ]);

    $ebook = Ebook::create([
        'external_id' => random_int(1, 1_000_000),
        'title'       => 'Book ' . $uid,
        'author'      => 'Anon',
        'price'       => 9.99,
        'category_id' => $category->id,
        'cover_image' => 'dummy.jpg',
        'file_path'   => 'dummy.pdf',
        'description' => 'dummy',
        'subjects'    => [],
    ]);

    return [$user, $ebook];
}

it('store() creates a new cart item when none exists', function () {
    [$user, $ebook] = makeUserAndBook();

    $request = Request::create('/cart', 'POST', ['ebook_id' => $ebook->id]);
    $request->setUserResolver(fn() => $user);

    $response = (new CartController)->store($request);

    expect($response->getStatusCode())->toBe(302);

    $this->assertDatabaseHas('cart_items', [
        'user_id'  => $user->id,
        'ebook_id' => $ebook->id,
        'quantity' => 1,
    ]);
});

it('store() increments quantity if the same ebook is added twice', function () {
    [$user, $ebook] = makeUserAndBook();

    $request = Request::create('/cart', 'POST', ['ebook_id' => $ebook->id]);
    $request->setUserResolver(fn() => $user);

    (new CartController)->store($request);
    (new CartController)->store($request);

    $item = CartItem::firstWhere([
        'user_id'  => $user->id,
        'ebook_id' => $ebook->id,
    ]);

    expect($item->quantity)->toBe(2);
});

it('update() changes quantity for the owner', function () {
    [$user, $ebook] = makeUserAndBook();

    $cartItem = CartItem::create([
        'user_id'  => $user->id,
        'ebook_id' => $ebook->id,
        'quantity' => 1,
    ]);

    $request = Request::create("/cart/{$cartItem->id}", 'PATCH', ['quantity' => 5]);
    $request->setUserResolver(fn() => $user);

    $response = (new CartController)->update($request, $cartItem);

    expect($response->getStatusCode())->toBe(302);
    $this->assertDatabaseHas('cart_items', [
        'id'       => $cartItem->id,
        'quantity' => 5,
    ]);
});

it('update() aborts with 403 for a non-owner', function () {
    [$owner, $ebook] = makeUserAndBook();
    [$intruder]      = makeUserAndBook();

    $cartItem = CartItem::create([
        'user_id'  => $owner->id,
        'ebook_id' => $ebook->id,
        'quantity' => 1,
    ]);

    $request = Request::create("/cart/{$cartItem->id}", 'PATCH', ['quantity' => 2]);
    $request->setUserResolver(fn() => $intruder);

    try {
        (new CartController)->update($request, $cartItem);
        $this->fail('Expected HttpException not thrown');
    } catch (HttpException $e) {
        expect($e->getStatusCode())->toBe(Response::HTTP_FORBIDDEN)
            ->and($e->getMessage())->toBe('Unauthorized action.');
    }
});

it('destroy() removes the item for the owner', function () {
    [$user, $ebook] = makeUserAndBook();

    $cartItem = CartItem::create([
        'user_id'  => $user->id,
        'ebook_id' => $ebook->id,
        'quantity' => 1,
    ]);

    $request = Request::create("/cart/{$cartItem->id}", 'DELETE');
    $request->setUserResolver(fn() => $user);

    $response = (new CartController)->destroy($request, $cartItem);

    expect($response->getStatusCode())->toBe(302);
    $this->assertDatabaseMissing('cart_items', ['id' => $cartItem->id]);
});

it('destroy() aborts with 403 for a non-owner', function () {
    [$owner, $ebook] = makeUserAndBook();
    [$intruder]      = makeUserAndBook();

    $cartItem = CartItem::create([
        'user_id'  => $owner->id,
        'ebook_id' => $ebook->id,
        'quantity' => 1,
    ]);

    $request = Request::create("/cart/{$cartItem->id}", 'DELETE');
    $request->setUserResolver(fn() => $intruder);

    try {
        (new CartController)->destroy($request, $cartItem);
        $this->fail('Expected HttpException not thrown');
    } catch (HttpException $e) {
        expect($e->getStatusCode())->toBe(Response::HTTP_FORBIDDEN)
            ->and($e->getMessage())->toBe('Unauthorized action.');
    }
});
