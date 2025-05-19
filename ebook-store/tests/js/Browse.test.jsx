/**
 * @jest-environment jsdom
 */

// Mock global Inertia BEFORE importing the component and React
global.Inertia = { get: jest.fn() };

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Browse from "@/Pages/Browse";

// Mock route helper and Inertia router/Link
global.route = (name, param) => {
  if (name === "ebooks.show") return `/ebooks/${param}`;
  if (name === "browse") return "/browse";
  return "/";
};

jest.mock('@/Layouts/MainLayout', () => ({
  __esModule: true,
  default: ({ children }) => <div data-testid="main-layout">{children}</div>,
}));

jest.mock('@inertiajs/react', () => ({
  router: { get: jest.fn() },
  Link: ({ href, children, ...props }) => <a href={href} {...props}>{children}</a>,
  usePage: () => ({}),
}));

afterEach(() => {
  // Reset mocks after each test
  require('@inertiajs/react').router.get.mockClear();
  global.Inertia.get.mockClear();
});

describe("Browse", () => {
  const categories = [
    { id: 1, name: "Business", slug: "business" },
    { id: 2, name: "Fiction", slug: "fiction" },
  ];

  const ebooks = {
    data: [
      {
        id: 101,
        title: "Atomic Habits",
        author: "James Clear",
        price: 11.99,
        cover_image: "/covers/habits.jpg",
      },
      {
        id: 102,
        title: "The Alchemist",
        author: "Paulo Coelho",
        price: 13.49,
        cover_image: "/covers/alchemist.jpg",
      },
      {
        id: 103,
        title: "Free Book",
        author: "Author Zero",
        price: 0,
        cover_image: null,
      },
    ],
    links: [
      { url: null, label: "&laquo; Previous", active: false },
      { url: "/browse?page=1", label: "1", active: true },
      { url: "/browse?page=2", label: "2", active: false },
      { url: "/browse?page=2", label: "Next &raquo;", active: false },
    ],
  };

  it("renders categories, books, and pagination", () => {
    render(
      <Browse
        categories={categories}
        ebooks={ebooks}
        selectedCategory="business"
      />
    );

    // Heading
    expect(screen.getByText("Browse e-Books")).toBeInTheDocument();

    // Category dropdown
    expect(screen.getByDisplayValue("Business")).toBeInTheDocument();
    expect(screen.getByText("Fiction")).toBeInTheDocument();

    // Book cards
    expect(screen.getByText("Atomic Habits")).toBeInTheDocument();
    expect(screen.getByText("James Clear")).toBeInTheDocument();
    expect(screen.getByText("$11.99")).toBeInTheDocument();

    expect(screen.getByText("The Alchemist")).toBeInTheDocument();
    expect(screen.getByText("Paulo Coelho")).toBeInTheDocument();
    expect(screen.getByText("$13.49")).toBeInTheDocument();

    expect(screen.getByText("Free Book")).toBeInTheDocument();
    expect(screen.getByText("Author Zero")).toBeInTheDocument();
    expect(screen.getByText("Free")).toBeInTheDocument();

    // Book detail link
    expect(screen.getAllByText("View Details").length).toBe(3);

    // Pagination
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    // Check for "Next »" using innerHTML due to dangerouslySetInnerHTML
    const nextBtn = Array.from(screen.getAllByRole("button")).find(
      btn => btn.innerHTML.replace(/\s/g, '').includes("Next")
    );
    expect(nextBtn).toBeDefined();
  });

  it("renders empty state if no books", () => {
    render(
      <Browse
        categories={categories}
        ebooks={{ data: [], links: [] }}
        selectedCategory=""
      />
    );
    expect(screen.getByText("No books found.")).toBeInTheDocument();
  });

  it("calls router.get on category change", () => {
    const { container } = render(
      <Browse
        categories={categories}
        ebooks={ebooks}
        selectedCategory=""
      />
    );
    const select = container.querySelector("select");
    fireEvent.change(select, { target: { value: "fiction" } });
    // router.get should be called with the browse route and fiction category
    const router = require('@inertiajs/react').router;
    expect(router.get).toHaveBeenCalledWith(
      "/browse",
      { category: "fiction" },
      { preserveState: true }
    );
  });
});