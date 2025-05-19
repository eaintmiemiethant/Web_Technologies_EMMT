/**
 * @jest-environment jsdom
 */

global.route = (name, param) => {
  if (name === "browse") return "/browse";
  if (name === "ebooks.show") return `/ebooks/${param}`;
  return "/";
};

jest.mock('@/Layouts/MainLayout', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="main-layout">{children}</div>,
}));

jest.mock('@heroicons/react/24/outline', () => ({
  ChevronLeftIcon: (props) => <svg data-testid="ChevronLeftIcon" {...props} />,
  ChevronRightIcon: (props) => <svg data-testid="ChevronRightIcon" {...props} />,
  BookOpenIcon: (props) => <svg data-testid="BookOpenIcon" {...props} />,
  ShoppingCartIcon: (props) => <svg data-testid="ShoppingCartIcon" {...props} />,
  UserGroupIcon: (props) => <svg data-testid="UserGroupIcon" {...props} />,
  GiftIcon: (props) => <svg data-testid="GiftIcon" {...props} />,
  ArrowDownTrayIcon: (props) => <svg data-testid="ArrowDownTrayIcon" {...props} />,
  LockClosedIcon: (props) => <svg data-testid="LockClosedIcon" {...props} />,
}));

jest.mock("keen-slider/react", () => ({
  useKeenSlider: () => [jest.fn(), { current: { prev: jest.fn(), next: jest.fn(), moveToIdx: jest.fn() } }],
}));

jest.mock('@inertiajs/react', () => ({
  usePage: () => ({
    props: {
      slides: [
        {
          title: 'Atomic Habits',
          subtitle: 'Build better habits every day.',
          cta: 'Shop Now',
          image: '/storage/heroes/habits.jpg',
        },
        {
          title: 'The Alchemist',
          subtitle: 'Discover your destiny.',
          cta: 'Explore',
          image: '/storage/heroes/alchemist.jpg',
        },
        {
          title: 'Book Fair 2025',
          subtitle: 'Join the biggest event of the year.',
          cta: 'Learn More',
          image: '/storage/heroes/bookfair.jpg',
        },
      ],
      bestSellers: [
        {
          id: 1,
          title: "Atomic Habits",
          price: 11.99,
          cover_image: "/covers/habits.jpg"
        },
        {
          id: 2,
          title: "The Alchemist",
          price: 13.49,
          cover_image: "/covers/alchemist.jpg"
        },
        {
          id: 3,
          title: "1984",
          price: 9.99,
          cover_image: "/covers/1984.jpg"
        },
        {
          id: 4,
          title: "Deep Work",
          price: 15.00,
          cover_image: "/covers/deepwork.jpg"
        },
      ],
      features: [
        {
          icon: 'LockClosedIcon',
          title: 'Secure Login',
          description: 'Protected by modern encryption and JWT tokens.',
        },
        {
          icon: 'BookOpenIcon',
          title: 'Preview Books',
          description: 'Sample the first chapters before buying.',
        },
        {
          icon: 'ShoppingCartIcon',
          title: 'Easy Checkout',
          description: 'Seamless payment flow with Stripe.',
        },
        {
          icon: 'UserGroupIcon',
          title: 'My Library',
          description: 'All your purchases in one personal space.',
        },
        {
          icon: 'ArrowDownTrayIcon',
          title: 'Instant Download',
          description: 'Get your e-book immediately after purchase.',
        },
      ],
    },
  }),
  Link: ({ href, children, ...props }) => <a href={href} {...props}>{children}</a>,
}));

import React from "react";
import { render, screen, within } from "@testing-library/react";
import LandingPage from "@/Pages/LandingPage";

describe("LandingPage", () => {
  it("renders hero slider, best sellers, and features", () => {
    render(<LandingPage />);
    // Hero slide titles appear in both hero and best sellers, so use getAllByText
    expect(screen.getAllByText("Atomic Habits").length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText("The Alchemist").length).toBeGreaterThanOrEqual(2);

    // Hero slide subtitle and button
    expect(screen.getByText("Build better habits every day.")).toBeInTheDocument();
    expect(screen.getByText("Shop Now")).toBeInTheDocument();

    // Best sellers: check that best sellers section contains the correct book title and price
    const bestSellersSection = screen.getByText("Best Sellers").closest("section");
    expect(
      within(bestSellersSection).getByRole("heading", { name: "The Alchemist" })
    ).toBeInTheDocument();
    expect(
      within(bestSellersSection).getByText("$13.49")
    ).toBeInTheDocument();

    // Features
    expect(screen.getByText("Secure Login")).toBeInTheDocument();
    expect(screen.getByText("Protected by modern encryption and JWT tokens.")).toBeInTheDocument();
    expect(screen.getByText("Easy Checkout")).toBeInTheDocument();
    expect(screen.getByText("Instant Download")).toBeInTheDocument();
  });
});