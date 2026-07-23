import {
  registryAssets,
  registryContacts,
  registryCustomers,
  registryLocations,
  type RegistryStatus,
} from "@/lib/tgos/operational-registry";

export type TgosObjectType = "customer" | "location" | "asset" | "contact";

export type TgosObjectRelationship = {
  objectId: string;
  type: TgosObjectType;
  label: string;
  relationship: string;
};

export type TgosObject = {
  id: string;
  type: TgosObjectType;
  label: string;
  subtitle: string;
  status: RegistryStatus;
  healthScore: number;
  summary: string;
  capabilities: string[];
  relationships: TgosObjectRelationship[];
  recommendations: string[];
};

const universalCapabilities = [
  "Profile",
  "Timeline",
  "Relationships",
  "Activity",
  "Notes",
  "Documents",
  "Photos",
  "AI Summary",
  "Health",
  "Recommendations",
];

export function buildTgosObjects(): TgosObject[] {
  const customers: TgosObject[] = registryCustomers.map((customer) => {
    const locations = registryLocations.filter((location) => location.customerId === customer.id);
    const locationIds = new Set(locations.map((location) => location.id));
    const assets = registryAssets.filter((asset) => locationIds.has(asset.locationId));

    return {
      id: customer.id,
      type: "customer",
      label: customer.name,
      subtitle: customer.contract,
      status: customer.status,
      healthScore: customer.healthScore,
      summary: `${locations.length} location${locations.length === 1 ? "" : "s"}, ${assets.length} asset${assets.length === 1 ? "" : "s"}, and ${customer.billingTerms} billing terms.`,
      capabilities: universalCapabilities,
      relationships: [
        ...locations.map((location) => ({
          objectId: location.id,
          type: "location" as const,
          label: location.name,
          relationship: "operates",
        })),
        ...assets.map((asset) => ({
          objectId: asset.id,
          type: "asset" as const,
          label: `${asset.manufacturer} ${asset.model}`,
          relationship: "owns",
        })),
      ],
      recommendations: assets
        .filter((asset) => asset.status === "attention")
        .map((asset) => asset.nextAction),
    };
  });

  const locations: TgosObject[] = registryLocations.map((location) => {
    const customer = registryCustomers.find((item) => item.id === location.customerId);
    const assets = registryAssets.filter((asset) => asset.locationId === location.id);
    const averageHealth = assets.length
      ? Math.round(assets.reduce((total, asset) => total + asset.healthScore, 0) / assets.length)
      : 100;

    return {
      id: location.id,
      type: "location",
      label: location.name,
      subtitle: `${location.city}, ${location.state}`,
      status: location.status,
      healthScore: averageHealth,
      summary: `${assets.length} registered asset${assets.length === 1 ? "" : "s"}. ${location.accessInstructions}`,
      capabilities: universalCapabilities,
      relationships: [
        ...(customer
          ? [{ objectId: customer.id, type: "customer" as const, label: customer.name, relationship: "belongs to" }]
          : []),
        ...assets.map((asset) => ({
          objectId: asset.id,
          type: "asset" as const,
          label: `${asset.manufacturer} ${asset.model}`,
          relationship: "contains",
        })),
      ],
      recommendations: assets.filter((asset) => asset.status === "attention").map((asset) => asset.nextAction),
    };
  });

  const assets: TgosObject[] = registryAssets.map((asset) => {
    const location = registryLocations.find((item) => item.id === asset.locationId);

    return {
      id: asset.id,
      type: "asset",
      label: `${asset.manufacturer} ${asset.model}`,
      subtitle: `${asset.category} · ${asset.assetTag}`,
      status: asset.status,
      healthScore: asset.healthScore,
      summary: `Risk ${asset.risk}. Serial ${asset.serialNumber}. ${asset.nextAction}`,
      capabilities: [...universalCapabilities, "Digital Twin", "Repair DNA", "Configuration", "Investigate"],
      relationships: location
        ? [{ objectId: location.id, type: "location", label: location.name, relationship: "installed at" }]
        : [],
      recommendations: [asset.nextAction],
    };
  });

  const contacts: TgosObject[] = registryContacts.map((contact) => ({
    id: contact.id,
    type: "contact",
    label: contact.name,
    subtitle: contact.role,
    status: "active",
    healthScore: 100,
    summary: `Prefers ${contact.preferredChannel}. Authorized to ${contact.authorization.join(" and ").toLowerCase()}.`,
    capabilities: universalCapabilities,
    relationships: registryCustomers
      .filter((customer) => customer.primaryContactId === contact.id)
      .map((customer) => ({
        objectId: customer.id,
        type: "customer" as const,
        label: customer.name,
        relationship: "primary contact for",
      })),
    recommendations: [],
  }));

  return [...customers, ...locations, ...assets, ...contacts];
}

export function getObjectFrameworkSummary() {
  const objects = buildTgosObjects();

  return {
    totalObjects: objects.length,
    relationships: objects.reduce((total, object) => total + object.relationships.length, 0),
    attentionObjects: objects.filter((object) => object.status === "attention").length,
    objectTypes: new Set(objects.map((object) => object.type)).size,
  };
}
