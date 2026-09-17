import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/cms/auth";
import { createCmsProduct, getCmsProducts } from "@/lib/cms/products";

export async function GET() {
  const user = await requireAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    return NextResponse.json(await getCmsProducts());
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await requireAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const product = await createCmsProduct(await request.json());
    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create product" }, { status: 400 });
  }
}
