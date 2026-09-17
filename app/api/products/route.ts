import { NextResponse } from "next/server";
import { getCmsProducts } from "@/lib/cms/products";

export async function GET() {
  try {
    return NextResponse.json((await getCmsProducts()).filter((product) => product.isActive));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load products" }, { status: 500 });
  }
}
