import React from 'react';
import '../../styles/SearchBar.css';
import { Search } from 'lucide-react';

export default function SearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="searchbar-container">
      <Search className="searchbar-icon" size={18} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="searchbar-input"
      />
    </div>
  );
}
