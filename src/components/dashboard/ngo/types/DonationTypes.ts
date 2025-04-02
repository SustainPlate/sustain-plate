
export type Donation = {
  id: string;
  food_name: string;
  quantity: number;
  unit: string;
  expiry_date: string;
  status: string;
  created_at: string;
  pickup_address: string;
  description: string | null;
};
