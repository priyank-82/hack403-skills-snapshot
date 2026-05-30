import React, { useState } from 'react';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import '../styles/components/SearchFilter.css';

const SearchFilter = ({ 
  onSearch, 
  onFilter, 
  placeholder = "Search skills...",
  filters = [],
  activeFilters = [],
  className = ""
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch?.(value);
  };

  const handleFilterToggle = (filterId) => {
    const newFilters = activeFilters.includes(filterId)
      ? activeFilters.filter(id => id !== filterId)
      : [...activeFilters, filterId];
    onFilter?.(newFilters);
  };

  const clearSearch = () => {
    setSearchTerm('');
    onSearch?.('');
  };

  return (
    <div className={`search-filter ${className}`}>
      <div className="search-filter__search">
        <div className="search-filter__search-input">
          <Search className="search-filter__search-icon" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder={placeholder}
            className="search-filter__input"
          />
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="search-filter__clear"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {filters.length > 0 && (
        <div className="search-filter__filters">
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`search-filter__filter-toggle ${isFilterOpen ? 'active' : ''}`}
          >
            <Filter size={16} />
            Filters
            {activeFilters.length > 0 && (
              <span className="search-filter__filter-count">{activeFilters.length}</span>
            )}
            <ChevronDown 
              size={16} 
              className={`search-filter__chevron ${isFilterOpen ? 'rotated' : ''}`} 
            />
          </button>

          {isFilterOpen && (
            <div className="search-filter__filter-dropdown">
              {filters.map((filter) => (
                <label key={filter.id} className="search-filter__filter-item">
                  <input
                    type="checkbox"
                    checked={activeFilters.includes(filter.id)}
                    onChange={() => handleFilterToggle(filter.id)}
                    className="search-filter__checkbox"
                  />
                  <span className="search-filter__filter-label">{filter.label}</span>
                  {filter.count && (
                    <span className="search-filter__filter-count-badge">{filter.count}</span>
                  )}
                </label>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchFilter;