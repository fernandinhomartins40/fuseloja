
export interface GeneralSettings {
  storeName: string;
  slogan: string;
  email: string;
  phone: string;
  address: string;
  socialMedia: {
    facebook: string;
    instagram: string;
    twitter: string;
  };
  businessHours: string;
  taxId: string;
}

export interface VisualSettings {
  logo: string;
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
  visual: VisualSettings;
  banners: BannerSettings;
  pageContent: PageContent;
}
