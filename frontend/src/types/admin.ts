export type Admin = {
  id: number;
  name: string;
  email: string;
  role: string;
  country: string;
  status: "Active" | "Pending";
  joined: string;
  initials: string;
  color: string;
};

export type Country = {
  id: number;
  name: string;
  code: string;
  region: string;
  status: "Active" | "Setup";
  admins: number;
  flag: string;
};

export type Activity = {
  id: number;
  name: string;
  initials: string;
  color: string;
  action: string;
  target: string;
  time: string;
  category: "Admin" | "Country" | "Settings";
};

export type WorkspaceSettings = { email: boolean; weekly: boolean; security: boolean };
export type Profile = { name: string; email: string };

export type TopupSystem = {
  id: string;
  name: string;
  country: string;
  status: "Active" | "Setup";
  contactName: string;
  contactEmail: string;
  created: string;
  accent: string;
};

export type SystemRetailer = {
  id: number;
  systemId: string;
  shopName: string;
  location: string;
  sales: number;
  status: "Active" | "Pending";
};

export type SystemProduct = { id: number; name: string; sku: string; category: string; price: number; stock: number; status: "Available" | "Low stock" };
export type SystemSale = { id: number; reference: string; retailer: string; product: string; amount: number; time: string; status: "Completed" | "Pending" };
