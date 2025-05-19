
import { LucideIcon } from "lucide-react";

export type CategoryColor =
  | 'neutral'
  | 'purple'
  | 'green'
  | 'yellow'
  | 'orange'
  | 'pink'
  | 'blue'
  | 'red';

export type CategoryIcon = string;

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon: CategoryIcon;
  color: CategoryColor;
  isDefault?: boolean; // Whether this is a predefined category
}

export const categoryColors: Record<CategoryColor, string> = {
  neutral: "bg-gray-100 text-gray-800",
  purple: "bg-purple-100 text-purple-800",
  green: "bg-green-100 text-green-800",
  yellow: "bg-yellow-100 text-yellow-800",
  orange: "bg-orange-100 text-orange-800",
  pink: "bg-pink-100 text-pink-800",
  blue: "bg-blue-100 text-blue-800",
  red: "bg-red-100 text-red-800"
};

export const categoryColorsMap = {
  neutral: { bg: "#F1F0FB", text: "#8E9196" },
  purple: { bg: "#E5DEFF", text: "#7E69AB" },
  green: { bg: "#F2FCE2", text: "#4CAF50" },
  yellow: { bg: "#FEF7CD", text: "#FFC107" },
  orange: { bg: "#FDE1D3", text: "#FF9800" },
  pink: { bg: "#FFDEE2", text: "#D946EF" },
  blue: { bg: "#D3E4FD", text: "#0EA5E9" },
  red: { bg: "#FFCDD2", text: "#F44336" }
};
