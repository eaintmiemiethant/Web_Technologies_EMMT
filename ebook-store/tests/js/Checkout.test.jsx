/**
 * @jest-environment jsdom
 */

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Checkout from "@/Pages/Checkout";
import { act } from "@testing-library/react";

global.route = (name, param) => {
  if (name === "browse") return "/browse";
  if (name === "checkout.intent") return "/checkout/intent";
  if (name === "checkout.confirm") return `/checkout/confirm?payment_intent=${param.payment_intent}`;
  return "/";
};

beforeAll(() => {
  jest.spyOn(console, 'error').mockImplementation((msg, ...args) => {
    if (
      typeof msg === 'string' &&
      msg.includes('not wrapped in act')
    ) {
      return;
    }
    // Keep other errors
    console.error(msg, ...args);
  });
});
// Mock AuthenticatedLayout
jest.mock('@/Layouts/AuthenticatedLayout', () => ({
  __esModule: true,
  default: ({ header, children }) => (
    <div>
      <div data-testid="header">{header}</div>
      {children}
    </div>
  ),
}));

// Mock @stripe/stripe-js
jest.mock('@stripe/stripe-js', () => ({
  loadStripe: () => "stripe_instance"
}));

// Mock @stripe/react-stripe-js entirely inside the factory
jest.mock('@stripe/react-stripe-js', () => {
  let confirmCardPaymentMock = jest.fn();
  let getElementMock = jest.fn();

  return {
    Elements: ({ children }) => <div data-testid="elements">{children}</div>,
    CardElement: jest.fn(() => <div data-testid="card-element" />),
    useStripe: () => ({ confirmCardPayment: confirmCardPaymentMock }),
    useElements: () => ({ getElement: getElementMock }),
    __mocks: {
      get confirmCardPaymentMock() {
        return confirmCardPaymentMock;
      },
      set confirmCardPaymentMock(fn) {
        confirmCardPaymentMock = fn;
      },
      get getElementMock() {
        return getElementMock;
      },
      set getElementMock(fn) {
        getElementMock = fn;
      },
    },
  };
});

// Mock Inertia's usePage
jest.mock('@inertiajs/react', () => ({
  Head: ({ title }) => <title>{title}</title>,
  usePage: jest.fn(),
  Link: ({ href, children, ...props }) => <a href={href} {...props}>{children}</a>,
}));

// Utility to set up mocks for usePage
const setupUsePage = (props) => {
  require('@inertiajs/react').usePage.mockReturnValue({ props });
};

// Mock fetch and CSRF meta
beforeEach(() => {
  // Polyfill window.fetch for JSDOM/Jest
  window.fetch = jest.fn().mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve({ clientSecret: "test_client_secret" }),
    })
  );
  document.head.innerHTML =
    '<meta name="csrf-token" content="csrf123" />';
});

afterEach(() => {
  jest.clearAllMocks();
});

describe("Checkout", () => {
  const cartItems = [
    {
      id: 1,
      quantity: 2,
      ebook: {
        id: 101,
        title: "Atomic Habits",
        price: 11.99,
        cover_image: "/covers/habits.jpg",
      },
    },
    {
      id: 2,
      quantity: 1,
      ebook: {
        id: 102,
        title: "Deep Work",
        price: 15.0,
        cover_image: "/covers/deepwork.jpg",
      },
    },
  ];
  const stripeKey = "pk_test_123";
  const flash = {};

  it("renders empty cart message and browse link", () => {
    setupUsePage({ cartItems: [], stripeKey, flash });
    render(<Checkout />);
    // Use a function matcher to be more robust
    expect(screen.getByText(t =>
      t.startsWith("Your cart is empty")
    )).toBeInTheDocument();
    expect(screen.getByText("Browse books")).toBeInTheDocument();
  });

  it("renders cart items, totals, and payment form", async () => {
    setupUsePage({ cartItems, stripeKey, flash });
    await act(async () => {
    render(<Checkout />);
  });
    // Cart items
    expect(screen.getByText("Atomic Habits")).toBeInTheDocument();
    expect(screen.getByText("$11.99 × 2")).toBeInTheDocument();
    expect(screen.getByText("$23.98")).toBeInTheDocument();
    expect(screen.getByText("Deep Work")).toBeInTheDocument();
    expect(screen.getByText("$15.00 × 1")).toBeInTheDocument();
    expect(screen.getByText("$15.00")).toBeInTheDocument();
    // Wait for clientSecret fetch and Stripe Elements render
    await waitFor(() => {
      expect(screen.getByTestId("elements")).toBeInTheDocument();
      expect(screen.getByTestId("card-element")).toBeInTheDocument();
    });
  });

  it("shows initializing message while fetching clientSecret", async () => {
    setupUsePage({ cartItems, stripeKey, flash });
    window.fetch.mockImplementationOnce(() =>
      new Promise(resolve => setTimeout(() => resolve({
        json: () => Promise.resolve({ clientSecret: "test_client_secret" }),
      }), 100))
    );
    render(<Checkout />);
    expect(screen.getByText("Initializing payment…")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByTestId("elements")).toBeInTheDocument();
    });
  });

  it("shows flash error if present", () => {
    setupUsePage({ cartItems, stripeKey, flash: { error: "Something went wrong!" } });
    render(<Checkout />);
    expect(screen.getByText("Something went wrong!")).toBeInTheDocument();
  });

  it("submits billing info and calls Stripe confirmCardPayment", async () => {
    setupUsePage({ cartItems, stripeKey, flash });
    // Set up Stripe mocks for this test
    const stripeReact = require('@stripe/react-stripe-js');
    stripeReact.__mocks.confirmCardPaymentMock = jest.fn().mockResolvedValue({
      paymentIntent: { id: "pi_123" }
    });
    stripeReact.__mocks.getElementMock = jest.fn().mockReturnValue({});

    // Mock window.location.href
    delete window.location;
    window.location = { href: "" };

    render(<Checkout />);
    await waitFor(() => expect(screen.getByTestId("elements")).toBeInTheDocument());

    // Find all text inputs and fill in order
    const inputEls = screen.getAllByRole('textbox');
    fireEvent.change(inputEls[0], { target: { value: "Alex Tester" } }); // Full Name
    fireEvent.change(inputEls[1], { target: { value: "alex@example.com" } }); // Email
    fireEvent.change(inputEls[2], { target: { value: "123 Main St" } }); // Street Address
    fireEvent.change(inputEls[3], { target: { value: "Metropolis" } }); // City
    fireEvent.change(inputEls[4], { target: { value: "US" } }); // Country

    // Submit form
    fireEvent.click(screen.getByText("Pay Now"));

    await waitFor(() => {
      expect(stripeReact.__mocks.confirmCardPaymentMock).toHaveBeenCalledWith(
        "test_client_secret",
        expect.objectContaining({
          payment_method: expect.objectContaining({
            billing_details: {
              name: "Alex Tester",
              email: "alex@example.com",
              address: {
                line1: "123 Main St",
                city: "Metropolis",
                country: "US",
              },
            },
          }),
        })
      );
      expect(window.location.href).toMatch(
        /\/checkout\/confirm\?payment_intent=pi_123/
      );
    });
  });

  it("shows Stripe error on payment failure", async () => {
    setupUsePage({ cartItems, stripeKey, flash });
    const stripeReact = require('@stripe/react-stripe-js');
    stripeReact.__mocks.confirmCardPaymentMock = jest.fn().mockResolvedValue({
      error: { message: "Card declined" }
    });
    stripeReact.__mocks.getElementMock = jest.fn().mockReturnValue({});

    render(<Checkout />);
    await waitFor(() => expect(screen.getByTestId("elements")).toBeInTheDocument());

    // Find all text inputs and fill in order
    const inputEls = screen.getAllByRole('textbox');
    fireEvent.change(inputEls[0], { target: { value: "Alex Tester" } }); // Full Name
    fireEvent.change(inputEls[1], { target: { value: "alex@example.com" } }); // Email
    fireEvent.change(inputEls[2], { target: { value: "123 Main St" } }); // Street Address
    fireEvent.change(inputEls[3], { target: { value: "Metropolis" } }); // City
    fireEvent.change(inputEls[4], { target: { value: "US" } }); // Country

    fireEvent.click(screen.getByText("Pay Now"));
    await waitFor(() => {
      expect(screen.getByText("Card declined")).toBeInTheDocument();
    });
  });
});