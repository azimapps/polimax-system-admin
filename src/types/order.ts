
// ----------------------------------------------------------------------

export enum OrderMaterial {
  BOPP = 'bopp',
  CPP = 'cpp',
  PE = 'pe',
  PET = 'pet',
}

export enum OrderSubMaterial {
  PRAZRACHNIY = 'prazrachniy',
  METAL = 'metal',
  JEMCHUK = 'jemchuk',
  JEMCHUK_METAL = 'jemchuk_metal',
  BELIY = 'beliy',
}

export enum OrderStatus {
  IN_PROGRESS = 'in_progress',
  FINISHED = 'finished',
}

export enum OrderVtulka {
  V76 = '76',
  V152 = '152',
}

export enum OrderNapravlenie {
  TYPE_1 = 'type_1',
  TYPE_2 = 'type_2',
  TYPE_3 = 'type_3',
  TYPE_4 = 'type_4',
}

export enum OrderCurrency {
  UZS = 'uzs',
  USD = 'usd',
  RUB = 'rub',
  EUR = 'eur',
}

export type Order = {
  id: number;
  version: number;
  order_number: string;
  date: string;
  title: string;
  client_id: number;
  quantity_kg: number;
  material: OrderMaterial;
  sub_material: OrderSubMaterial;
  film_thickness: number;
  film_width: number;
  cylinder_length: number;
  cylinder_count: number;
  cylinder_aylanasi: number;
  start_date: string;
  end_date: string;
  price_per_kg: number;
  price_currency: OrderCurrency;
  manager_id: number;
  status: OrderStatus;
  vtulka: OrderVtulka;
  napravlenie: OrderNapravlenie;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  archived_at: string | null;
  created_by: number;
  archived_by: number | null;
  previous_id: number | null;
};

export type OrderListItem = Order;

export type CreateOrderRequest = Omit<Order, 'id' | 'version' | 'created_at' | 'updated_at' | 'deleted_at' | 'archived_at' | 'created_by' | 'archived_by' | 'previous_id'>;

export type UpdateOrderRequest = Partial<CreateOrderRequest>;

export type ArchivedOrderListItem = {
  id: number;
  order_number: string;
  title: string;
  deleted_at: string;
  archived_at: string;
  created_by: number;
  archived_by: number;
};
