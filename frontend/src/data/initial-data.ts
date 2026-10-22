import type { Activity, Admin, Country, Profile, SystemProduct, SystemRetailer, SystemSale, TopupSystem, WorkspaceSettings } from "@/types/admin";

export const initialAdmins: Admin[] = [
  { id: 1, name: "Olivia Rhye", email: "olivia@countryadmin.io", role: "Super Admin", country: "United States", status: "Active", joined: "Oct 12, 2024", initials: "OR", color: "#8b6de8" },
  { id: 2, name: "Phoenix Baker", email: "phoenix@countryadmin.io", role: "Country Admin", country: "United Kingdom", status: "Active", joined: "Oct 10, 2024", initials: "PB", color: "#e79b59" },
  { id: 3, name: "Lana Steiner", email: "lana@countryadmin.io", role: "Country Admin", country: "Canada", status: "Active", joined: "Oct 08, 2024", initials: "LS", color: "#d875a3" },
  { id: 4, name: "Demi Wilkinson", email: "demi@countryadmin.io", role: "Editor", country: "Australia", status: "Pending", joined: "Oct 05, 2024", initials: "DW", color: "#39977b" },
  { id: 5, name: "Candice Wu", email: "candice@countryadmin.io", role: "Country Admin", country: "Singapore", status: "Active", joined: "Oct 02, 2024", initials: "CW", color: "#567aca" },
];

export const initialCountries: Country[] = [
  { id: 1, name: "United States", code: "US", region: "North America", status: "Active", admins: 12, flag: "🇺🇸" },
  { id: 2, name: "United Kingdom", code: "GB", region: "Europe", status: "Active", admins: 8, flag: "🇬🇧" },
  { id: 3, name: "Canada", code: "CA", region: "North America", status: "Active", admins: 6, flag: "🇨🇦" },
  { id: 4, name: "Australia", code: "AU", region: "Asia Pacific", status: "Active", admins: 5, flag: "🇦🇺" },
  { id: 5, name: "Singapore", code: "SG", region: "Asia Pacific", status: "Inactive", admins: 3, flag: "🇸🇬" },
  { id: 6, name: "Sri Lanka", code: "LK", region: "Asia Pacific", status: "Active", admins: 4, flag: "🇱🇰" },
  { id: 7, name: "Germany", code: "DE", region: "Europe", status: "Active", admins: 7, flag: "🇩🇪" },
  { id: 8, name: "Japan", code: "JP", region: "Asia Pacific", status: "Inactive", admins: 2, flag: "🇯🇵" },
];

export const initialActivity: Activity[] = [
  { id: 8, name: "Olivia Rhye", initials: "OR", color: "#8b6de8", action: "added a top-up admin", target: "Harbor Connect E-PIN", time: "Yesterday, 11:20 AM", category: "Admin" },
  { id: 7, name: "Olivia Rhye", initials: "OR", color: "#8b6de8", action: "added a top-up admin", target: "Northstar Reload", time: "Yesterday, 10:45 AM", category: "Admin" },
  { id: 6, name: "Olivia Rhye", initials: "OR", color: "#8b6de8", action: "added a top-up admin", target: "Apex Digital Top-up", time: "Yesterday, 9:30 AM", category: "Admin" },
  { id: 1, name: "Phoenix Baker", initials: "PB", color: "#e79b59", action: "added a new country admin to", target: "United Kingdom", time: "10 minutes ago", category: "Admin" },
  { id: 2, name: "Lana Steiner", initials: "LS", color: "#d875a3", action: "updated country settings for", target: "Canada", time: "1 hour ago", category: "Country" },
  { id: 3, name: "Olivia Rhye", initials: "OR", color: "#8b6de8", action: "invited 3 new admins to", target: "World Admin", time: "Yesterday, 4:32 PM", category: "Admin" },
  { id: 4, name: "Candice Wu", initials: "CW", color: "#567aca", action: "updated workspace preferences", target: "Notifications", time: "Yesterday, 2:15 PM", category: "Settings" },
];

export const initialProfile: Profile = { name: "Olivia Rhye", email: "olivia@countryadmin.io" };
export const initialSettings: WorkspaceSettings = { email: true, weekly: false, security: true };
export const initialTopupSystems: TopupSystem[] = [
  { id: "nsol", name: "NSOL E-PIN", country: "Sri Lanka", status: "Active", contactName: "Nsol Operations", contactEmail: "operations@nsol.example", created: "Jan 12, 2024", accent: "#7762c8" },
  { id: "apex-digital", name: "Apex Digital Top-up", country: "United Kingdom", status: "Active", contactName: "Apex Operations", contactEmail: "ops@apexdigital.example", created: "Mar 08, 2025", accent: "#4f86cf" },
  { id: "northstar-reload", name: "Northstar Reload", country: "Canada", status: "Active", contactName: "Jordan Mitchell", contactEmail: "jordan@northstar.example", created: "Jun 17, 2025", accent: "#46a181" },
  { id: "harbor-connect", name: "Harbor Connect E-PIN", country: "Australia", status: "Inactive", contactName: "Mia Thompson", contactEmail: "mia@harborconnect.example", created: "Feb 02, 2026", accent: "#d68a4d" },
];

export const initialSystemRetailers: SystemRetailer[] = [
  { id: 201, systemId: "nsol", shopName: "Lakeside Mobile", location: "Colombo", sales: 128450, status: "Active" },
  { id: 202, systemId: "nsol", shopName: "CityLink Communications", location: "Kandy", sales: 96700, status: "Active" },
  { id: 203, systemId: "nsol", shopName: "QuickTop Galle", location: "Galle", sales: 63400, status: "Active" },
  { id: 204, systemId: "nsol", shopName: "Metro Reloads", location: "Negombo", sales: 42150, status: "Active" },
  { id: 205, systemId: "nsol", shopName: "Hill Country Telecom", location: "Nuwara Eliya", sales: 28900, status: "Pending" },
];

export const initialSystemProducts: SystemProduct[] = [
  { id: 301, name: "NSOL Reload 500", sku: "NSL-500", category: "Mobile reload", price: 500, stock: 820, status: "Available" },
  { id: 302, name: "NSOL Reload 1,000", sku: "NSL-1000", category: "Mobile reload", price: 1000, stock: 476, status: "Available" },
  { id: 303, name: "NSOL Data Pack 30GB", sku: "NSD-30", category: "Data bundles", price: 1890, stock: 34, status: "Low stock" },
  { id: 304, name: "NSOL Data Pack 60GB", sku: "NSD-60", category: "Data bundles", price: 3490, stock: 112, status: "Available" },
  { id: 305, name: "NSOL Voice & SMS Pack", sku: "NSV-01", category: "Voice & SMS", price: 720, stock: 305, status: "Available" },
  { id: 306, name: "Game PIN 1,000", sku: "NSG-1000", category: "Gaming PINs", price: 1000, stock: 142, status: "Available" },
  { id: 307, name: "Digital Gift Card 2,500", sku: "NSGFT-2500", category: "Gift cards", price: 2500, stock: 68, status: "Available" },
  { id: 308, name: "Utility Payment PIN", sku: "NSU-01", category: "Utility payments", price: 1500, stock: 94, status: "Available" },
];

export const initialSystemSales: SystemSale[] = [
  { id: 401, reference: "NS-008421", retailer: "Lakeside Mobile", product: "NSOL Reload 1,000", amount: 1000, time: "Today, 10:42 AM", status: "Completed" },
  { id: 402, reference: "NS-008420", retailer: "CityLink Communications", product: "NSOL Data Pack 30GB", amount: 1890, time: "Today, 10:18 AM", status: "Completed" },
  { id: 403, reference: "NS-008419", retailer: "QuickTop Galle", product: "NSOL Reload 500", amount: 500, time: "Today, 9:56 AM", status: "Pending" },
  { id: 404, reference: "NS-008418", retailer: "Metro Reloads", product: "NSOL Reload 1,000", amount: 1000, time: "Today, 9:31 AM", status: "Completed" },
];
