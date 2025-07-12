import React from 'react';
import { useSettings } from '@/contexts/SettingsContext';
import { getMarqueeIcon } from '@/utils/marqueeIcons';

export const Marquee: React.FC = () => {
  const { settings } = useSettings();
  const marqueeConfig = settings.marquee;

  // Return null if marquee is disabled
  if (!marqueeConfig.enabled) {
    return null;
  }

  // Filter active features
  const activeFeatures = marqueeConfig.features.filter(feature => feature.active);

  // Return null if no active features
  if (activeFeatures.length === 0) {
    return null;
  }

  // Duplicate items for infinite loop effect
  const duplicatedFeatures = [...activeFeatures, ...activeFeatures];

  // Helper functions for styling
  const getFontSize = (size: string) => {
    const sizeMap = {
      'sm': 'text-sm',
      'base': 'text-base', 
      'lg': 'text-lg',
      'xl': 'text-xl'
    };
    return sizeMap[size as keyof typeof sizeMap] || 'text-lg';
  };

  const getFontWeight = (weight: string) => {
    const weightMap = {
      'normal': 'font-normal',
      'medium': 'font-medium',
      'semibold': 'font-semibold',
      'bold': 'font-bold'
    };
    return weightMap[weight as keyof typeof weightMap] || 'font-semibold';
  };

  // Dynamic styles
  const sectionStyle = {
    background: `linear-gradient(to right, ${marqueeConfig.styling.gradientColors.from}, ${marqueeConfig.styling.gradientColors.via}, ${marqueeConfig.styling.gradientColors.to})`,
    paddingTop: `${marqueeConfig.styling.padding.vertical}px`,
    paddingBottom: `${marqueeConfig.styling.padding.vertical}px`,
  };

  const animationStyle = {
    animation: `marquee ${marqueeConfig.animation.speed}s linear infinite ${marqueeConfig.animation.direction === 'right' ? 'reverse' : ''}`,
    animationPlayState: 'running',
  };

  const itemStyle = {
    color: marqueeConfig.styling.textColor,
    paddingLeft: `${marqueeConfig.styling.padding.horizontal}px`,
    paddingRight: `${marqueeConfig.styling.padding.horizontal}px`,
    paddingTop: '8px',
    paddingBottom: '8px',
    gap: `${marqueeConfig.styling.itemSpacing}px`,
  };

  return (
    <section 
      className="relative overflow-hidden"
      style={sectionStyle}
      onMouseEnter={(e) => {
        if (marqueeConfig.animation.pauseOnHover) {
          const element = e.currentTarget.querySelector('.marquee-animation') as HTMLElement;
          if (element) element.style.animationPlayState = 'paused';
        }
      }}
      onMouseLeave={(e) => {
        if (marqueeConfig.animation.pauseOnHover) {
          const element = e.currentTarget.querySelector('.marquee-animation') as HTMLElement;
          if (element) element.style.animationPlayState = 'running';
        }
      }}
    >
      <div 
        className={`flex marquee-animation ${getFontSize(marqueeConfig.styling.fontSize)} ${getFontWeight(marqueeConfig.styling.fontWeight)}`}
        style={animationStyle}
      >
        {duplicatedFeatures.map((feature, index) => {
          const IconComponent = getMarqueeIcon(feature.icon);
          return (
            <div 
              key={`${feature.id}-${index}`} 
              className="flex items-center whitespace-nowrap"
              style={itemStyle}
            >
              <IconComponent 
                className="flex-shrink-0" 
                size={marqueeConfig.styling.iconSize}
              />
              <span>{feature.text}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
};