export type Theme = {
  name: string;
  id: string;
  type: 'light' | 'dark';
  colors: {
    background: string;
    surface: string;
    'surface-hover': string;
    primary: string;
    'primary-dark': string;
    secondary: string;
    'text-main': string;
    'text-muted': string;
    border: string;
  };
};

export const themes: Theme[] = [
  {
    name: 'Minimal Zinc',
    id: 'default',
    type: 'light',
    colors: {
      background: '255 255 255',
      surface: '249 250 251', // Gray 50
      'surface-hover': '243 244 246', // Gray 100
      primary: '24 24 27', // Zinc 950
      'primary-dark': '9 9 11', // Zinc 950
      secondary: '82 82 91', // Zinc 600
      'text-main': '24 24 27', // Zinc 950
      'text-muted': '113 113 122', // Zinc 500
      border: '228 228 231', // Zinc 200
    },
  },
  {
    name: 'Morandi Serenity',
    id: 'morandi',
    type: 'light',
    colors: {
      background: '240 242 240', // Very light grayish green/blue
      surface: '230 232 230', 
      'surface-hover': '220 222 220',
      primary: '107 124 117', // Muted Sage Green
      'primary-dark': '90 105 98',
      secondary: '142 158 153',
      'text-main': '44 51 48',
      'text-muted': '107 124 117',
      border: '209 214 212',
    },
  },
  {
    name: 'Monet Garden',
    id: 'monet',
    type: 'light',
    colors: {
      background: '253 252 248', // Warm off-white
      surface: '244 241 234', // Light warm beige
      'surface-hover': '235 231 222',
      primary: '124 141 165', // Periwinkle Blue (Water Lilies)
      'primary-dark': '101 117 140',
      secondary: '170 182 199',
      'text-main': '62 71 86',
      'text-muted': '136 150 171',
      border: '224 220 213',
    },
  },
  {
    name: 'Nordic Night',
    id: 'nordic',
    type: 'dark',
    colors: {
      background: '26 27 38', // Deep Blue-Grey
      surface: '36 40 59', 
      'surface-hover': '47 53 73',
      primary: '122 162 247', // Soft Blue
      'primary-dark': '93 137 232',
      secondary: '86 95 137',
      'text-main': '192 202 245',
      'text-muted': '120 124 153',
      border: '65 72 104',
    },
  }
];