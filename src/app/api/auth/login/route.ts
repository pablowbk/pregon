import { NextResponse } from "next/server";
import { verifyPassword, createAuthSession } from "@/lib/auth";

export async function POST(request: Request) {
  console.log("en el route");
  try {
    const { password } = await request.json();

    if (!password) {
      return NextResponse.json(
        { error: "La contraseña es requerida" },
        { status: 400 }
      );
    }

    console.log("apunto de verificar la contraseña");

    if (!verifyPassword(password)) {
      return NextResponse.json(
        { error: "Contraseña incorrecta" },
        { status: 401 }
      );
    }

    await createAuthSession();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    );
  }
}
