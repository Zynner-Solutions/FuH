import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { JWTService } from "@/lib/utils/jwt";

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient(cookies());
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = JWTService.verifyToken(token);

    if (!decodedToken) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const userId = decodedToken.id;
    const url = new URL(request.url);
    const expenseId = url.searchParams.get("id");

    let query = supabase.from("expenses").select("*").eq("user_id", userId);

    if (expenseId) {
      query = query.eq("id", expenseId);
    }

    const { data: expenses, error } = await query;

    if (error) {
      console.error("Error al obtener gastos:", error);
      return NextResponse.json(
        { error: "Error al obtener los gastos" },
        { status: 500 }
      );
    }

    return NextResponse.json({ expenses });
  } catch (error) {
    console.error("Error en GET expenses:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(cookies());
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = JWTService.verifyToken(token);

    if (!decodedToken) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const body = await request.json();
    const { name, amount, category, date, notes, is_recurring } = body;

    if (!name || !amount || !category) {
      return NextResponse.json(
        { error: "Name, amount and category are required" },
        { status: 400 }
      );
    }

    const userId = decodedToken.id;
    const expenseDate = date || new Date().toISOString();

    const { data: expense, error } = await supabase
      .from("expenses")
      .insert({
        name,
        amount,
        category,
        date: expenseDate,
        notes: notes || null,
        is_recurring: is_recurring || false,
        user_id: userId,
      })
      .select()
      .single();

    if (error) {
      console.error("Error al crear gasto:", error);
      return NextResponse.json(
        { error: "Error al crear el gasto" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Gasto creado exitosamente",
      expense,
    });
  } catch (error) {
    console.error("Error en POST expenses:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient(cookies());
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = JWTService.verifyToken(token);

    if (!decodedToken) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const userId = decodedToken.id;
    const body = await request.json();
    const { id, name, amount, category, date, notes, is_recurring } = body;

    if (!id) {
      return NextResponse.json(
        { error: "Expense ID is required" },
        { status: 400 }
      );
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (amount !== undefined) updateData.amount = amount;
    if (category !== undefined) updateData.category = category;
    if (date !== undefined) updateData.date = date;
    if (notes !== undefined) updateData.notes = notes;
    if (is_recurring !== undefined) updateData.is_recurring = is_recurring;

    const { data: expense, error } = await supabase
      .from("expenses")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single();

    if (error) {
      console.error("Error al actualizar gasto:", error);
      return NextResponse.json(
        { error: "Error al actualizar el gasto" },
        { status: 500 }
      );
    }

    if (!expense) {
      return NextResponse.json(
        { error: "Gasto no encontrado o no pertenece al usuario" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Gasto actualizado exitosamente",
      expense,
    });
  } catch (error) {
    console.error("Error en PATCH expenses:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createClient(cookies());
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const token = authHeader.substring(7);
    const decodedToken = JWTService.verifyToken(token);

    if (!decodedToken) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 });
    }

    const userId = decodedToken.id;
    const url = new URL(request.url);
    const expenseId = url.searchParams.get("id");

    if (!expenseId) {
      return NextResponse.json(
        { error: "ID del gasto es obligatorio" },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("expenses")
      .delete()
      .eq("id", expenseId)
      .eq("user_id", userId);

    if (error) {
      console.error("Error al eliminar gasto:", error);
      return NextResponse.json(
        { error: "Error al eliminar el gasto" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Gasto eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error en DELETE expenses:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
