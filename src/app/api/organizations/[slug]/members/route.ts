import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { JWTService } from "@/lib/utils/jwt";

function getBearerToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (auth && auth.startsWith("Bearer ")) {
    return auth.replace("Bearer ", "");
  }
  const tokenFromCookie = req.cookies.get("finanz_accessToken")?.value;
  if (tokenFromCookie) {
    return tokenFromCookie;
  }
  return null;
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const token = getBearerToken(req);
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const decodedToken = JWTService.verifyToken(token);
  if (!decodedToken) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  const supabase = createClient(cookies());
  const params = await context.params;
  const slug = params.slug;
  const { data: org, error } = await supabase
    .from("organizations")
    .select("members")
    .eq("slug", slug)
    .single();
  if (error || !org) {
    return NextResponse.json(
      { error: error?.message || "Organization not found" },
      { status: 404 }
    );
  }
  return NextResponse.json({ members: org.members || [] });
}
