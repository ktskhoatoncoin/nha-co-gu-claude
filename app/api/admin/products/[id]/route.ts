import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/cms/auth";
import { deleteCmsProduct, getCmsProduct, updateCmsProduct } from "@/lib/cms/products";

export async function GET(_request: Request, context: RouteContext<"/api/admin/products/[id]">) {
  const user = await requireAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;

  try {
    const product = await getCmsProduct(id);
    return product ? NextResponse.json(product) : NextResponse.json({ error: "Not found" }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load product" }, { status: 500 });
  }
}

export async function PUT(request: Request, context: RouteContext<"/api/admin/products/[id]">) {
  const user = await requireAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;

  try {
    return NextResponse.json(await updateCmsProduct(id, await request.json()));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update product" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext<"/api/admin/products/[id]">) {
  const user = await requireAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;

  try {
    await deleteCmsProduct(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to delete product" }, { status: 400 });
  }
}
