"use client"

import { useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Play } from "lucide-react"
import Glider from "react-glider"
import { cn } from "@/lib/utils"

interface BannerSlide {
  id: number
  title: string
  subtitle: string
  description: string
  image: string
  ctaText: string
  ctaLink: string
  ctaSecondaryText?: string
  ctaSecondaryLink?: string
}

const slides: BannerSlide[] = [
  {
    id: 1,
    title: "Transform Your Business",
    subtitle: "with AI-Powered Solutions",
    description:
      "Discover cutting-edge technology that revolutionizes how you work, collaborate, and grow your business in the digital age.",
    image: "https://fastly.picsum.photos/id/318/1920/900.jpg?hmac=3OFMpUC8lfG33ZZhcc5GOhoI0gDGcfsksCOWHa9wKnI",
    ctaText: "Get Started Free",
    ctaLink: "#",
    ctaSecondaryText: "Watch Demo",
    ctaSecondaryLink: "#",
  },
  {
    id: 2,
    title: "Boost Productivity",
    subtitle: "by 300% or More",
    description:
      "Join thousands of teams who have streamlined their workflow and achieved unprecedented levels of efficiency with our platform.",
    image: "https://fastly.picsum.photos/id/170/1920/900.jpg?hmac=DObCw8j1euR35R9gh9-4X2kRIJUSocGgSaxezhzKJFQ",
    ctaText: "View Demo",
    ctaLink: "#",
    ctaSecondaryText: "Learn More",
    ctaSecondaryLink: "#",
  },
  {
    id: 3,
    title: "Scale Without Limits",
    subtitle: "Enterprise-Ready Platform",
    description:
      "Built for growth with enterprise-grade security, unlimited scalability, and seamless integrations with your existing tools.",
    image: "/assets/placeholder-banner.png",
    ctaText: "Contact Sales",
    ctaLink: "#",
    ctaSecondaryText: "Schedule Demo",
    ctaSecondaryLink: "#",
  },
]

interface FullWidthBannerProps {
  slides?: BannerSlide[]
  className?: string
}

export default function FullWidthBanner({ 
  slides: customSlides, 
  className 
}: FullWidthBannerProps = {}) {
  const gliderRef = useRef<any>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const bannerSlides = customSlides || slides

  const goToSlide = useCallback((index: number) => {
    if (gliderRef.current && !isAnimating) {
      setIsAnimating(true)
      setTimeout(() => {
        gliderRef.current.scrollItem(index)
        setCurrentSlide(index)
        setIsAnimating(false)
      }, 100)
    }
  }, [isAnimating])

  const nextSlide = useCallback(() => {
    const next = (currentSlide + 1) % bannerSlides.length
    goToSlide(next)
  }, [currentSlide, bannerSlides.length, goToSlide])

  const prevSlide = useCallback(() => {
    const prev = (currentSlide - 1 + bannerSlides.length) % bannerSlides.length
    goToSlide(prev)
  }, [currentSlide, bannerSlides.length, goToSlide])


  return (
    <section 
      className={cn(
        "relative w-full h-[500px] sm:h-[600px] md:h-[700px] overflow-hidden",
        className
      )}
    >
      <div className="absolute inset-0">
        <Glider
          ref={gliderRef}
          hasArrows={false}
          hasDots={false}
          slidesToShow={1}
          slidesToScroll={1}
          duration={1.2}
          className="h-full"
          onSlideVisible={(event: any) => {
            setCurrentSlide(event.detail.slide)
          }}
        >
          {bannerSlides.map((slide, slideIndex) => (
            <div key={slide.id} className="h-full">
              <div className="relative h-full flex items-center">
                <div
                  className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat transition-all duration-1000"
                  style={{
                    backgroundImage: `url(${slide.image || "/assets/placeholder-banner.png"})`,
                    transform: slideIndex === currentSlide ? "scale(1.05)" : "scale(1.0)",
                  }}
                />

                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/5 z-10" />

                {/* Gradient overlay for better text contrast */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-black/50 z-20" />

                {/* Content */}
                <div className="relative z-30 container mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 gap-8 items-center max-w-7xl mx-auto">
                    {/* Text Content */}
                    <div
                      className={cn(
                        "space-y-6 text-center lg:text-left transition-all duration-700",
                        slideIndex === currentSlide && !isAnimating
                          ? "opacity-100 translate-y-0"
                          : "opacity-0 translate-y-8"
                      )}
                    >
                      <div className="space-y-4">
                        <h1
                          className={cn(
                            "text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight text-balance transition-all duration-700 delay-200",
                            slideIndex === currentSlide && !isAnimating
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-12"
                          )}
                        >
                          {slide.title}
                          <span
                            className={cn(
                              "block text-primary transition-all duration-700 delay-300",
                              slideIndex === currentSlide && !isAnimating
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 translate-x-8"
                            )}
                          >
                            {slide.subtitle}
                          </span>
                        </h1>

                        <p
                          className={cn(
                            "text-base sm:text-lg md:text-xl text-white max-w-2xl text-pretty transition-all duration-700 delay-400",
                            slideIndex === currentSlide && !isAnimating
                              ? "opacity-100 translate-y-0"
                              : "opacity-0 translate-y-6"
                          )}
                        >
                          {slide.description}
                        </p>
                      </div>

                      {/* CTA Buttons */}
                      <div
                        className={cn(
                          "flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-fit mx-auto sm:w-full transition-all duration-700 delay-700",
                          slideIndex === currentSlide && !isAnimating
                            ? "opacity-100 translate-y-0"
                            : "opacity-0 translate-y-8"
                        )}
                      >
                        <Button
                          size="lg"
                          className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 hover:scale-105 transition-transform duration-200 shadow-lg"
                          asChild
                        >
                          <a href={slide.ctaLink}>
                            {slide.ctaText}
                          </a>
                        </Button>
                        {slide.ctaSecondaryText && (
                          <Button
                            variant="outline"
                            size="lg"
                            className="text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-6 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:text-white hover:bg-white/20 hover:scale-105 transition-transform duration-200"
                            asChild
                          >
                            <a href={slide.ctaSecondaryLink || "#"}>
                              <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                              {slide.ctaSecondaryText}
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Glider>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        disabled={isAnimating}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 shadow-lg transition-all duration-200 hover:scale-110 hover-translate-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>

      <button
        onClick={nextSlide}
        disabled={isAnimating}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 shadow-lg transition-all duration-200 hover:scale-110 hover:translate-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 flex gap-2">
        {bannerSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            disabled={isAnimating}
            className={cn(
              "w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 hover:scale-125 disabled:opacity-50 disabled:cursor-not-allowed",
              index === currentSlide
                ? "bg-primary scale-125 shadow-lg shadow-primary/50"
                : "bg-white/40 hover:bg-white/60"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-40">
        <div
          className="h-full bg-gradient-to-r from-primary to-chart-2 transition-all duration-500 ease-out shadow-sm"
          style={{ width: `${((currentSlide + 1) / bannerSlides.length) * 100}%` }}
        />
      </div>
    </section>
  )
}
