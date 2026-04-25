const RecipeFilter = ({ filters, onChange }) => {
  const categories = [
    'All', 'Breakfast', 'Lunch', 'Dinner',
    'Dessert', 'Snack', 'Beverage', 'Other',
  ];

  const hasActiveFilters = 
    filters.search || 
    filters.authorSearch || 
    filters.category || 
    filters.difficulty || 
    filters.minRating || 
    filters.verifiedOnly;

  const clearFilters = () => {
    onChange({
      search: '',
      authorSearch: '',
      category: '',
      difficulty: '',
      minRating: '',
      verifiedOnly: false,
    });
  };

  const toggleVerified = () => {
    onChange({ ...filters, verifiedOnly: !filters.verifiedOnly });
  };

  return (
    <div className="bg-white border-y border-linen sticky top-14 z-40">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-3 overflow-x-auto">
        <input 
          placeholder="Search recipes..." 
          value={filters.search || ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="bg-stone-50 border border-linen rounded-lg px-4 py-2 text-sm
            focus:outline-none focus:border-sand min-w-[160px]" 
        />

        <select 
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
          className="bg-stone-50 border border-linen rounded-lg px-3 py-2
            text-sm text-gray-500 focus:outline-none focus:border-sand"
        >
          <option value="">All categories</option>
          {categories.filter(c => c !== 'All').map(c => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <select 
          value={filters.minRating}
          onChange={(e) => onChange({ ...filters, minRating: e.target.value })}
          className="bg-stone-50 border border-linen rounded-lg px-3 py-2
            text-sm text-gray-500 focus:outline-none focus:border-sand"
        >
          <option value="">Any rating</option>
          <option value="3">3+ Stars</option>
          <option value="4">4+ Stars</option>
          <option value="4.5">4.5+ Stars</option>
        </select>

        <input 
          placeholder="Author name..." 
          value={filters.authorSearch || ''}
          onChange={(e) => onChange({ ...filters, authorSearch: e.target.value })}
          className="bg-stone-50 border border-linen rounded-lg px-4 py-2
            text-sm focus:outline-none focus:border-sand min-w-[130px]" 
        />

        <button 
          onClick={toggleVerified}
          className={`text-xs px-4 py-2 rounded-full border transition-colors shrink-0
            ${filters.verifiedOnly 
              ? 'bg-paprika text-white border-paprika' 
              : 'border-sand text-gray-500 hover:border-gray-400'}`}
        >
          ✓ Verified only
        </button>

        {hasActiveFilters && (
          <button 
            onClick={clearFilters} 
            className="text-xs text-gray-400 hover:text-gray-700 underline underline-offset-4 shrink-0"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
};

export default RecipeFilter;