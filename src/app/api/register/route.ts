import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { signJwt } from "@/lib/jwt";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password required" },
      { status: 400 }
    );
  }

  // E-posta zaten var mı?
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    return NextResponse.json(
      { message: "Email already registered" },
      { status: 409 }
    );
  }

  // Kullanıcı oluştur
  const hashed = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, hashedPassword: hashed },
    select: { id: true, email: true },
  });

  // JWT + cookie
  const token = signJwt({ sub: user.id, email: user.email });
  const res = NextResponse.json({ user }, { status: 201 });
  res.cookies.set("token", token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 gün
  });

  return res;
}
