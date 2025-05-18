import React from 'react';

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = "Pesquisar...",
  onSearch 
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const input = form.elements[0] as HTMLInputElement;
    onSearch?.(input.value);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-[598px] bg-white rounded-[3px]">
      <input
        type="text"
        placeholder={placeholder}
        className="w-[548px] text-[15px] text-[#54595F] px-[16.66px] py-[13.5px] border-[none] rounded-l-[3px] focus:outline-none"
      />
      <button 
        type="submit"
        className="w-[50px] h-[50px] text-white flex justify-center items-center cursor-pointer bg-[#D90429] border-[none] rounded-r-[3px]"
        aria-label="Search"
      >
        <i className="ti ti-search" />
      </button>
    </form>
  );
};
