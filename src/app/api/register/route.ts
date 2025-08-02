import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(cookies());
    const body = await request.json();
    const { email, password, name, surname, alias, avatar_url } = body;

    if (!email || !password || !name || !surname || !alias) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Formato de email inválido" },
        { status: 400 }
      );
    }

    const { data: emailExists } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (emailExists) {
      return NextResponse.json(
        { error: "Este email ya está registrado" },
        { status: 409 }
      );
    }

    const { data: aliasExists } = await supabase
      .from("users")
      .select("id")
      .eq("alias", alias)
      .single();

    if (aliasExists) {
      return NextResponse.json(
        { error: "Este alias ya está en uso" },
        { status: 409 }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 500 });
    }

    const { data: userData, error: userError } = await supabase
      .from("users")
      .insert([
        {
          id: authData.user?.id,
          email,
          name,
          surname,
          alias,
          avatar_url: avatar_url || null,
          password: hashedPassword,
        },
      ])
      .select()
      .single();

    if (userError) {
      await supabase.auth.admin.deleteUser(authData.user?.id || "");

      return NextResponse.json(
        { error: "Error al crear el perfil de usuario" },
        { status: 500 }
      );
    }

    const { password: hashedPass, ...userResponse } = userData;

    return NextResponse.json(
      {
        message: "Usuario registrado exitosamente",
        user: userResponse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error en registro:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
