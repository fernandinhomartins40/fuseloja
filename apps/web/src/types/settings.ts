
export interface GeneralSettings {
  storeName: string;
  slogan: string;
  email: string;
  phone: string;
  whatsApp: string;
  address: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  businessHours: string;
  taxId: string;
}

export interface MarqueeSettings {
  enabled: boolean;
  features: Array<{
    id: string;
    icon: string;
    text: string;
    active: boolean;
  }>;
  animation: {
    speed: number; // seconds for one complete cycle
    direction: 'left' | 'right';
    pauseOnHover: boolean;
  };
  styling: {
    gradientColors: {
      from: string;
      via: string;
      to: string;
    };
    textColor: string;
    fontSize: 'sm' | 'base' | 'lg' | 'xl';
    fontWeight: 'normal' | 'medium' | 'semibold' | 'bold';
    iconSize: number;
    padding: {
      vertical: number;
      horizontal: number;
    };
    itemSpacing: number;
  };
}

export interface NavbarSettings {
  logo: string;
  logoWidth?: number;
  logoHeight?: number;
  showSearch: boolean;
  showCategories: boolean;
  backgroundColor: string;
  borderColor?: string;
  borderWidth?: number;
  textColor: string;
  sticky: boolean;
  height?: number;
  menu: {
    color: string;
    hoverColor: string;
    activeColor: string;
    fontWeight: 'normal' | 'medium' | 'semibold' | 'bold';
    fontSize: 'xs' | 'sm' | 'base' | 'lg' | 'xl';
    textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  };
  icons: {
    color: string;
    hoverColor: string;
    size: number;
    hoverAnimation: 'none' | 'scale' | 'rotate' | 'bounce' | 'pulse';
    hoverAnimationDuration: number;
    hoverAnimationIntensity: number;
  };
}

export interface SliderSettings {
  banners: Array<{
    id: string;
    image: string;
    title: string;
    subtitle: string;
    actionText: string;
    actionLink: string;
    active: boolean;
    textPosition?: 'left' | 'center' | 'right';
    textColor?: string;
    backgroundColor?: string;
    overlay?: {
      enabled: boolean;
      color: string;
      opacity: number;
    };
  }>;
  autoplay: boolean;
  duration: number;
  transition: 'fade' | 'slide';
  showDots: boolean;
  showArrows: boolean;
  height?: number;
  aspectRatio?: 'auto' | '16:9' | '21:9' | '4:3' | '1:1';
  navigation: {
    arrowStyle: 'default' | 'modern' | 'minimal';
    arrowColor: string;
    arrowSize: 'sm' | 'md' | 'lg';
    dotStyle: 'default' | 'modern' | 'minimal';
    dotColor: string;
    dotActiveColor: string;
  };
  effects: {
    parallax: boolean;
    kenBurns: boolean;
    fadeInText: boolean;
  };
}

export interface FeatureCardsSettings {
  enabled: boolean;
  title: string;
  subtitle: string;
  cards: Array<{
    id: string;
    icon: string;
    title: string;
    description: string;
    active: boolean;
  }>;
  layout: 'grid' | 'carousel';
  backgroundColor: string;
}

export interface FooterSettings {
  logo: string;
  logoWidth?: number;
  logoHeight?: number;
  description: string;
  backgroundColor: string;
  textColor: string;
  textHoverColor: string;
  showSocialMedia: boolean;
  showNewsletter: boolean;
  newsletterTitle: string;
  newsletterDescription: string;
  copyright: string;
  links: {
    aboutUs: boolean;
    contact: boolean;
    privacyPolicy: boolean;
    termsOfService: boolean;
    faq: boolean;
  };
  styling: {
    fontFamily: string;
    fontSize: 'sm' | 'base' | 'lg';
    fontWeight: 'normal' | 'medium' | 'semibold' | 'bold';
    headingFontSize: 'lg' | 'xl' | '2xl' | '3xl';
    headingFontWeight: 'normal' | 'medium' | 'semibold' | 'bold';
    headingColor: string;
    linkSpacing: number;
    sectionSpacing: number;
    padding: {
      top: number;
      bottom: number;
      horizontal: number;
    };
    borderColor: string;
    borderWidth: number;
  };
}

export interface VisualSettings {
  logo: string;
  footerLogo: string;
  favicon: string;
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  fontFamily: string;
  buttonStyle: 'rounded' | 'square' | 'bordered';
  buttonHover: {
    enabled: boolean;
    primaryColor: string;
    secondaryColor: string;
    animationType: 'none' | 'scale' | 'fade' | 'slide' | 'bounce';
    duration: number;
    intensity: number;
  };
}

export interface BannerSettings {
  mainBanners: Array<{
    id: string;
    image: string;
    title: string;
    subtitle: string;
    actionText: string;
    actionLink: string;
  }>;
  duration: number;
  transition: 'fade' | 'slide';
  secondaryBanners: Array<{
    id: string;
    image: string;
    title: string;
    actionLink: string;
    buttonText: string;
    buttonStyle: 'primary' | 'secondary' | 'outline' | 'text';
  }>;
}

export interface PageContent {
  aboutUs: string;
  contact: string;
  privacyPolicy: string;
  termsOfService: string;
  faq: string;
}

export interface StoreSettings {
  general: GeneralSettings;
  marquee: MarqueeSettings;
  navbar: NavbarSettings;
  slider: SliderSettings;
  featureCards: FeatureCardsSettings;
  footer: FooterSettings;
  visual: VisualSettings;
  banners: BannerSettings;
  pageContent: PageContent;
}
