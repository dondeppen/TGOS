import { NextResponse } from "next/server";

import { buildOperationalIntelligence } from "@/lib/tgos/operational-intelligence";
import {
  seedEntities,
  seedEvents,
  seedRelationships,
} from "@/lib/tgos/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = buildOperationalIntelligence(seedEvents, {
    entities: seedEntities,
    relationships: seedRelationships,
  });

  return NextResponse.json(
    {
      status: "ok",
      version: "0.3",
      intelligence: snapshot,
    },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
