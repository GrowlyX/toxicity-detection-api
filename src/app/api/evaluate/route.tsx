import {NextRequest, NextResponse} from "next/server";
import {loadAndPredict} from "@/model/model";

export async function POST(request: NextRequest){
    const body = await request.json()
    const toxicity = await loadAndPredict(body.message)
    const json = {
        level: toxicity
    };

    return NextResponse.json(json);
}
