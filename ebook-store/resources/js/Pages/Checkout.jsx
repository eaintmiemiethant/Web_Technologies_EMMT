// resources/js/Pages/Checkout.jsx

import React, { useEffect, useState } from 'react'
import { Head, usePage, Link } from '@inertiajs/react'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout'

function CheckoutForm({ clientSecret }) {
  const stripe = useStripe()
  const elements = useElements()

  // Billing fields
  const [billingName, setBillingName] = useState('')
  const [billingEmail, setBillingEmail] = useState('')
  const [billingAddress, setBillingAddress] = useState({
    line1: '',
    city: '',
    country: '',
  })

  const [errorMsg, setErrorMsg] = useState('')
  const [processing, setProcessing] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setProcessing(true)
    setErrorMsg('')

    const cardElement = elements.getElement(CardElement)

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: billingName,
            email: billingEmail,
            address: {
              line1: billingAddress.line1,
              city: billingAddress.city,
              country: billingAddress.country,
            },
          },
        },
      }
    )

    if (error) {
      setErrorMsg(error.message)
      setProcessing(false)
      return
    }

    // Redirect on success
    window.location.href = route('checkout.confirm', {
      payment_intent: paymentIntent.id,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Billing Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={billingName}
            onChange={(e) => setBillingName(e.target.value)}
            required
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            value={billingEmail}
            onChange={(e) => setBillingEmail(e.target.value)}
            required
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700">Street Address</label>
          <input
            type="text"
            value={billingAddress.line1}
            onChange={(e) =>
              setBillingAddress({ ...billingAddress, line1: e.target.value })
            }
            required
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">City</label>
          <input
            type="text"
            value={billingAddress.city}
            onChange={(e) =>
              setBillingAddress({ ...billingAddress, city: e.target.value })
            }
            required
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Country</label>
          <input
            type="text"
            value={billingAddress.country}
            onChange={(e) =>
              setBillingAddress({ ...billingAddress, country: e.target.value })
            }
            required
            className="mt-1 block w-full border rounded px-3 py-2"
          />
        </div>
      </div>

      {/* Card Element */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Card Details</label>
        <div className="mt-1 p-4 border rounded">
          <CardElement />
        </div>
      </div>

      {errorMsg && <p className="text-red-600">{errorMsg}</p>}

      <button
        type="submit"
        disabled={processing}
        className="w-full bg-primary text-white px-6 py-3 rounded disabled:opacity-50"
      >
        {processing ? 'Processing…' : 'Pay Now'}
      </button>
    </form>
  )
}

export default function Checkout() {
  const { cartItems = [], stripeKey, flash = {} } = usePage().props
  const [clientSecret, setClientSecret] = useState(null)

  useEffect(() => {
    fetch(route('checkout.intent'), {
      method: 'POST',
      headers: {
        'X-CSRF-TOKEN': document
          .querySelector('meta[name="csrf-token"]')
          .getAttribute('content'),
      },
      body: JSON.stringify({}), 
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.clientSecret) {
          setClientSecret(data.clientSecret)
        }
      })
  }, [])

  return (
    <>
      <Head title="Checkout" />

      {/* server-side flash errors */}
      {flash.error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">
          {flash.error}
        </div>
      )}

      {cartItems.length === 0 ? (
        <p>
          Your cart is empty.{` `}
          <Link href={route('browse')} className="text-primary underline">
            Browse books
          </Link>
          .
        </p>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b pb-4"
            >
              <div className="flex items-center gap-4">
                <img
                  src={item.ebook.cover_image}
                  alt={item.ebook.title}
                  className="h-16 rounded"
                />
                <div>
                  <h3 className="font-semibold">{item.ebook.title}</h3>
                  <p>
                    ${Number(item.ebook.price).toFixed(2)} × {item.quantity}
                  </p>
                </div>
              </div>
              <p className="font-bold">
                ${(item.ebook.price * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}

          {clientSecret ? (
            <Elements
              stripe={loadStripe(stripeKey)}
              options={{ clientSecret }}
            >
              <CheckoutForm clientSecret={clientSecret} />
            </Elements>
          ) : (
            <p>Initializing payment…</p>
          )}
        </div>
      )}
    </>
  )
}

Checkout.layout = (page) => (
  <AuthenticatedLayout header={<h2 className="text-xl font-semibold">Checkout</h2>}>
    {page}
  </AuthenticatedLayout>
)
