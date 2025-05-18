
import React from 'react';
import { ProductCard } from '../ui/ProductCard';

const products = [
  {
    title: "Motorola Moto G52",
    price: 1199.99,
    originalPrice: 1699.99,
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/fd3b7483e68f281457f3a18ef4d4f56f7928888c",
    onSale: true
  },
  {
    title: "Motorola Edge 30 Neo",
    price: 1999.99,
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/6f35bf2524598b46cfc1ada7e4dc844ae9b555b0"
  },
  {
    title: "Motorola Edge 30 5G",
    price: 2499.99,
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/fde6f3d8fa4ef8eb282a2c9fc5e2e526ef1fae59"
  },
  {
    title: "Moto G22 Motorola",
    price: 999.99,
    originalPrice: 1599.99,
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/a4b3619fdfb8ce82aa8b8ef614f625418964a07f",
    onSale: true
  },
  {
    title: "iPhone 14 Pro Max Apple",
    price: 9999.99,
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/b3e835ab10e3658c731b0b345d07753017b0378b"
  },
  {
    title: "iPhone 14 Pro Apple",
    price: 7999.99,
    originalPrice: 8999.99,
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/e3ee4bb1fff8bdaab32454a54b832dcfeb82316e",
    onSale: true
  },
  {
    title: "iPhone 13 Pro Apple",
    price: 4999.99,
    originalPrice: 5599.99,
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/8d95ddc3cfa50e4b8cc5927e68e74151214f3e01",
    onSale: true
  },
  {
    title: "iPhone 13 Apple",
    price: 4499.99,
    originalPrice: 4999.99,
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/fcf214acc93fd0eb55396045483ec6227627d373",
    onSale: true
  },
  {
    title: "Galaxy Z Flip4 5G",
    price: 7999.99,
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/f0d13ca52491720673d5e35a592790ce45680241"
  },
  {
    title: "Galaxy Z Flip3 5G",
    price: 5999.99,
    originalPrice: 6999.99,
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/ffc8932d292efd89b6d91b213593cb5f93f535ec",
    onSale: true
  },
  {
    title: "Galaxy S22+ 5G",
    price: 4499.99,
    originalPrice: 4999.99,
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/54eaefa5ed38921f6aad46eba32aa20bb73bb763",
    onSale: true
  },
  {
    title: "Galaxy S22 Ultra",
    price: 4999.99,
    originalPrice: 5999.99,
    image: "https://cdn.builder.io/api/v1/image/assets/TEMP/7d895d69513aa9a8d4fa40c3f74f86c05a59162e",
    onSale: true
  }
];

export const ProductGrid: React.FC = () => {
  return (
    <section className="py-10 px-4">
      <h2 className="text-center text-[32px] text-[#0B0909] font-bold mb-10">
        Smartphones
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((product, index) => (
          <ProductCard
            key={index}
            {...product}
          />
        ))}
      </div>
    </section>
  );
};
