import { DbConnection } from "@/app/api/libs/Db";
import Question from "@/app/api/model/Question";
import { parse } from "cookie";
function shuffleArray(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export async function GET(request) {
  // Connect to MongoDB
  try {
    await DbConnection();
  } catch (error) {
    console.error("DB connection error:", error);
    return new Response(JSON.stringify({ error: "Database Connection Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Parse cookies from the request header
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  const position = cookies.jobApplicantPosition;

  if (!position) {
    return new Response(
      JSON.stringify({ error: "Candidate position not provided in cookies." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
    // Fetch all questions matching the candidate's position
    const allQuestions = await Question.find({ field: position }).exec();
    // Shuffle and select 10 random questions (or all if fewer than 10)
    const randomQuestions =
      allQuestions.length > 10 ? shuffleArray(allQuestions).slice(0, 10) : allQuestions;

    return new Response(JSON.stringify(randomQuestions), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}










export async function POST(request) {
  try {
    // Ensure connection to MongoDB
    await DbConnection();

    // Parse the JSON body
    const body = await request.json();
    const { field, question, options, correctAnswer } = body;

    // Validate required fields
    if (!field || !question || !options || !correctAnswer) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Create a new Question document
    const newQuestion = new Question({
      field,
      question,
      options,
      correctAnswer,
    });

    await newQuestion.save();

    return new Response(
      JSON.stringify({
        success: true,
        message: "Question created successfully",
        question: newQuestion,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error creating question:", error);
    return new Response(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}