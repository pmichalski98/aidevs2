import axios from "axios";
import OpenAI from "openai";
import { GetAuthTokenT, SendAnswerReponseT } from "./types/types";

export const URL = process.env.AI_DEVS_API_BASE_URL;
export const apiKey = process.env.AI_DEVS_API_KEY;

// Reusable functions for all tasks:
export async function getAuthToken(taskName: string) {
  const res = await axios.post<GetAuthTokenT>(`${URL}/token/${taskName}`, {
    apikey: apiKey,
  });
  if (!res.data.token) return "You didnt get auth token";
  return res.data.token;
}

export async function getTask(token: string) {
  const res = await axios.get(`${URL}/task/${token}`);
  return res.data;
}

export async function sendAnswer(answer: unknown, token: string) {
  const res = await axios.post<SendAnswerReponseT>(`${URL}/answer/${token}`, {
    answer: answer,
  });

  return res.data.note;
}
export function createOPENAIinstance() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}
