import { UserSignup } from "@/utils/models";
import dbconnect from "@/utils/dbconnnect";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
export async function POST(request) {
  await dbconnect();
  const { FullName, Email, Password } = await request.json();
  try {
    const hashedpassword = await bcrypt.hash(Password, 10);
    let user = new UserSignup({ FullName, Email, Password: hashedpassword });
    await user.save();
    console.log("datasss", user._id);
    return NextResponse.json(
      { userId: user._id, FullName: user.FullName, Email: user.Email },
      { status: 201 }
    );
  } catch (error) {
    console.log;
  }
}
export async function GET() {
  await dbconnect();
  let data = await UserSignup.find();
  console.log("login data", data);
  return NextResponse.json({ result: data, success: true }, { status: 200 });
}
