import axios from "axios";
import OpenAI from "openai";
import {
  GetAuthTokenT,
  ModerationResults,
  SendAnswerReponseT,
  gtpAnswer,
} from "./types/types";

const URL = process.env.AI_DEVS_API_BASE_URL;
const apiKey = process.env.AI_DEVS_API_KEY;

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

// Task 2 functions
async function getModerationResult(input: string[]) {
  return axios.post<ModerationResults>(
    "https://api.openai.com/v1/moderations",
    {
      input,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }
  );
}

export async function moderateText(input: string[]) {
  const moderationResult = await getModerationResult(input);

  return moderationResult.data.results.map((result) =>
    result.flagged ? 1 : 0
  );
}

// Task 3 functions
function createOPENAIinstance() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
}
async function getAnswerFromGPT(blogTitles: string[]) {
  const openai = createOPENAIinstance();

  return openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Generate blog posts for provided blog titles, make them in polish language,
          ###
          Return in this exact format: [{"title": xyz, "content" : blog post}]
            ###
            blog post titles: 
            ${blogTitles}
            `,
      },
    ],
  });
}
export async function generateBlogPosts(blogTitles: string[]) {
  const gptAnswer = await getAnswerFromGPT(blogTitles);

  const parsedAnswer: gtpAnswer[] = JSON.parse(
    gptAnswer.choices[0].message.content!
  );
  return parsedAnswer.map((firstBlogPost) => firstBlogPost.content);
}
