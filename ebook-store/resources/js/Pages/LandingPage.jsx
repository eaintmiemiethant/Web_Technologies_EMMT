import React, { useState } from "react";
import { Link } from "@inertiajs/react";
import MainLayout from '@/Layouts/MainLayout';
import {
    BookOpenIcon,
    ShoppingCartIcon,
    UserGroupIcon,
    GiftIcon,
    ArrowDownTrayIcon,
    LockClosedIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

export default function LandingPage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [sliderRef, instanceRef] = useKeenSlider({
        loop: true,
        slideChanged(s) {
            setCurrentSlide(s.track.details.rel);
        },
        slides: { perView: 1 },
    });

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">

            {/* Hero Slider */}
            <div className="relative">
                <div ref={sliderRef} className="keen-slider h-[60vh]">
                    {[
                        {
                            title: "Atomic Habits",
                            subtitle: "Build better habits every day.",
                            cta: "Shop Now",
                        },
                        {
                            title: "The Alchemist",
                            subtitle: "Discover your destiny.",
                            cta: "Explore",
                        },
                        {
                            title: "Book Fair 2025",
                            subtitle: "Join the biggest event of the year.",
                            cta: "Learn More",
                        },
                    ].map((slide, idx) => (
                        <div
                            key={idx}
                            className="keen-slider__slide flex items-center justify-center bg-gradient-to-r from-primary/20 to-purple-300"
                        >
                            <div className="text-center px-6">
                                <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-2">
                                    {slide.title}
                                </h2>
                                <p className="text-lg text-primary/80 mb-6">
                                    {slide.subtitle}
                                </p>
                                <button className="bg-primary text-white px-6 py-3 rounded-full hover:bg-primary-dark transition">
                                    {slide.cta}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
                {/* Arrows */}
                <button
                    onClick={() => instanceRef.current?.prev()}
                    className="absolute left-4 top-1/2 bg-white p-2 rounded-full shadow-md hover:bg-primary/20 transform -translate-y-1/2"
                >
                    <ChevronLeftIcon className="h-6 w-6 text-primary" />
                </button>
                <button
                    onClick={() => instanceRef.current?.next()}
                    className="absolute right-4 top-1/2 bg-white p-2 rounded-full shadow-md hover:bg-primary/20 transform -translate-y-1/2"
                >
                    <ChevronRightIcon className="h-6 w-6 text-primary" />
                </button>
                {/* Dots */}
                <div className="absolute bottom-4 left-1/2 flex space-x-2 transform -translate-x-1/2">
                    {[0, 1, 2].map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => instanceRef.current?.moveToIdx(idx)}
                            className={`w-3 h-3 rounded-full ${
                                currentSlide === idx
                                    ? "bg-primary"
                                    : "bg-gray-300"
                            }`}
                        />
                    ))}
                </div>
            </div>

            {/* Best Sellers Section */}
            <section id="best-sellers" className="container mx-auto py-12 px-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">
                    Best Sellers
                </h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[
                        { name: "Atomic Habits", price: "$12.99" },
                        { name: "The Alchemist", price: "$9.99" },
                        { name: "Deep Work", price: "$14.99" },
                        { name: "1984", price: "$8.99" },
                    ].map((book, idx) => (
                        <div
                            key={idx}
                            className="bg-white rounded-2xl shadow-md p-4 flex flex-col"
                        >
                            <div className="h-40 bg-primary/10 rounded-lg mb-4 flex items-center justify-center">
                                <BookOpenIcon className="h-10 w-10 text-primary" />
                            </div>
                            <h3 className="font-semibold text-gray-800 mb-2">
                                {book.name}
                            </h3>
                            <p className="text-primary font-bold mb-4">
                                {book.price}
                            </p>
                            <button className="mt-auto bg-primary text-white px-4 py-2 rounded-full hover:bg-primary-dark transition flex items-center justify-center gap-2">
                                <ShoppingCartIcon className="h-5 w-5" /> Add to
                                Cart
                            </button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="bg-white py-12 px-6">
                <h2 className="text-3xl font-bold text-gray-800 text-center mb-8">
                    Features
                </h2>
                <div className="container mx-auto grid md:grid-cols-3 gap-8">
                    <div className="flex flex-col items-center text-center p-6">
                        <LockClosedIcon className="h-12 w-12 text-primary mb-4" />
                        <h3 className="font-semibold text-gray-800 mb-2">
                            Secure Login
                        </h3>
                        <p className="text-gray-600">
                            Protected by modern encryption and JWT tokens.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6">
                        <BookOpenIcon className="h-12 w-12 text-primary mb-4" />
                        <h3 className="font-semibold text-gray-800 mb-2">
                            Preview Books
                        </h3>
                        <p className="text-gray-600">
                            Sample the first chapters before buying.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6">
                        <ShoppingCartIcon className="h-12 w-12 text-primary mb-4" />
                        <h3 className="font-semibold text-gray-800 mb-2">
                            Easy Checkout
                        </h3>
                        <p className="text-gray-600">
                            Seamless payment flow with Stripe & PayPal.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6">
                        <UserGroupIcon className="h-12 w-12 text-primary mb-4" />
                        <h3 className="font-semibold text-gray-800 mb-2">
                            My Library
                        </h3>
                        <p className="text-gray-600">
                            All your purchases in one personal space.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6">
                        <ArrowDownTrayIcon className="h-12 w-12 text-primary mb-4" />
                        <h3 className="font-semibold text-gray-800 mb-2">
                            Instant Download
                        </h3>
                        <p className="text-gray-600">
                            Get your e-book immediately after purchase.
                        </p>
                    </div>
                    <div className="flex flex-col items-center text-center p-6">
                        <GiftIcon className="h-12 w-12 text-primary mb-4" />
                        <h3 className="font-semibold text-gray-800 mb-2">
                            Exclusive Deals
                        </h3>
                        <p className="text-gray-600">
                            Limited-time promotions and discounts.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
LandingPage.layout = page => <MainLayout>{page}</MainLayout>;