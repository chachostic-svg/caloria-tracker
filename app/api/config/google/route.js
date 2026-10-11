import { NextResponse } from "next/server";
import {
  getGoogleClientId,
  getGoogleClientSecret,
  isGoogleConfigured,
} from "@/lib/googleConfig";

export async function GET() {
  const clientId = getGoogleClientId();
  return NextResponse.json({
    configured: isGoogleConfigured(),
    clientId: clientId || null,
    hasSecret: Boolean(getGoogleClientSecret()),
  });
}
