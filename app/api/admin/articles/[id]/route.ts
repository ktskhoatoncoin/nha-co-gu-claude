import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/cms/auth";
import { deleteCmsArticle, updateCmsArticle } from "@/lib/cms/articles";

export async function PUT(request: Request, context: RouteContext<"/api/admin/articles/[id]">) {
  const user = await requireAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;

  try {
    return NextResponse.json(await updateCmsArticle(id, await request.json()));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update article" }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: RouteContext<"/api/admin/articles/[id]">) {
  const user = await requireAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await context.params;

  try {
    await deleteCmsArticle(id);
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to delete article" }, { status: 400 });
  }
}
