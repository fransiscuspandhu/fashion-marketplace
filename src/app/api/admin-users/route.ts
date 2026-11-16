import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const adminStaff = await prisma.adminStaffUser.findMany({
      where: { isActive: true },
      orderBy: { staffCode: "asc" },
    });
    return NextResponse.json({ success: true, data: adminStaff });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, fullName, role, department, phone, avatarUrl } = body;

    if (!email || !fullName || !role) {
      return NextResponse.json({ success: false, error: "Email, Nama, dan Role wajib diisi" }, { status: 400 });
    }

    const count = await prisma.adminStaffUser.count();
    const staffCode = `ADM-${(count + 1).toString().padStart(3, "0")}`;

    const newStaff = await prisma.adminStaffUser.create({
      data: {
        staffCode,
        email,
        fullName,
        role,
        department: department || "Operasional Toko",
        phone,
        avatarUrl,
        lastLogin: new Date(),
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, data: newStaff }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
