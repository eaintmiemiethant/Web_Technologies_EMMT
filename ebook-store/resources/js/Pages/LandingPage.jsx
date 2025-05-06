// resources/js/Pages/LandingPage.jsx

import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  BookOpenIcon,
  ShoppingCartIcon,
  UserGroupIcon,
  GiftIcon,
  ArrowDownTrayIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

export default function LandingPage() {
  const { slides, bestSellers, features } = usePage().props;
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
          {slides.map((slide, idx) => (
            <div
              key={idx}
              className="keen-slider__slide relative bg-cover bg-center"
              style={{ backgroundImage: `url(${slide.image})` }}
            >
              {/* glassmorphism overlay */}
              <div className="absolute inset-0 bg-white bg-opacity-50 backdrop-blur-sd"></div>

              {/* slide content */}
              <div className="relative z-10 flex h-full items-center justify-center px-6">
                <div className="bg-white bg-opacity-70 p-6 rounded-lg text-center">
                  <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-2">
                    {slide.title}
                  </h2>
                  <p className="text-lg text-primary/80 mb-6">
                    {slide.subtitle}
                  </p>
                  <Link
                    href={route("browse")}
                    className="bg-primary text-white px-6 py-3 rounded-full hover:bg-primary-dark transition"
                  >
                    {slide.cta}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Left Arrow */}
        <button
          onClick={() => instanceRef.current?.prev()}
          className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow hover:bg-primary/20"
        >
          <ChevronLeftIcon className="h-6 w-6 text-primary" />
        </button>

        {/* Right Arrow */}
        <button
          onClick={() => instanceRef.current?.next()}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white p-2 shadow hover:bg-primary/20"
        >
          <ChevronRightIcon className="h-6 w-6 text-primary" />
        </button>

        {/* Pagination Dots */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => instanceRef.current?.moveToIdx(idx)}
              className={`h-3 w-3 rounded-full ${
                currentSlide === idx ? "bg-primary" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Best Sellers */}
      <section id="best-sellers" className="container mx-auto py-12 px-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Best Sellers</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((book) => (
            <div
              key={book.id}
              className="flex flex-col rounded-2xl bg-white p-4 shadow-md"
            >
              <img
                src={book.cover_image}
                alt={book.title}
                className="mb-4 h-40 w-full object-cover rounded-lg"
              />
              <h3 className="mb-2 font-semibold text-gray-800">{book.title}</h3>
              <p className="mb-4 text-primary font-bold">
                ${Number(book.price).toFixed(2)}
              </p>
              <Link
                href={route("ebooks.show", book.id)}
                className="mt-auto flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2 text-white hover:bg-primary-dark transition"
              >
                <BookOpenIcon className="h-5 w-5" /> Preview Now
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="bg-white py-12 px-6">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-800">
          Features
        </h2>
        <div className="container mx-auto grid grid-cols-1 gap-8 md:grid-cols-3 lg:grid-cols-6">
          {features.map((f) => {
            const Icon = {
              LockClosedIcon,
              BookOpenIcon,
              ShoppingCartIcon,
              UserGroupIcon,
              ArrowDownTrayIcon,
              GiftIcon,
            }[f.icon];
            return (
              <div
                key={f.title}
                className="flex flex-col items-center rounded-xl bg-gradient-to-br from-white via-primary/10 to-white p-6 backdrop-blur-md shadow"
              >
                <Icon className="mb-4 h-12 w-12 text-primary" />
                <h3 className="mb-2 font-semibold text-gray-800">{f.title}</h3>
                <p className="text-center text-gray-600">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

LandingPage.layout = (page) => <MainLayout>{page}</MainLayout>;
