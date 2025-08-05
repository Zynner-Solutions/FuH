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

  const userId = decodedToken.id;

  const supabase = createClient(cookies());

  const params = await context.params;

  const slug = params.slug;

  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: error?.message || "Not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ organization: data });
}

export async function POST(
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

  const body = await req.json();
  const { nombre, apellido, payments } = body;

  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .select("members")
    .eq("slug", slug)
    .single();

  if (orgError || !org) {
    return NextResponse.json(
      { error: orgError?.message || "Organization not found" },
      { status: 404 }
    );
  }

  const newMember = { nombre, apellido, payments };
  const updatedMembers = Array.isArray(org.members)
    ? [...org.members, newMember]
    : [newMember];

  const { data, error } = await supabase
    .from("organizations")
    .update({ members: updatedMembers })
    .eq("slug", slug)
    .select("members")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ member: newMember, members: data.members });
}

export async function PATCH(
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

  const body = await req.json();
  const { index, nombre, apellido, payments } = body;

  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .select("members")
    .eq("slug", slug)
    .single();

  if (orgError || !org) {
    return NextResponse.json(
      { error: orgError?.message || "Organization not found" },
      { status: 404 }
    );
  }

  if (
    !Array.isArray(org.members) ||
    typeof index !== "number" ||
    index < 0 ||
    index >= org.members.length
  ) {
    return NextResponse.json(
      { error: "Invalid member index" },
      { status: 400 }
    );
  }

  const updatedMember = { ...org.members[index], nombre, apellido, payments };
  const updatedMembers = org.members.map((m: any, i: number) =>
    i === index ? updatedMember : m
  );

  const { data, error } = await supabase
    .from("organizations")
    .update({ members: updatedMembers })
    .eq("slug", slug)
    .select("members")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ member: updatedMember, members: data.members });
}

export async function DELETE(
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

  const body = await req.json();
  const { index } = body;

  const { data: org, error: orgError } = await supabase
    .from("organizations")
    .select("members")
    .eq("slug", slug)
    .single();

  if (orgError || !org) {
    return NextResponse.json(
      { error: orgError?.message || "Organization not found" },
      { status: 404 }
    );
  }

  if (
    !Array.isArray(org.members) ||
    typeof index !== "number" ||
    index < 0 ||
    index >= org.members.length
  ) {
    return NextResponse.json(
      { error: "Invalid member index" },
      { status: 400 }
    );
  }

  const removedMember = org.members[index];
  const updatedMembers = org.members.filter((_: any, i: number) => i !== index);

  const { data, error } = await supabase
    .from("organizations")
    .update({ members: updatedMembers })
    .eq("slug", slug)
    .select("members")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ removed: removedMember, members: data.members });
}
