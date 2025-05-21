
import { StoreSettings } from "@/types/settings";

export const defaultSettings: StoreSettings = {
  general: {
    storeName: "ShopMaster",
    slogan: "Sua loja online completa",
    email: "contato@shopmaster.com",
    phone: "(11) 99999-9999",
    address: "Rua Exemplo, 123 - Centro",
    socialMedia: {
      facebook: "https://facebook.com/shopmaster",
      instagram: "https://instagram.com/shopmaster",
      twitter: "https://twitter.com/shopmaster"
    },
    businessHours: "Segunda a Sexta: 9h às 18h | Sábado: 9h às 13h",
    taxId: "00.000.000/0001-00"
  },
  visual: {
    logo: "https://cdn.builder.io/api/v1/image/assets/TEMP/e090bda74d8b6b74bc4d3502a92715f9622ce8f5",
    footerLogo: "https://cdn.builder.io/api/v1/image/assets/TEMP/e090bda74d8b6b74bc4d3502a92715f9622ce8f5", // Default footer logo
    favicon: "/favicon.ico",
    colors: {
      primary: "#D90429",
      secondary: "#2B2D42",
      background: "#FFFFFF",
      text: "#54595F"
    },
    fontFamily: "Inter, sans-serif",
    buttonStyle: "rounded"
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
        buttonText: "Ver mais", // Added button text
        buttonStyle: "primary" // Added button style
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
