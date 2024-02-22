export interface SpaceTable {
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
  type: 'KITCHEN' | 'CASHIER' ;
  model: 'F58MM' | 'F80MM';
};
