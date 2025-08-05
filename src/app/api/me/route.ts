import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { JWTService } from "@/lib/utils/jwt";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const authHeader = request.headers.get("Authorization");
    let token = null;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      const allCookies = request.cookies.getAll();
      const accessTokenCookie = allCookies.find(
        (c) => c.name === "finanz_accessToken"
      );
      token = accessTokenCookie?.value;
    }

    if (!token) {
      return NextResponse.json(
        { error: "No hay sesión activa - Token no encontrado" },
        { status: 401 }
      );
    }

    const decodedToken = JWTService.verifyToken(token);

    if (!decodedToken) {
      return NextResponse.json(
        { error: "Sesión inválida o expirada" },
        { status: 401 }
      );
    }

    const userId = decodedToken.id;

    const { data: user } = await supabase
      .from("users")
      .select("id, email, name, surname, alias, avatar_url, created_at, jars")
      .eq("id", userId)
      .single();

    if (!user) {
      return NextResponse.json(
        { error: "Usuario no encontrado" },
        { status: 404 }
      );
    }
    if (!user.jars) {
      user.jars = [];
    }
    user.jars = user.jars.map((jar: any) => {
      if (typeof jar.saved === "number" && typeof jar.target === "number") {
        return {
          ...jar,
          isCompleted: jar.saved >= jar.target ? true : !!jar.isCompleted,
        };
      }
      return jar;
    });

    const { data: expenses } = await supabase
      .from("expenses")
      .select(
        "id, user_id, name, amount, category, date, notes, is_recurring, created_at, updated_at"
      )
      .eq("user_id", userId);

    return NextResponse.json({ user, expenses });
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const authHeader = request.headers.get("Authorization");
    let token = null;

    if (authHeader?.startsWith("Bearer ")) {
      token = authHeader.substring(7);
    } else {
      const allCookies = request.cookies.getAll();
      const accessTokenCookie = allCookies.find(
        (c) => c.name === "finanz_accessToken"
      );
      token = accessTokenCookie?.value;
    }

    if (!token) {
      return NextResponse.json(
        { error: "No hay sesión activa - Token no encontrado" },
        { status: 401 }
      );
    }

    const decodedToken = JWTService.verifyToken(token);

    if (!decodedToken) {
      return NextResponse.json(
        { error: "Sesión inválida o expirada" },
        { status: 401 }
      );
    }

    const userId = decodedToken.id;
    const requestData = await request.json();

    const { alias, password, avatarUrl, addJar, updateJar, deleteJar } =
      requestData;
    const updates: Record<string, any> = {};
    const authUpdates: Record<string, any> = {};

    if (deleteJar && typeof deleteJar === "string") {
      const { data: user } = await supabase
        .from("users")
        .select("jars")
        .eq("id", userId)
        .single();
      let jars = Array.isArray(user?.jars) ? user.jars : [];
      jars = jars.filter((jar: any) => jar.id !== deleteJar);
      updates.jars = jars;
    }

    if (alias) {
      updates.alias = alias;
    }

    if (avatarUrl) {
      updates.avatar_url = avatarUrl;
    }

    if (addJar) {
      const { data: user } = await supabase
        .from("users")
        .select("jars")
        .eq("id", userId)
        .single();
      let jars = Array.isArray(user?.jars) ? user.jars : [];
      // Normalizar isCompleted
      const normalizedAddJar = {
        ...addJar,
        isCompleted:
          typeof addJar.saved === "number" && typeof addJar.target === "number"
            ? addJar.saved >= addJar.target
            : !!addJar.isCompleted,
      };
      jars = [...jars, normalizedAddJar];
      updates.jars = jars;
    }

    if (updateJar) {
      const { data: user } = await supabase
        .from("users")
        .select("jars")
        .eq("id", userId)
        .single();
      let jars = Array.isArray(user?.jars) ? user.jars : [];
      // Normalizar isCompleted en update
      const normalizedUpdateJar = {
        ...updateJar,
        isCompleted:
          typeof updateJar.saved === "number" &&
          typeof updateJar.target === "number"
            ? updateJar.saved >= updateJar.target
            : !!updateJar.isCompleted,
      };
      jars = jars.map((jar) =>
        jar.id === updateJar.id ? normalizedUpdateJar : jar
      );
      updates.jars = jars;
    }

    if (password) {
      authUpdates.password = password;
    }

    let userUpdateError = null;
    let passwordUpdateError = null;

    if (Object.keys(updates).length > 0) {
      const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", userId);

      if (error) {
        userUpdateError = error;
      }
    }

    if (password) {
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) {
        passwordUpdateError = error;
      }
    }

    if (userUpdateError || passwordUpdateError) {
      return NextResponse.json(
        {
          error: "Error al actualizar el perfil",
          userError: userUpdateError?.message,
          passwordError: passwordUpdateError?.message,
        },
        { status: 400 }
      );
    }

    const { data: updatedUser } = await supabase
      .from("users")
      .select("id, email, name, surname, alias, avatar_url, created_at, jars")
      .eq("id", userId)
      .single();

    return NextResponse.json({
      user: updatedUser,
      message: "Perfil actualizado correctamente",
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
