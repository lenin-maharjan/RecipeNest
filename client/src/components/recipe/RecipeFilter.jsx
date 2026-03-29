const RecipeFilter = ({ filters, onChange }) => {
  const categories = [
    'All', 'Breakfast', 'Lunch', 'Dinner',
    'Dessert', 'Snack', 'Beverage', 'Other',
  ];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard'];

  return (
    <div className="bg-white rounded-xl border border-gray-100
                    p-4 flex flex-wrap gap-4 items-center">

      {/* search */}
      <div className="flex-1 min-w-48">
        <input
          type="text"
          placeholder="Search recipes..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="input-field"
        />
      </div>

      {/* category */}
      <select
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        className="input-field w-auto min-w-36"
      >
        {categories.map((c) => (
          <option key={c} value={c === 'All' ? '' : c}>{c}</option>
        ))}
      </select>

      {/* difficulty */}
      <select
        value={filters.difficulty}
        onChange={(e) => onChange({ ...filters, difficulty: e.target.value })}
        className="input-field w-auto min-w-36"
      >
        {difficulties.map((d) => (
          <option key={d} value={d === 'All' ? '' : d}>{d}</option>
        ))}
      </select>

      {/* min rating */}
      <select
        value={filters.minRating}
        onChange={(e) => onChange({ ...filters, minRating: e.target.value })}
        className="input-field w-auto min-w-36"
      >
        <option value="">Any Rating</option>
        <option value="3">3+ Stars</option>
        <option value="4">4+ Stars</option>
        <option value="4.5">4.5+ Stars</option>
      </select>

      {/* verified only */}
      <label className="flex items-center gap-2 cursor-pointer
                        whitespace-nowrap">
        <input
          type="checkbox"
          checked={filters.verifiedOnly}
          onChange={(e) =>
            onChange({ ...filters, verifiedOnly: e.target.checked })
          }
          className="w-4 h-4 accent-primary-500"
        />
        <span className="text-sm font-medium text-gray-700">
          Verified chefs only
        </span>
      </label>

    </div>
  );
};

export default RecipeFilter;