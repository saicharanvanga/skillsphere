import React from 'react';
import { Search, RotateCcw, Filter } from 'lucide-react';
import {
  SKILL_CATEGORIES,
  PROFICIENCY_LEVELS,
  LEARNING_STATUSES,
} from '../../utils/constants';

const SkillFilterBar = ({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  proficiencyLevel,
  onProficiencyChange,
  status,
  onStatusChange,
  sort,
  onSortChange,
  onReset,
}) => {
  const isFiltered =
    Boolean(search) ||
    category !== 'All' ||
    proficiencyLevel !== 'All' ||
    status !== 'All' ||
    sort !== 'newest';

  return (
    <div className="filter-bar">
      {/* Search Input */}
      <div className="search-input-wrapper">
        <Search size={18} className="search-icon" />
        <input
          type="text"
          className="search-input"
          placeholder="Search skills by name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>

      {/* Category Filter */}
      <div>
        <select
          className="filter-select"
          value={category}
          onChange={(e) => onCategoryChange(e.target.value)}
          aria-label="Filter by Category"
        >
          <option value="All">All Categories</option>
          {SKILL_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Proficiency Level Filter */}
      <div>
        <select
          className="filter-select"
          value={proficiencyLevel}
          onChange={(e) => onProficiencyChange(e.target.value)}
          aria-label="Filter by Proficiency Level"
        >
          <option value="All">All Levels</option>
          {PROFICIENCY_LEVELS.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl}
            </option>
          ))}
        </select>
      </div>

      {/* Learning Status Filter */}
      <div>
        <select
          className="filter-select"
          value={status}
          onChange={(e) => onStatusChange(e.target.value)}
          aria-label="Filter by Learning Status"
        >
          <option value="All">All Statuses</option>
          {LEARNING_STATUSES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Sorting */}
      <div>
        <select
          className="filter-select"
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          aria-label="Sort skills"
        >
          <option value="newest">Recently Added</option>
          <option value="name-asc">Name (A → Z)</option>
          <option value="name-desc">Name (Z → A)</option>
          <option value="progress-desc">Progress (High → Low)</option>
          <option value="progress-asc">Progress (Low → High)</option>
        </select>
      </div>

      {/* Reset Button */}
      {isFiltered && (
        <button
          onClick={onReset}
          className="btn btn-secondary btn-sm"
          title="Reset all filters"
        >
          <RotateCcw size={14} />
          <span>Reset</span>
        </button>
      )}
    </div>
  );
};

export default SkillFilterBar;
