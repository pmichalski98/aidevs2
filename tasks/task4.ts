import axios from "axios";
import { LiarTaskResponse } from "../types/types";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";
export async function handleTask(token: string) {
  const formData = new FormData();
  const question = "Who is polish president ?";

  formData.append("question", question);

  const { data } = await axios.post<LiarTaskResponse>(
    `${process.env.AI_DEVS_API_BASE_URL}/task/${token}`,
    formData,
  );
  const answerToCheck = data.answer;

  const chat = new ChatOpenAI();
  const prompt =
    new HumanMessage(`Check if this answer is valid for provided question,
  ###
  Return in this exact format: "YES" or "NO"
    ###
    Question: ${question}
    ###
    Answer: ${answerToCheck}
    `);
  const { content: openaiAnswer } = await chat.call([prompt]);
  return openaiAnswer;
}
