// Predefined industry color mappings
export const INDUSTRY_COLORS = {
  technology: {
    bg: 'bg-blue-100',
    text: 'text-blue-800',
    hover: 'hover:bg-blue-100'
  },
  finance: {
    bg: 'bg-green-100',
    text: 'text-green-800',
    hover: 'hover:bg-green-100'
  },
  'e-commerce': {
    bg: 'bg-purple-100',
    text: 'text-purple-800',
    hover: 'hover:bg-purple-100'
  },
  saas: {
    bg: 'bg-amber-100',
    text: 'text-amber-800',
    hover: 'hover:bg-amber-100'
  },
  education: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-800',
    hover: 'hover:bg-indigo-100'
  },
  agriculture: {
    bg: 'bg-lime-100',
    text: 'text-lime-800',
    hover: 'hover:bg-lime-100'
  }
};

// Default color for unknown industries
const DEFAULT_COLOR = {
  bg: 'bg-gray-100',
  text: 'text-gray-800',
  hover: 'hover:bg-gray-100'
};

// Normalize industry name (lowercase, trim, etc.)
const normalizeIndustry = (industry) => {
  if (!industry) return '';
  if (typeof industry === 'object') {
    return industry.name?.toLowerCase().trim() || '';
  }
  return industry.toString().toLowerCase().trim();
};

// Get color classes for a given industry
export const getIndustryColorClasses = (industry) => {
  const normalized = normalizeIndustry(industry);
  if (!normalized) return DEFAULT_COLOR;
  
  const matchedKey = Object.keys(INDUSTRY_COLORS).find(
    key => normalized.includes(key)
  );
  
  return matchedKey ? INDUSTRY_COLORS[matchedKey] : DEFAULT_COLOR;
};

// Extract industry name from object or string
export const getIndustryName = (industry) => {
  if (!industry) return 'Unknown';
  if (typeof industry === 'object') {
    return industry.name || 'Unknown';
  }
  return industry;
};