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
    name: 'Earth Tones',
    id: 'default',
    type: 'light',
    colors: {
      background: '255 255 255',
      surface: '250 250 250',
      'surface-hover': '245 245 245',
      primary: '139 94 60', // #8B5E3C
      'primary-dark': '140 94 83', // #8C5E53
      secondary: '68 115 60', // #44733C
      'text-main': '40 40 40',
      'text-muted': '104 104 104', // #686868
      border: '228 228 231',
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