export interface RestaurantTable {
  id: string;
  label: string;
};

export interface Discount {
  id: string;
  label: string;
  offset: number;
};

export interface Printer {
  id: string;
  name: string;
  sn: string;
  description: string;
  type: string;
  model: '58mm' | '88mm';
};
