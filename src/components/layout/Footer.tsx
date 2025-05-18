import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#0B0909] pt-[60px] pb-0 px-[360px] max-md:p-5">
      <div className="grid grid-cols-[repeat(4,1fr)] gap-10 mb-10 max-md:grid-cols-[repeat(2,1fr)] max-sm:grid-cols-[1fr]">
        <div>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/e090bda74d8b6b74bc4d3502a92715f9622ce8f5"
            alt="Logo"
          />
        </div>
        
        <div>
          <h4 className="text-white text-2xl mb-5">Links</h4>
          <nav className="flex flex