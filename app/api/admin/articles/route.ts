import { NextResponse } from "next/server";
import { requireAdminUser } from "@/lib/cms/auth";
import { createCmsArticle, getCmsArticles } from "@/lib/cms/articles";

export async function GET() {
  const user = await requireAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    return NextResponse.json(await getCmsArticles({ includeUnpublished: true }));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load articles" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const user = await requireAdminUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    return NextResponse.json(await createCmsArticle(await request.json()), { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create article" }, { status: 400 });
  }
}
