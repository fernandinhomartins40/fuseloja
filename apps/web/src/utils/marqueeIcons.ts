import { 
  Truck, 
  Shield, 
  HeadphonesIcon, 
  Zap,
  Star,
  Award,
  Gift,
  Heart,
  ShoppingBag,
  Clock,
  MapPin,
  Phone,
  Mail,
  Users,
  CheckCircle,
  ThumbsUp,
  Sparkles,
  Crown,
  Rocket,
  Globe,
  Package,
  CreditCard,
  Verified,
  Lock,
  Target,
  TrendingUp,
  BadgeCheck,
  type LucideIcon
} from 'lucide-react';

export type MarqueeIconName = 
  | 'Truck'
  | 'Shield' 
  | 'HeadphonesIcon'
  | 'Zap'
  | 'Star'
  | 'Award'
  | 'Gift'
  | 'Heart'
  | 'ShoppingBag'
  | 'Clock'
  | 'MapPin'
  | 'Phone'
  | 'Mail'
  | 'Users'
  | 'CheckCircle'
  | 'ThumbsUp'
  | 'Sparkles'
  | 'Crown'
  | 'Rocket'
  | 'Globe'
  | 'Package'
  | 'CreditCard'
  | 'Verified'
  | 'Lock'
  | 'Target'
  | 'TrendingUp'
  | 'BadgeCheck';

export const marqueeIconComponents: Record<MarqueeIconName, LucideIcon> = {
  Truck,
  Shield,
  HeadphonesIcon,
  Zap,
  Star,
  Award,
  Gift,
  Heart,
  ShoppingBag,
  Clock,
  MapPin,
  Phone,
  Mail,
  Users,
  CheckCircle,
  ThumbsUp,
  Sparkles,
  Crown,
  Rocket,
  Globe,
  Package,
  CreditCard,
  Verified,
  Lock,
  Target,
  TrendingUp,
  BadgeCheck,
};

export const getMarqueeIcon = (iconName: string): LucideIcon => {
  return marqueeIconComponents[iconName as MarqueeIconName] || marqueeIconComponents['Package'];
};