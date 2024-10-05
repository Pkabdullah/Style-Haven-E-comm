import { NextResponse } from "next/server";
import dbconnect from "@/utils/dbconnnect";
import { Suggestion } from "@/utils/models";

export  async function POST(request) {
 
  await dbconnect();
  const payload = await request.json();
  let suggest = new Suggestion(payload);
  const response = await suggest.save()
  return NextResponse.json({ result: response, success: true });
}

export  async function GET(){
  await dbconnect();
    let data = await Suggestion.find();
    console.log("Form Data",data);
    return NextResponse.json({result:data,success:true},{status:200})
}

