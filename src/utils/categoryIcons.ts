
import {
  Smartphone,
  Laptop,
  Shirt,
  ShoppingBag,
  Home,
  Lamp,
  BookOpen,
  Book,
  Sparkles,
  Heart,
  Dumbbell,
  Trophy,
  Baby,
  Gamepad,
  Watch,
  Headphones,
  UtensilsCrossed,
  Apple,
  Car,
  Gauge,
  Paw,
  Fish,
  Hammer,
  Wrench,
  Flower,
  Trees,
  Speaker,
  Video,
  Gamepad2,
  Puzzle
} from "lucide-react";
import { Category } from "@/types/category";

export const iconComponents = {
  Smartphone,
  Laptop,
  Shirt, 
  ShoppingBag,
  Home,
  Lamp,
  BookOpen,
  Book,
  Sparkles,
  Heart,
  Dumbbell,
  Trophy,
  Baby,
  Gamepad,
  Watch,
  Headphones,
  UtensilsCrossed,
  Apple,
  Car,
  Gauge,
  Paw,
  Fish,
  Hammer,
  Wrench,
  Flower,
  Trees,
  Speaker,
  Video,
  Gamepad2,
  Puzzle,
};

export type IconName = keyof typeof iconComponents;

export const defaultCategories: Category[] = [
  {
    id: "cat-electronics",
    name: "Eletrônicos",
    slug: "eletronicos",
    icon: "Smartphone",
    description: "Smartphones, tablets, laptops e outros dispositivos eletrônicos",
    color: "blue",
    isDefault: true
  },
  {
    id: "cat-fashion",
    name: "Moda",
    slug: "moda",
    icon: "Shirt",
    description: "Roupas, calçados e acessórios de moda",
    color: "pink",
    isDefault: true
  },
  {
    id: "cat-home",
    name: "Casa e Decoração",
    slug: "casa-decoracao",
    icon: "Home",
    description: "Móveis, decoração e itens para o lar",
    color: "green",
    isDefault: true
  },
  {
    id: "cat-books",
    name: "Livros",
    slug: "livros",
    icon: "BookOpen",
    description: "Livros físicos, e-books e audiolivros",
    color: "orange",
    isDefault: true
  },
  {
    id: "cat-beauty",
    name: "Beleza e Saúde",
    slug: "beleza-saude",
    icon: "Sparkles",
    description: "Produtos de beleza, saúde e bem-estar",
    color: "purple",
    isDefault: true
  },
  {
    id: "cat-sports",
    name: "Esportes",
    slug: "esportes",
    icon: "Dumbbell",
    description: "Artigos esportivos e equipamentos de fitness",
    color: "red",
    isDefault: true
  },
  {
    id: "cat-kids",
    name: "Infantil",
    slug: "infantil",
    icon: "Baby",
    description: "Produtos para bebês e crianças",
    color: "yellow",
    isDefault: true
  },
  {
    id: "cat-accessories",
    name: "Acessórios",
    slug: "acessorios",
    icon: "Watch",
    description: "Relógios, joias e acessórios pessoais",
    color: "purple",
    isDefault: true
  },
  {
    id: "cat-food",
    name: "Alimentos",
    slug: "alimentos",
    icon: "UtensilsCrossed",
    description: "Alimentos, bebidas e artigos de culinária",
    color: "green",
    isDefault: true
  },
  {
    id: "cat-auto",
    name: "Automotivo",
    slug: "automotivo",
    icon: "Car",
    description: "Peças, acessórios e produtos para automóveis",
    color: "blue",
    isDefault: true
  },
  {
    id: "cat-pets",
    name: "Pets",
    slug: "pets",
    icon: "Paw",
    description: "Produtos para animais de estimação",
    color: "orange",
    isDefault: true
  },
  {
    id: "cat-tools",
    name: "Ferramentas",
    slug: "ferramentas",
    icon: "Hammer",
    description: "Ferramentas e equipamentos",
    color: "neutral",
    isDefault: true
  },
  {
    id: "cat-garden",
    name: "Jardinagem",
    slug: "jardinagem",
    icon: "Flower",
    description: "Plantas, sementes e artigos para jardim",
    color: "green",
    isDefault: true
  },
  {
    id: "cat-audio-video",
    name: "Áudio e Vídeo",
    slug: "audio-video",
    icon: "Speaker",
    description: "Equipamentos de áudio e vídeo",
    color: "red",
    isDefault: true
  },
  {
    id: "cat-games",
    name: "Jogos",
    slug: "jogos",
    icon: "Gamepad",
    description: "Jogos, consoles e acessórios para games",
    color: "blue",
    isDefault: true
  }
];
