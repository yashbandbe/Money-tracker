import React from 'react';
import { CURRENCIES, CATEGORIES } from './initialData';
import { 
  Home, 
  Utensils, 
  Car, 
  Film, 
  Zap, 
  ShoppingBag, 
  HeartPulse, 
  GraduationCap, 
  Wallet, 
  Briefcase, 
  TrendingUp, 
  MoreHorizontal,
  CreditCard,
  Building,
  Smartphone,
  Banknote
} from 'lucide-react';

export const formatCurrency = (amount, currencyCode = 'USD') => {
  const curr = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0];
  const formattedNumber = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);

  return `${curr.symbol}${formattedNumber}`;
};

export const getCategoryIcon = (iconName, size = 18) => {
  const props = { size };
  switch (iconName) {
    case 'Home': return <Home {...props} />;
    case 'Utensils': return <Utensils {...props} />;
    case 'Car': return <Car {...props} />;
    case 'Film': return <Film {...props} />;
    case 'Zap': return <Zap {...props} />;
    case 'ShoppingBag': return <ShoppingBag {...props} />;
    case 'HeartPulse': return <HeartPulse {...props} />;
    case 'GraduationCap': return <GraduationCap {...props} />;
    case 'Wallet': return <Wallet {...props} />;
    case 'Briefcase': return <Briefcase {...props} />;
    case 'TrendingUp': return <TrendingUp {...props} />;
    default: return <MoreHorizontal {...props} />;
  }
};

export const getPaymentIcon = (method, size = 16) => {
  const props = { size };
  if (method.includes('Credit')) return <CreditCard {...props} />;
  if (method.includes('Bank')) return <Building {...props} />;
  if (method.includes('Digital') || method.includes('UPI')) return <Smartphone {...props} />;
  return <Banknote {...props} />;
};
