<?php

use Tests\TestCase;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use App\Http\Controllers\CheckoutController;
use Symfony\Component\HttpFoundation\Response;
use Stripe\Exception\SignatureVerificationException;
use Stripe\Webhook;
use Illuminate\Support\Str;

uses(TestCase::class, RefreshDatabase::class);

it('returns 400 when the Stripe signature is invalid', function () {

    // Arrange
    $payload   = '{}';
    $sigHeader = 't=1111111,v1=fake';
    $secret    = 'whsec_test';

    Mockery::mock('alias:Stripe\Webhook')
        ->shouldReceive('constructEvent')
        ->once()
        ->with($payload, $sigHeader, $secret)
        ->andThrow(new SignatureVerificationException('Invalid signature'));

    $request = Request::create(
        '/webhook/stripe',
        'POST',
        content: $payload,
        server: ['HTTP_STRIPE_SIGNATURE' => $sigHeader],
    );

    // Act
    $response = app(CheckoutController::class)->webhook($request);

    // Assert
    expect($response->getStatusCode())
        ->toBe(Response::HTTP_BAD_REQUEST);
});
/*
|--------------------------------------------------------------------------
| Helper – build a fake Stripe event object
|--------------------------------------------------------------------------
*/
function fakeStripeEvent(string $type): object
{
    $event          = new stdClass();
    $event->id      = 'evt_' . Str::random(8);
    $event->type    = $type;

    $data           = new stdClass();
    $object         = new stdClass();
    $data->object   = $object;   // controller only dereferences ->object
    $event->data    = $data;

    return $event;
}


it('returns 204 on a valid payment_intent.succeeded event', function () {

    $payload   = '{}';
    $sigHeader = 't=1111111,v1=goodhash';
    $secret    = 'whsec_test';

    Mockery::mock('alias:Stripe\Webhook')
        ->shouldReceive('constructEvent')
        ->once()
        ->andReturn(fakeStripeEvent('payment_intent.succeeded'));

    $request  = Request::create(
        '/webhook/stripe',
        'POST',
        content: $payload,
        server: ['HTTP_STRIPE_SIGNATURE' => $sigHeader],
    );

    $response = app(CheckoutController::class)->webhook($request);

    expect($response->getStatusCode())
        ->toBe(Response::HTTP_NO_CONTENT);      // 204
});



it('returns 204 on a valid but unrelated event type', function () {

    $payload   = '{}';
    $sigHeader = 't=1111111,v1=goodhash';
    $secret    = 'whsec_test';

    Mockery::mock('alias:Stripe\Webhook')
        ->shouldReceive('constructEvent')
        ->once()
        ->andReturn(fakeStripeEvent('charge.refunded'));

    $request  = Request::create(
        '/webhook/stripe',
        'POST',
        content: $payload,
        server: ['HTTP_STRIPE_SIGNATURE' => $sigHeader],
    );

    $response = app(CheckoutController::class)->webhook($request);

    expect($response->getStatusCode())
        ->toBe(Response::HTTP_NO_CONTENT);      // 204
});