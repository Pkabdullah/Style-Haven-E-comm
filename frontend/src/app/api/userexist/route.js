import dbconnect from "@/utils/dbconnnect"
import { UserSignup } from "@/utils/models";
import { NextResponse } from "next/server";

export async function POST(request){
try {
    await dbconnect();
    const {Email} = await request.json();
    const user =  await  UserSignup.findOne({Email}).select("_id")
    return NextResponse.json({user})

    
} catch (error) {
    console.log(error)
}
}