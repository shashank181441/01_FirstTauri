import React from 'react';

function CategoryButtons({ categories, onCategorySelect, activeCategory }) {
  return (
    <div
      id="category-buttons"
      className="mb-4 pb-4 mx-8 flex gap-3 overflow-x-auto whitespace-nowrap scrollbar-thin"
    >
      {["all", ...categories].map((category, index) => (
        <button
          key={index}
          className={`text-lg font-bold py-2 px-4 rounded-full ${
            activeCategory === category || (activeCategory === '' && category === 'all')
              ? 'bg-orange-500 text-white'
              : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={() => onCategorySelect(category === 'all' ? '' : category)}
        >
          {category.charAt(0).toUpperCase() + category.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default CategoryButtons;
