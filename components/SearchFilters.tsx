'use client';

import React, { useState } from 'react';
import { Search, ChevronDown, X, Filter, ArrowUpDown, Sparkles, Command } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  filters: Array<{
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    label?: string;
  }>;
  sortBy?: string;
  onSortChange?: (value: string) => void;
  sortOptions?: FilterOption[];
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchTerm,
  onSearchChange,
  searchPlaceholder = "Search tickets, customers, or keywords...",
  filters,
  sortBy,
  onSortChange,
  sortOptions
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const getActiveFilterCount = () => {
    return filters.filter(filter => filter.value !== 'all').length;
  };

  const clearSearch = () => {
    onSearchChange('');
  };

  return (
    <div className="px-8 py-6 bg-gradient-to-br from-slate-50/80 via-white to-slate-50/40 border-b border-slate-200/60 backdrop-blur-sm">
      <div className="flex flex-col lg:flex-row gap-4 items-center">
        {/* Enhanced Search Bar */}
        <div className="flex-1 max-w-2xl">
          <div className="relative group">
            {/* Glow effect on focus */}
            <div className={`absolute inset-0 bg-gradient-to-r from-violet-600/20 via-blue-600/20 to-indigo-600/20 rounded-2xl blur-lg transition-all duration-300 ${isSearchFocused ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}></div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-4">
                <Search className={`w-5 h-5 transition-all duration-200 ${isSearchFocused ? 'text-violet-600 scale-110' : 'text-slate-400'}`} />
              </div>

              <input
                type="text"
                placeholder={searchPlaceholder}
                className="w-full pl-12 pr-20 py-4 text-sm font-medium bg-white/90 backdrop-blur-sm border border-slate-200/80 rounded-2xl
                         focus:ring-2 focus:ring-violet-500/50 focus:border-violet-300 focus:bg-white
                         hover:border-slate-300 hover:shadow-lg
                         text-slate-900 placeholder-slate-500
                         shadow-sm hover:shadow-md transition-all duration-200
                         group-hover:border-slate-300"
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />

              <div className="absolute inset-y-0 right-0 flex items-center pr-4 gap-2">
                {searchTerm ? (
                  <button
                    onClick={clearSearch}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all duration-200"
                  >
                    <X className="w-4 h-4" />
                  </button>
                ) : (
                  <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-100/80 rounded-lg">
                    <Command className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-500">K</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="flex items-center gap-3">
          {/* Combined Filters Button */}
          <div className="relative">
            <button className="flex items-center gap-2 px-4 py-3 text-sm font-semibold text-slate-700 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl hover:border-slate-300 hover:shadow-lg hover:bg-white transition-all duration-200 shadow-sm">
              <Filter className="w-4 h-4" />
              <span>Filters</span>
              {getActiveFilterCount() > 0 && (
                <span className="bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-xs px-2 py-0.5 rounded-full font-bold shadow-sm">
                  {getActiveFilterCount()}
                </span>
              )}
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          {/* Sort Dropdown */}
          {sortOptions && onSortChange && (
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => onSortChange(e.target.value)}
                className="appearance-none pl-10 pr-8 py-3 text-sm font-semibold text-slate-700 bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl
                         focus:ring-2 focus:ring-violet-500/50 focus:border-violet-300
                         hover:border-slate-300 hover:shadow-lg hover:bg-white
                         transition-all duration-200 shadow-sm cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ArrowUpDown className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 pointer-events-none" />
              <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          )}

          {/* Quick Filter Pills */}
          <div className="hidden xl:flex items-center gap-2 pl-3 border-l border-slate-200/60">
            {filters.slice(0, 3).map((filter, index) => (
              <div key={index} className="relative">
                <select
                  value={filter.value}
                  onChange={(e) => filter.onChange(e.target.value)}
                  className={`appearance-none px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer border ${
                    filter.value !== 'all'
                      ? 'bg-gradient-to-r from-violet-50 to-indigo-50 border-violet-200 text-violet-700 shadow-sm shadow-violet-500/10'
                      : 'bg-white/80 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  {filter.options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3 h-3 absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 pointer-events-none" />
              </div>
            ))}
          </div>

          {/* AI Search Hint */}
          <div className="hidden 2xl:flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-violet-50/80 to-indigo-50/80 border border-violet-200/60 rounded-xl backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-violet-600" />
            <span className="text-sm font-semibold text-violet-700">AI powered</span>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-200/60">
          <span className="text-sm font-semibold text-slate-600">Active filters:</span>
          <div className="flex items-center gap-2">
            {filters
              .filter(filter => filter.value !== 'all')
              .map((filter, index) => {
                const selectedOption = filter.options.find(opt => opt.value === filter.value);
                return (
                  <span
                    key={index}
                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-violet-100 to-indigo-100 text-violet-700 rounded-xl text-sm font-semibold border border-violet-200 shadow-sm"
                  >
                    {selectedOption?.label}
                    <button
                      onClick={() => filter.onChange('all')}
                      className="p-0.5 hover:bg-violet-200 rounded-full transition-colors duration-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                );
              })}
            <button
              onClick={() => filters.forEach(filter => filter.onChange('all'))}
              className="text-sm font-medium text-slate-500 hover:text-slate-700 px-2 py-1 hover:bg-slate-100 rounded-lg transition-colors duration-200"
            >
              Clear all
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchFilters;