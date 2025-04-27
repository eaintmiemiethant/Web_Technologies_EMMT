import React, { useState } from "react";
import { BookOpenIcon, ShoppingCartIcon, UserGroupIcon, GiftIcon, ArrowDownTrayIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [sliderRef, instanceRef] = useKeenSlider({
    loop: true,
    slideChanged(slider) {
      setCurrentSlide(slider.track.details.rel);
    },
    slides: { perView: 1 },
  });

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-100 to-purple-200">
      {/* Navbar */}
      <header className="flex justify-between items-center p-6">
        <h1 className="text-3xl font-bold text-indigo-800">BookNest 📚</h1>
        <nav className="space-x-6">
          <a href="#features" className="text-indigo-600 hover:text-indigo-800">Features</a>
          <a href="#explore" className="text-indigo-600 hover:text-indigo-800">Explore</a>
          <a href="#contact" className="text-indigo-600 hover:text-indigo-800">Contact</a>
        </nav>
      </header>

      {/* Hero Section with Best Seller + News Slider */}
      <div className="relative w-full">
        <div ref={sliderRef} className="keen-slider h-[70vh] w-full">
          {/* Slide 1 - Best Seller */}
          <div className="keen-slider__slide flex flex-col justify-center items-center text-center bg-white max-w-4xl mx-auto px-8 py-10 rounded-2xl shadow-xl p-8">
            <h2 className="text-5xl font-bold text-indigo-800 mb-4">🔥 Best Seller: Atomic Habits</h2>
            <p className="text-lg text-gray-700 max-w-xl">
              Transform your life with small habits! The #1 Bestseller by James Clear.
            </p>
          </div>

          {/* Slide 2 - News */}
          <div className="keen-slider__slide flex flex-col justify-center items-center text-center bg-white max-w-4xl mx-auto px-8 py-10 rounded-2xl shadow-xl p-8">
            <h2 className="text-5xl font-bold text-indigo-800 mb-4">📰 Latest News: Book Fair 2025!</h2>
            <p className="text-lg text-gray-700 max-w-xl">
              Discover exclusive book releases and meet your favorite authors live!
            </p>
          </div>

          {/* Slide 3 - Another Best Seller */}
          <div className="keen-slider__slide flex flex-col justify-center items-center text-center bg-white max-w-4xl mx-auto px-8 py-10 rounded-2xl shadow-xl p-8">
            <h2 className="text-5xl font-bold text-indigo-800 mb-4">🌟 Bestseller: The Alchemist</h2>
            <p className="text-lg text-gray-700 max-w-xl">
              Follow your dreams and explore destiny with Paulo Coelho’s timeless classic.
            </p>
          </div>
        </div>

        {/* Arrows */}
        <button onClick={() => instanceRef.current?.prev()} className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-indigo-100">‹</button>
        <button onClick={() => instanceRef.current?.next()} className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow hover:bg-indigo-100">›</button>

        {/* Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {[...Array(instanceRef.current?.track.details.slides.length || 0)].map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`w-3 h-3 rounded-full ${currentSlide === idx ? 'bg-indigo-600' : 'bg-gray-300'}`}
            ></button>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="p-10 grid md:grid-cols-3 gap-8 text-center">
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
          <LockClosedIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Secure Authentication</h3>
          <p className="text-gray-600">Register and log in securely using modern authentication systems.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
          <BookOpenIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Preview Before Purchase</h3>
          <p className="text-gray-600">Get a sneak peek of e-books before buying them.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
          <ShoppingCartIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Seamless Checkout</h3>
          <p className="text-gray-600">Smooth cart and payment integration styled with Tailwind CSS.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
          <UserGroupIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Personal Library</h3>
          <p className="text-gray-600">Keep track of all your purchases and downloads in one place.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
          <ArrowDownTrayIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Instant Downloads</h3>
          <p className="text-gray-600">Access your e-books immediately after payment confirmation.</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition">
          <GiftIcon className="h-12 w-12 text-indigo-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold mb-2">Exclusive Promotions</h3>
          <p className="text-gray-600">Take advantage of promo codes and exclusive e-book sales.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center p-6 bg-indigo-100">
        <p className="text-gray-600">&copy; {new Date().getFullYear()} BookNest. All rights reserved.</p>
      </footer>
    </div>
  );
}