import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tag, token } = body;

    if (!tag) {
      return NextResponse.json(
        { error: "Tag es obligatorio" },
        { status: 400 }
      );
    }

    const expectedToken = process.env.REVALIDATE_TOKEN;
    if (expectedToken && token !== expectedToken) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    revalidateTag(tag);

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      tag,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Error al revalidar el tag" },
      { status: 500 }
    );
  }
}
