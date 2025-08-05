import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { JWTService } from "@/lib/utils/jwt";

function slugify(text: string) {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getBearerToken(req: NextRequest): string | null {
  const auth = req.headers.get("authorization");
  if (auth && auth.startsWith("Bearer ")) {
    return auth.replace("Bearer ", "");
  }
  return null;
}

export async function GET(req: NextRequest) {
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

  const { data, error } = await supabase
    .from("organizations")
    .select("*")
    .or(`leader_id.eq.${userId},members.cs.{\"${userId}\":true}`)
    .order("created_at", { ascending: false });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ organizations: data });
}

export async function POST(req: NextRequest) {
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

  const body = await req.json();
  const { name, description, members } = body;
  const slug = slugify(name);
  const { data, error } = await supabase
    .from("organizations")
    .insert([
      {
        name,
        description,
        leader_id: userId,
        members: members || [],
        slug,
      },
    ])
    .select()
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ organization: data });
}

export async function PATCH(req: NextRequest) {
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

  const body = await req.json();
  const { id, name, description, members } = body;
  const { data, error } = await supabase
    .from("organizations")
    .update({ name, description, members })
    .eq("id", id)
    .eq("leader_id", userId)
    .select()
    .single();
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ organization: data });
}

export async function DELETE(req: NextRequest) {
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

  const { id } = await req.json();
  const { error } = await supabase
    .from("organizations")
    .delete()
    .eq("id", id)
    .eq("leader_id", userId);
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
