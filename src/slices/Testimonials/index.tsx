import React, { FC, useState } from "react";
import { Content, isFilled } from "@prismicio/client";
import { SliceComponentProps, PrismicRichText } from "@prismicio/react";
import { PrismicNextImage } from "@prismicio/next";

export type TestimonialsProps = SliceComponentProps<any>;

const Testimonials: FC<TestimonialsProps> = ({ slice }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const testimonials = slice.items || [];
  const layout = slice.primary.layout || "carousel";
  const showNavigation = slice.primary.showNavigation !== false;
  const showDots = slice.primary.showDots !== false;
  const autoPlay = slice.primary.autoPlay === true;
  const autoPlayInterval = slice.primary.autoPlayInterval || 5000;
  const showRatings = slice.primary.showRatings !== false;

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Auto-play functionality
  React.useEffect(() => {
    if (autoPlay && testimonials.length > 1) {
      const interval = setInterval(nextSlide, autoPlayInterval);
      return () => clearInterval(interval);
    }
  }, [autoPlay, autoPlayInterval, testimonials.length]);

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg key={i} width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="es-testimonials__star es-testimonials__star--filled">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg key="half" width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="es-testimonials__star es-testimonials__star--half">
          <defs>
            <linearGradient id="half-star">
              <stop offset="50%" stopColor="currentColor"/>
              <stop offset="50%" stopColor="transparent"/>
            </linearGradient>
          </defs>
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="url(#half-star)"/>
        </svg>
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg key={`empty-${i}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="es-testimonials__star es-testimonials__star--empty">
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
        </svg>
      );
    }

    return stars;
  };

  if (testimonials.length === 0) return null;

  return (
    <section
      data-slice-type={slice.slice_type}
      data-slice-variation={slice.variation}
      className="es-bounded es-testimonials"
    >
      <div className="es-bounded__content es-testimonials__content">
        {/* Header */}
        {(isFilled.richText(slice.primary.title) || isFilled.richText(slice.primary.subtitle)) && (
          <div className="es-testimonials__header">
            {isFilled.richText(slice.primary.title) && (
              <div className="es-testimonials__title">
                <PrismicRichText field={slice.primary.title} />
              </div>
            )}
            {isFilled.richText(slice.primary.subtitle) && (
              <div className="es-testimonials__subtitle">
                <PrismicRichText field={slice.primary.subtitle} />
              </div>
            )}
          </div>
        )}

        {/* Testimonials Container */}
        <div className={`es-testimonials__container es-testimonials__container--${layout}`}>
          {layout === "carousel" ? (
            <>
              {/* Carousel Layout */}
              <div className="es-testimonials__carousel">
                <div 
                  className="es-testimonials__track"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                  }}
                >
                  {testimonials.map((testimonial: any, index: number) => (
                    <div key={index} className="es-testimonials__slide">
                      <div className="es-testimonials__testimonial">
                        {/* Quote */}
                        {isFilled.richText(testimonial.quote) && (
                          <div className="es-testimonials__quote">
                            <PrismicRichText field={testimonial.quote} />
                          </div>
                        )}

                        {/* Rating */}
                        {showRatings && testimonial.rating && (
                          <div className="es-testimonials__rating">
                            {renderStars(testimonial.rating)}
                          </div>
                        )}

                        {/* Author */}
                        <div className="es-testimonials__author">
                          {isFilled.image(testimonial.avatar) && (
                            <div className="es-testimonials__avatar">
                              <PrismicNextImage
                                field={testimonial.avatar}
                                className="es-testimonials__avatar-image"
                              />
                            </div>
                          )}
                          
                          <div className="es-testimonials__author-info">
                            {isFilled.keyText(testimonial.name) && (
                              <div className="es-testimonials__name">
                                {testimonial.name}
                              </div>
                            )}
                            
                            {isFilled.keyText(testimonial.title) && (
                              <div className="es-testimonials__title">
                                {testimonial.title}
                              </div>
                            )}
                            
                            {isFilled.keyText(testimonial.company) && (
                              <div className="es-testimonials__company">
                                {testimonial.company}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                {showNavigation && testimonials.length > 1 && (
                  <>
                    <button
                      className="es-testimonials__nav es-testimonials__nav--prev"
                      onClick={prevSlide}
                      aria-label="Previous testimonial"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                    <button
                      className="es-testimonials__nav es-testimonials__nav--next"
                      onClick={nextSlide}
                      aria-label="Next testimonial"
                    >
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </button>
                  </>
                )}
              </div>

              {/* Dots Navigation */}
              {showDots && testimonials.length > 1 && (
                <div className="es-testimonials__dots">
                  {testimonials.map((_: any, index: number) => (
                    <button
                      key={index}
                      className={`es-testimonials__dot ${
                        index === currentIndex ? 'es-testimonials__dot--active' : ''
                      }`}
                      onClick={() => goToSlide(index)}
                      aria-label={`Go to testimonial ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            /* Grid Layout */
            <div className="es-testimonials__grid">
              {testimonials.map((testimonial: any, index: number) => (
                <div key={index} className="es-testimonials__testimonial">
                  {/* Quote */}
                  {isFilled.richText(testimonial.quote) && (
                    <div className="es-testimonials__quote">
                      <PrismicRichText field={testimonial.quote} />
                    </div>
                  )}

                  {/* Rating */}
                  {showRatings && testimonial.rating && (
                    <div className="es-testimonials__rating">
                      {renderStars(testimonial.rating)}
                    </div>
                  )}

                  {/* Author */}
                  <div className="es-testimonials__author">
                    {isFilled.image(testimonial.avatar) && (
                      <div className="es-testimonials__avatar">
                        <PrismicNextImage
                          field={testimonial.avatar}
                          className="es-testimonials__avatar-image"
                        />
                      </div>
                    )}
                    
                    <div className="es-testimonials__author-info">
                      {isFilled.keyText(testimonial.name) && (
                        <div className="es-testimonials__name">
                          {testimonial.name}
                        </div>
                      )}
                      
                      {isFilled.keyText(testimonial.title) && (
                        <div className="es-testimonials__title">
                          {testimonial.title}
                        </div>
                      )}
                      
                      {isFilled.keyText(testimonial.company) && (
                        <div className="es-testimonials__company">
                          {testimonial.company}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
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

          .es-testimonials {
            font-family: system-ui, sans-serif;
            background-color: #f8f9fa;
            color: #333;
          }

          .es-testimonials__header {
            text-align: center;
            margin-bottom: 3rem;
          }

          .es-testimonials__title {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            color: #1a1a1a;
          }

          .es-testimonials__title * {
            margin: 0;
          }

          .es-testimonials__subtitle {
            font-size: 1.125rem;
            color: #666;
            max-width: 600px;
            margin: 0 auto;
          }

          .es-testimonials__subtitle * {
            margin: 0;
          }

          .es-testimonials__container {
            position: relative;
          }

          .es-testimonials__carousel {
            position: relative;
            overflow: hidden;
            border-radius: 0.75rem;
          }

          .es-testimonials__track {
            display: flex;
            transition: transform 0.5s ease-in-out;
          }

          .es-testimonials__slide {
            flex: 0 0 100%;
            min-width: 0;
          }

          .es-testimonials__testimonial {
            background: #fff;
            padding: 3rem 2rem;
            border-radius: 0.75rem;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            text-align: center;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          .es-testimonials__quote {
            font-size: 1.25rem;
            line-height: 1.6;
            color: #4b5563;
            margin-bottom: 2rem;
            font-style: italic;
            position: relative;
          }

          .es-testimonials__quote::before {
            content: '"';
            font-size: 4rem;
            color: #16745f;
            position: absolute;
            top: -1rem;
            left: -0.5rem;
            font-family: serif;
          }

          .es-testimonials__quote * {
            margin: 0;
          }

          .es-testimonials__rating {
            display: flex;
            justify-content: center;
            gap: 0.25rem;
            margin-bottom: 2rem;
          }

          .es-testimonials__star {
            color: #fbbf24;
          }

          .es-testimonials__star--empty {
            color: #d1d5db;
          }

          .es-testimonials__author {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 1rem;
          }

          .es-testimonials__avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            overflow: hidden;
            flex-shrink: 0;
          }

          .es-testimonials__avatar-image {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }

          .es-testimonials__author-info {
            text-align: left;
          }

          .es-testimonials__name {
            font-size: 1.125rem;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 0.25rem;
          }

          .es-testimonials__title {
            font-size: 0.875rem;
            color: #16745f;
            font-weight: 500;
            margin-bottom: 0.25rem;
          }

          .es-testimonials__company {
            font-size: 0.875rem;
            color: #6b7280;
          }

          .es-testimonials__nav {
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

          .es-testimonials__nav:hover {
            background: rgba(255, 255, 255, 1);
            transform: translateY(-50%) scale(1.1);
          }

          .es-testimonials__nav--prev {
            left: -24px;
          }

          .es-testimonials__nav--next {
            right: -24px;
          }

          .es-testimonials__dots {
            display: flex;
            justify-content: center;
            gap: 0.5rem;
            margin-top: 2rem;
          }

          .es-testimonials__dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: none;
            background-color: #d1d5db;
            cursor: pointer;
            transition: background-color 0.3s ease;
          }

          .es-testimonials__dot--active {
            background-color: #16745f;
          }

          .es-testimonials__dot:hover {
            background-color: #9ca3af;
          }

          .es-testimonials__dot--active:hover {
            background-color: #0d5e4c;
          }

          .es-testimonials__grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
          }

          @media (max-width: 768px) {
            .es-testimonials__nav {
              display: none;
            }
            
            .es-testimonials__author {
              flex-direction: column;
              text-align: center;
            }
            
            .es-testimonials__author-info {
              text-align: center;
            }
          }
        `}
      </style>
    </section>
  );
};

export default Testimonials;
