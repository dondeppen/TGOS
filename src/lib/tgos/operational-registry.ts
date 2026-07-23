export type RegistryStatus = "active" | "attention" | "planned" | "inactive";

export type RegistryContact = {
  id: string;
  name: string;
  role: string;
  phone: string;
  email: string;
  preferredChannel: "phone" | "email" | "text";
  authorization: string[];
};

export type RegistryAsset = {
  id: string;
  locationId: string;
  manufacturer: string;
  model: string;
  serialNumber: string;
  assetTag: string;
  category: string;
  status: RegistryStatus;
  ipAddress?: string;
  firmware?: string;
  meterCount?: number;
  healthScore: number;
  risk: "low" | "medium" | "high";
  nextAction: string;
};

export type RegistryLocation = {
  id: string;
  customerId: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  onsiteContactId: string;
  businessHours: string;
  accessInstructions: string;
  travelMinutes: number;
  status: RegistryStatus;
};

export type RegistryCustomer = {
  id: string;
  name: string;
  status: RegistryStatus;
  accountOwner: string;
  primaryContactId: string;
  billingTerms: string;
  contract: string;
  lifetimeRevenue: number;
  openBalance: number;
  healthScore: number;
  notes: string;
};

export const registryContacts: RegistryContact[] = [
  {
    id: "contact-melanie",
    name: "Melanie",
    role: "Project Coordinator",
    phone: "On file",
    email: "On file",
    preferredChannel: "email",
    authorization: ["Schedule service", "Approve field work"],
  },
  {
    id: "contact-karschner",
    name: "Karschner Office Contact",
    role: "Site Contact",
    phone: "On file",
    email: "On file",
    preferredChannel: "phone",
    authorization: ["Approve onsite service"],
  },
  {
    id: "contact-arxada",
    name: "Arxada Plant Contact",
    role: "Operations Contact",
    phone: "On file",
    email: "On file",
    preferredChannel: "email",
    authorization: ["Open service calls", "Approve repairs"],
  },
];

export const registryCustomers: RegistryCustomer[] = [
  {
    id: "customer-reliasource",
    name: "ReliaSource",
    status: "active",
    accountOwner: "Don Deppen",
    primaryContactId: "contact-melanie",
    billingTerms: "Direct payment / project terms",
    contract: "Project-based field services",
    lifetimeRevenue: 400,
    openBalance: 400,
    healthScore: 88,
    notes: "Recurring regional deployment opportunities.",
  },
  {
    id: "customer-karschner",
    name: "Karschner Insurance",
    status: "active",
    accountOwner: "Don Deppen",
    primaryContactId: "contact-karschner",
    billingTerms: "Standard customer terms",
    contract: "Equipment sales and service",
    lifetimeRevenue: 0,
    openBalance: 0,
    healthScore: 96,
    notes: "Canon imageRUNNER customer with ongoing support history.",
  },
  {
    id: "customer-arxada",
    name: "Arxada",
    status: "active",
    accountOwner: "Don Deppen",
    primaryContactId: "contact-arxada",
    billingTerms: "Net 60",
    contract: "Managed parts and labor agreement",
    lifetimeRevenue: 0,
    openBalance: 0,
    healthScore: 94,
    notes: "Long-term industrial customer with printer and technology assets.",
  },
];

export const registryLocations: RegistryLocation[] = [
  {
    id: "location-ssa-williamsport",
    customerId: "customer-reliasource",
    name: "SSA Williamsport",
    address: "Federal office site",
    city: "Williamsport",
    state: "PA",
    postalCode: "17701",
    onsiteContactId: "contact-melanie",
    businessHours: "Public access begins 9:00 AM",
    accessInstructions: "Coordinate arrival and security access before service.",
    travelMinutes: 15,
    status: "active",
  },
  {
    id: "location-karschner-coudersport",
    customerId: "customer-karschner",
    name: "Karschner Insurance - Coudersport",
    address: "Customer office",
    city: "Coudersport",
    state: "PA",
    postalCode: "16915",
    onsiteContactId: "contact-karschner",
    businessHours: "Business hours",
    accessInstructions: "Confirm office availability before travel.",
    travelMinutes: 90,
    status: "active",
  },
  {
    id: "location-arxada-plant",
    customerId: "customer-arxada",
    name: "Arxada Plant",
    address: "Industrial facility",
    city: "Williamsport",
    state: "PA",
    postalCode: "17701",
    onsiteContactId: "contact-arxada",
    businessHours: "Plant schedule",
    accessInstructions: "Follow plant safety and security procedures.",
    travelMinutes: 20,
    status: "active",
  },
];

export const registryAssets: RegistryAsset[] = [
  {
    id: "asset-xerox-c9000-01",
    locationId: "location-arxada-plant",
    manufacturer: "Xerox",
    model: "VersaLink C9000",
    serialNumber: "TGOS-DEMO-9000",
    assetTag: "ARX-C9000-01",
    category: "Production printer",
    status: "attention",
    firmware: "Review required",
    meterCount: 0,
    healthScore: 72,
    risk: "high",
    nextAction: "Inspect drum life, paper conditions, and current print defects.",
  },
  {
    id: "asset-canon-529if-01",
    locationId: "location-karschner-coudersport",
    manufacturer: "Canon",
    model: "imageRUNNER ADVANCE DX 529iF",
    serialNumber: "ON-FILE",
    assetTag: "KAR-CANON-01",
    category: "Multifunction printer",
    status: "active",
    ipAddress: "On file",
    firmware: "Verified during service",
    meterCount: 0,
    healthScore: 93,
    risk: "low",
    nextAction: "Continue scanning support and maintain configuration history.",
  },
  {
    id: "asset-mp508-01",
    locationId: "location-ssa-williamsport",
    manufacturer: "AudioCodes",
    model: "MP-508",
    serialNumber: "Pending installation",
    assetTag: "SSA-MP508-01",
    category: "Voice gateway",
    status: "planned",
    healthScore: 100,
    risk: "low",
    nextAction: "Complete installation, configuration, testing, and documentation.",
  },
];

export function buildOperationalRegistry() {
  const customers = registryCustomers.map((customer) => {
    const locations = registryLocations.filter((location) => location.customerId === customer.id);
    const locationIds = new Set(locations.map((location) => location.id));
    const assets = registryAssets.filter((asset) => locationIds.has(asset.locationId));
    const primaryContact = registryContacts.find((contact) => contact.id === customer.primaryContactId);

    return { customer, primaryContact, locations, assets };
  });

  return {
    customers,
    summary: {
      customers: registryCustomers.length,
      locations: registryLocations.length,
      assets: registryAssets.length,
      contacts: registryContacts.length,
      assetsNeedingAttention: registryAssets.filter((asset) => asset.status === "attention").length,
      averageAssetHealth: Math.round(
        registryAssets.reduce((total, asset) => total + asset.healthScore, 0) /
          Math.max(registryAssets.length, 1),
      ),
    },
  };
}
