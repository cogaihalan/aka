import React, { FC, useState } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextLink, PrismicNextImage } from "@prismicio/next";

export type ProductCarouselProps = SliceComponentProps<any>;

const ProductCarousel: FC<ProductCarouselProps> = ({ slice }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const products = slice.items || [];
  const itemsPerView = slice.primary.itemsPerView || 3;
  const showNavigation = slice.primary.showNavigation !== false;
  const showDots = slice.primary.showDots !== false;
  const autoPlay = slice.primary.autoPlay === true;
  const autoPlayInterval = slice.primary.autoPlayInterval || 5000;

  const nextSlide = () => {
    setCurrentIndex((prev) => 
      prev + itemsPerView >= products.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => 
      prev === 0 ? Math.max(0, products.length - itemsPerView) : prev - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  React.useEffect(() => {
    if (autoPlay && products.length > itemsPerView) {
      const interval = setInterval(nextSlide, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, products.length, itemsPerView]);

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="es-bounded es-product-carousel"
    >
      <div className="es-bounded__content es-product-carousel__content">
        {/* Header */}
        {(isFilled.richText(slice.primary.title) || isFilled.richText(slice.primary.subtitle)) && (
          <div className="es-product-carousel__header">
            {isFilled.richText(slice.primary.title) && (
              <div className="es-product-carousel__title">
                <PrismicRichText field={slice.primary.title} />
              </div>
            )}
            {isFilled.richText(slice.primary.subtitle) && (
              <div className="es-product-carousel__subtitle">
                <PrismicRichText field={slice.primary.subtitle} />
              </div>
            )}
          </div>
        )}

        {/* Carousel Container */}
        <div className="es-product-carousel__container">
          <div 
            className="es-product-carousel__track"
            style={{
              transform: `translateX(-${(currentIndex * 100) / itemsPerView}%)`,
            }}
          >
            {products.map((product: any, index: number) => (
              <div key={index} className="es-product-carousel__item">
                <div className="es-product-carousel__product">
                  {isFilled.image(product.image) && (
                    <div className="es-product-carousel__product-image">
                      <PrismicNextLink field={product.link}>
                        <PrismicNextImage
                          field={product.image}
                          className="es-product-carousel__image"
                        />
                      </PrismicNextLink>
                    </div>
                  )}
                  
                  <div className="es-product-carousel__product-content">
                    {isFilled.keyText(product.title) && (
                      <h3 className="es-product-carousel__product-title">
                        <PrismicNextLink field={product.link}>
                          {product.title}
                        </PrismicNextLink>
                      </h3>
                    )}
                    
                    {isFilled.richText(product.description) && (
                      <div className="es-product-carousel__product-description">
                        <PrismicRichText field={product.description} />
                      </div>
                    )}
                    
                    <div className="es-product-carousel__product-footer">
                      {isFilled.keyText(product.price) && (
                        <div className="es-product-carousel__product-price">
                          {product.price}
                        </div>
                      )}
                      
                      {isFilled.link(product.link) && (
                        <PrismicNextLink
                          field={product.link}
                          className="es-product-carousel__product-button"
                        >
                          {product.buttonText || "View Product"}
                        </PrismicNextLink>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {showNavigation && products.length > itemsPerView && (
            <>
              <button
                className="es-product-carousel__nav es-product-carousel__nav--prev"
                onClick={prevSlide}
                aria-label="Previous products"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <button
                className="es-product-carousel__nav es-product-carousel__nav--next"
                onClick={nextSlide}
                aria-label="Next products"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Dots Navigation */}
        {showDots && products.length > itemsPerView && (
          <div className="es-product-carousel__dots">
            {Array.from({ length: Math.ceil(products.length / itemsPerView) }).map((_, index) => (
              <button
                key={index}
                className={`es-product-carousel__dot ${
                  Math.floor(currentIndex / itemsPerView) === index ? 'es-product-carousel__dot--active' : ''
                }`}
                onClick={() => goToSlide(index * itemsPerView)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      <style>
        {`
          .es-bounded {
            padding: 8vw 2rem;
          }

          .es-bounded__content {
            margin-left: auto;
            margin-right: auto;
            max-width: 90%;
          }

          @media screen and (min-width: 640px) {
            .es-bounded__content {
              max-width: 85%;
            }
          }

          @media screen and (min-width: 896px) {
            .es-bounded__content {
              max-width: 80%;
            }
          }

          @media screen and (min-width: 1280px) {
            .es-bounded__content {
              max-width: 75%;
            }
          }

          .es-product-carousel {
            font-family: system-ui, sans-serif;
            background-color: #fff;
            color: #333;
          }

          .es-product-carousel__header {
            text-align: center;
            margin-bottom: 3rem;
          }

          .es-product-carousel__title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #1a1a1a;
          }

          .es-product-carousel__title * {
            margin: 0;
          }

          .es-product-carousel__subtitle {
            font-size: 1.125rem;
            color: #666;
            max-width: 600px;
            margin: 0 auto;
          }

          .es-product-carousel__subtitle * {
            margin: 0;
          }

          .es-product-carousel__container {
            position: relative;
            overflow: hidden;
            border-radius: 0.5rem;
          }

          .es-product-carousel__track {
            display: flex;
            transition: transform 0.5s ease-in-out;
            gap: 1.5rem;
          }

          .es-product-carousel__item {
            flex: 0 0 ${100 / itemsPerView}%;
            min-width: 0;
          }

          .es-product-carousel__product {
            background: #fff;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            overflow: hidden;
            transition: transform 0.3s ease, box-shadow 0.3s ease;
            height: 100%;
            display: flex;
            flex-direction: column;
          }

          .es-product-carousel__product:hover {
            transform: translateY(-4px);
            box-shadow: 0 10px 25px -3px rgba(0, 0, 0, 0.1);
          }

          .es-product-carousel__product-image {
            position: relative;
            aspect-ratio: 4/3;
            overflow: hidden;
          }

          .es-product-carousel__image {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s ease;
          }

          .es-product-carousel__product:hover .es-product-carousel__image {
            transform: scale(1.05);
          }

          .es-product-carousel__product-content {
            padding: 1.5rem;
            flex: 1;
            display: flex;
            flex-direction: column;
          }

          .es-product-carousel__product-title {
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
            line-height: 1.4;
          }

          .es-product-carousel__product-title a {
            color: #1a1a1a;
            text-decoration: none;
            transition: color 0.3s ease;
          }

          .es-product-carousel__product-title a:hover {
            color: #16745f;
          }

          .es-product-carousel__product-description {
            font-size: 0.875rem;
            color: #666;
            margin-bottom: 1rem;
            flex: 1;
          }

          .es-product-carousel__product-description * {
            margin: 0;
          }

          .es-product-carousel__product-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: auto;
          }

          .es-product-carousel__product-price {
            font-size: 1.25rem;
            font-weight: 700;
            color: #16745f;
          }

          .es-product-carousel__product-button {
            background-color: #16745f;
            color: #fff;
            padding: 0.5rem 1rem;
            border-radius: 0.375rem;
            text-decoration: none;
            font-size: 0.875rem;
            font-weight: 500;
            transition: background-color 0.3s ease;
          }

          .es-product-carousel__product-button:hover {
            background-color: #0d5e4c;
          }

          .es-product-carousel__nav {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255, 255, 255, 0.9);
            border: none;
            border-radius: 50%;
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            z-index: 10;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          }

          .es-product-carousel__nav:hover {
            background: rgba(255, 255, 255, 1);
            transform: translateY(-50%) scale(1.1);
          }

          .es-product-carousel__nav--prev {
            left: -24px;
          }

          .es-product-carousel__nav--next {
            right: -24px;
          }

          .es-product-carousel__dots {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 2rem;
          }

          .es-product-carousel__dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: none;
            background-color: #d1d5db;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .es-product-carousel__dot--active {
            background-color: #16745f;
          }

          .es-product-carousel__dot:hover {
            background-color: #9ca3af;
          }

          .es-product-carousel__dot--active:hover {
            background-color: #0d5e4c;
          }

          @media (max-width: 768px) {
            .es-product-carousel__item {
              flex: 0 0 100%;
            }
            
            .es-product-carousel__nav {
              display: none;
            }
          }

          @media (min-width: 769px) and (max-width: 1024px) {
            .es-product-carousel__item {
              flex: 0 0 50%;
            }
          }
        `}
      </style>
    </section>
  );
};

export default ProductCarousel;
