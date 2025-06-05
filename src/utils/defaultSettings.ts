
import { StoreSettings } from "@/types/settings";

export const defaultSettings: StoreSettings = {
  general: {
    storeName: "ShopMaster",
    slogan: "Sua loja online completa",
    email: "contato@shopmaster.com",
    phone: "(11) 99999-9999",
    whatsApp: "(11) 99999-9999",
    address: "Rua Exemplo, 123 - Centro",
    socialMedia: {
      facebook: "https://facebook.com/shopmaster",
      instagram: "https://instagram.com/shopmaster",
      twitter: "https://twitter.com/shopmaster"
    },
    businessHours: "Segunda a Sexta: 9h às 18h | Sábado: 9h às 13h",
    taxId: "00.000.000/0001-00"
  },
  navbar: {
    logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/e090bda74d8b6b74bc4d3502a92715f9622ce8f5",
    showSearch: true,
    showCategories: true,
    backgroundColor: "#FFFFFF",
    textColor: "#2B2D42",
    sticky: true
  },
  slider: {
    banners: [
      {
        id: "1",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
        title: "Novidades para você",
        subtitle: "Confira os lançamentos da estação",
        actionText: "Ver ofertas",
        actionLink: "/ofertas",
        active: true
      }
    ],
    autoplay: true,
    duration: 5000,
    transition: "fade",
    showDots: true,
    showArrows: true
  },
  featureCards: {
    enabled: true,
    title: "Por que escolher nossa loja?",
    subtitle: "Oferecemos os melhores benefícios para nossos clientes",
    cards: [
      {
        id: "1",
        icon: "Truck",
        title: "Entrega Rápida",
        description: "Entregamos em todo o Brasil com agilidade e segurança",
        active: true
      },
      {
        id: "2", 
        icon: "Shield",
        title: "Compra Segura",
        description: "Seus dados estão protegidos em todas as transações",
        active: true
      },
      {
        id: "3",
        icon: "Headphones",
        title: "Suporte 24/7",
        description: "Atendimento especializado sempre que precisar",
        active: true
      }
    ],
    layout: "grid",
    backgroundColor: "#F8F9FA"
  },
  footer: {
    logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/e090bda74d8b6b74bc4d3502a92715f9622ce8f5",
    description: "Sua loja online completa com os melhores produtos e atendimento especializado.",
    backgroundColor: "#2B2D42",
    textColor: "#FFFFFF",
    showSocialMedia: true,
    showNewsletter: true,
    newsletterTitle: "Receba nossas ofertas",
    newsletterDescription: "Cadastre-se e seja o primeiro a saber das novidades e promoções",
    copyright: "© 2024 ShopMaster. Todos os direitos reservados.",
    links: {
      aboutUs: true,
      contact: true,
      privacyPolicy: true,
      termsOfService: true,
      faq: true
    }
  },
  visual: {
    logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/e090bda74d8b6b74bc4d3502a92715f9622ce8f5",
    footerLogo: "https://cdn.builder.io/api/v1/image/assets/TEMP/e090bda74d8b6b74bc4d3502a92715f9622ce8f5",
    favicon: "/favicon.ico",
    colors: {
      primary: "#D90429",
      secondary: "#2B2D42",
      background: "#FFFFFF",
      text: "#54595F"
    },
    fontFamily: "Inter, sans-serif",
    buttonStyle: "rounded",
    buttonHover: {
      enabled: true,
      primaryColor: "#B8031E",
      secondaryColor: "#1F2235",
      animationType: "scale",
      duration: 300,
      intensity: 5
    }
  },
  banners: {
    mainBanners: [
      {
        id: "1",
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158",
        title: "Novidades para você",
        subtitle: "Confira os lançamentos da estação",
        actionText: "Ver ofertas",
        actionLink: "/ofertas"
      }
    ],
    duration: 5000,
    transition: "fade",
    secondaryBanners: [
      {
        id: "1",
        image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b",
        title: "Eletrônicos com até 30% off",
        actionLink: "/categoria/eletronicos",
        buttonText: "Ver mais",
        buttonStyle: "primary"
      }
    ]
  },
  pageContent: {
    aboutUs: "<h2>Sobre Nós</h2><p>Somos uma empresa comprometida em oferecer produtos de qualidade com o melhor atendimento.</p>",
    contact: "<h2>Entre em Contato</h2><p>Estamos sempre disponíveis para atender você da melhor forma possível.</p>",
    privacyPolicy: "<h2>Política de Privacidade</h2><p>Sua privacidade é importante para nós.</p>",
    termsOfService: "<h2>Termos de Uso</h2><p>Ao utilizar nosso site, você concorda com nossos termos.</p>",
    faq: "<h2>Perguntas Frequentes</h2><p>Confira as dúvidas mais comuns de nossos clientes.</p>"
  }
};
