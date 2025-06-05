
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

export interface NavbarSettings {
  logo: string;
  showSearch: boolean;
  showCategories: boolean;
  backgroundColor: string;
  textColor: string;
  sticky: boolean;
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
  }>;
  autoplay: boolean;
  duration: number;
  transition: 'fade' | 'slide';
  showDots: boolean;
  showArrows: boolean;
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
  description: string;
  backgroundColor: string;
  textColor: string;
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
  navbar: NavbarSettings;
  slider: SliderSettings;
  featureCards: FeatureCardsSettings;
  footer: FooterSettings;
  visual: VisualSettings;
  banners: BannerSettings;
  pageContent: PageContent;
}
