
import React, { useCallback, useEffect, useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
// Import embla carousel correctly
import useEmblaCarousel from "embla-carousel-react";
import { useSettings } from '@/contexts/SettingsContext';
import { Link } from 'react-router-dom';

export const HeroSlider: React.FC = () => {
  const { settings } = useSettings();
  const sliderConfig = settings.slider;
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [currentIndex, setCurrentIndex] = useState(0);

  // Filter active banners
  const activeBanners = sliderConfig.banners.filter(banner => banner.active);

  // Auto-slide functionality
  useEffect(() => {
    if (!emblaApi || !sliderConfig.autoplay) return;

    const interval = setInterval(() => {
      if (emblaApi.canScrollNext()) {
        emblaApi.scrollNext();
      } else {
        emblaApi.scrollTo(0);
      }
    }, sliderConfig.duration);

    // Update current index on scroll
    const onSelect = () => {
      setCurrentIndex(emblaApi.selectedScrollSnap());
    };
    
    emblaApi.on('select', onSelect);

    return () => {
      clearInterval(interval);
      emblaApi?.off('select', onSelect);
    };
  }, [emblaApi, sliderConfig.autoplay, sliderConfig.duration]);

  const scrollTo = useCallback((index: number) => {
    emblaApi?.scrollTo(index);
  }, [emblaApi]);

  // Helper functions for styling
  const getArrowSize = (size: string) => {
    const sizeMap = { sm: '20', md: '24', lg: '28' };
    return sizeMap[size as keyof typeof sizeMap] || '24';
  };

  const getTextAlignment = (position: string) => {
    const alignMap = {
      left: 'text-left justify-start items-start',
      center: 'text-center justify-center items-center',
      right: 'text-right justify-end items-end'
    };
    return alignMap[position as keyof typeof alignMap] || 'text-left justify-start items-start';
  };

  if (activeBanners.length === 0) {
    return null;
  }

  return (
    <section 
      className="relative w-full overflow-hidden"
      style={{ 
        height: sliderConfig.height ? `${sliderConfig.height}px` : '500px'
      }}
    >
      <div className="h-full" ref={emblaRef}>
        <div className="flex h-full">
          {activeBanners.map((banner, index) => (
            <div 
              key={banner.id}
              className="relative flex-shrink-0 flex-grow-0 min-w-0 w-full h-full"
            >
              {/* Banner Image */}
              <img 
                src={banner.image} 
                alt={banner.title}
                className={`w-full h-full object-cover transition-all duration-700 ${
                  sliderConfig.effects.kenBurns ? 'hover:scale-110' : ''
                }`}
              />
              
              {/* Overlay */}
              {banner.overlay?.enabled && (
                <div 
                  className="absolute inset-0"
                  style={{
                    backgroundColor: banner.overlay.color,
                    opacity: banner.overlay.opacity / 100
                  }}
                />
              )}
              
              {/* Content */}
              <div 
                className={`absolute inset-0 flex flex-col p-8 md:p-16 z-10 ${getTextAlignment(banner.textPosition || 'left')}`}
              >
                <div className={`max-w-2xl ${sliderConfig.effects.fadeInText ? 'animate-fadeInUp' : ''}`}>
                  {banner.title && (
                    <h1 
                      className="text-4xl md:text-6xl font-bold mb-4 leading-tight"
                      style={{ color: banner.textColor || '#ffffff' }}
                    >
                      {banner.title}
                    </h1>
                  )}
                  {banner.subtitle && (
                    <p 
                      className="text-lg md:text-xl mb-8 leading-relaxed"
                      style={{ color: banner.textColor || '#ffffff' }}
                    >
                      {banner.subtitle}
                    </p>
                  )}
                  {banner.actionText && banner.actionLink && (
                    <Link
                      to={banner.actionLink}
                      className="inline-block bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                      style={{ backgroundColor: banner.backgroundColor || undefined }}
                    >
                      {banner.actionText}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Navigation arrows */}
      {sliderConfig.showArrows && (
        <>
          <button 
            className="absolute top-1/2 left-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-3 rounded-full transition-all duration-300 z-20 backdrop-blur-sm"
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Previous slide"
            style={{ color: sliderConfig.navigation.arrowColor }}
          >
            <svg 
              width={getArrowSize(sliderConfig.navigation.arrowSize)} 
              height={getArrowSize(sliderConfig.navigation.arrowSize)} 
              viewBox="0 0 26 25" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M16.16 3.125C15.96 3.125 15.7642 3.16667 15.5725 3.25C15.3808 3.33333 15.2267 3.43333 15.11 3.55L7.71 11.05C7.44333 11.3167 7.31 11.6958 7.31 12.1875C7.31 12.6792 7.44333 13.0583 7.71 13.325L15.11 21.35C15.2933 21.5333 15.4642 21.6667 15.6225 21.75C15.7808 21.8333 15.96 21.875 16.16 21.875C16.6433 21.875 17.0267 21.7333 17.31 21.45C17.46 21.3 17.585 21.1208 17.685 20.9125C17.785 20.7042 17.835 20.5 17.835 20.3C17.835 19.8167 17.66 19.4417 17.31 19.175L10.96 12.175L17.31 5.625C17.5767 5.35833 17.71 5.04167 17.71 4.675C17.71 4.19167 17.5767 3.81667 17.31 3.55C17.0933 3.38333 16.9017 3.27083 16.735 3.2125C16.5683 3.15417 16.3767 3.125 16.16 3.125Z" fill="currentColor" fillOpacity="0.9" />
            </svg>
          </button>
          <button 
            className="absolute top-1/2 right-4 -translate-y-1/2 bg-black/30 hover:bg-black/50 p-3 rounded-full transition-all duration-300 z-20 backdrop-blur-sm"
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Next slide"
            style={{ color: sliderConfig.navigation.arrowColor }}
          >
            <svg 
              width={getArrowSize(sliderConfig.navigation.arrowSize)} 
              height={getArrowSize(sliderConfig.navigation.arrowSize)} 
              viewBox="0 0 26 25" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M18.3899 13.325C18.6733 13.0417 18.8149 12.6583 18.8149 12.175C18.8149 11.9583 18.7816 11.7583 18.7149 11.575C18.6483 11.3917 18.5399 11.25 18.3899 11.15L10.9899 3.65C10.8233 3.48333 10.6524 3.35417 10.4774 3.2625C10.3024 3.17083 10.0899 3.125 9.83994 3.125C9.42327 3.125 9.08161 3.26667 8.81494 3.55C8.64827 3.7 8.51911 3.875 8.42744 4.075C8.33577 4.275 8.28994 4.475 8.28994 4.675C8.28994 5.175 8.42327 5.55833 8.68994 5.825L15.0649 12.3L8.58994 19.275C8.32327 19.5417 8.18994 19.925 8.18994 20.425C8.18994 20.825 8.35661 21.2083 8.68994 21.575C9.02327 21.775 9.40661 21.875 9.83994 21.875C10.0566 21.875 10.2649 21.8292 10.4649 21.7375C10.6649 21.6458 10.8399 21.5167 10.9899 21.35L18.3899 13.325Z" fill="currentColor" fillOpacity="0.9" />
            </svg>
          </button>
        </>
      )}
      
      {/* Indicator dots */}
      {sliderConfig.showDots && (
        <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-3 z-20">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                sliderConfig.navigation.dotStyle === 'modern' 
                  ? 'rounded-lg' 
                  : sliderConfig.navigation.dotStyle === 'minimal' 
                    ? 'rounded-none' 
                    : 'rounded-full'
              }`}
              style={{
                backgroundColor: currentIndex === index 
                  ? sliderConfig.navigation.dotActiveColor 
                  : sliderConfig.navigation.dotColor,
                opacity: currentIndex === index ? 1 : 0.6
              }}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </section>
  );
};
