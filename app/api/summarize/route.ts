import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

if (!process.env.GEMINI_API_KEY) {
  throw new Error("Missing GEMINI_API_KEY");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Invalid Input" }, { status: 400 });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `Summarize the following news article into three important sentences.
                      - Focus on facts, data, and impact.
                      - No intro or conclusion.

                      Article:
                      ${text}
                      `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return NextResponse.json({ summary });
  } catch (error: any) {
    console.error("FULL ERROR:", error);
    // Gemini quota / rate limit
    if (error?.status === 429) {
      return NextResponse.json(
        { error: "Rate limit exceeded" },
        { status: 429 },
      );
    }

    // Model not found / invalid
    if (error?.status === 404) {
      return NextResponse.json(
        { error: "Model not available" },
        { status: 500 },
      );
    }

    // Network / fetch failure
    if (error?.message?.includes("fetch")) {
      return NextResponse.json(
        { error: "Upstream service unavailable" },
        { status: 503 },
      );
    }

    // Default fallback
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
