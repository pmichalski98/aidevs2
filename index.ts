import axios from "axios";
import {
  GetAuthTokenT,
  GetTaskResponseT,
  SendAnswerReponseT,
} from "./types/types";
import OpenAI from "openai";

const URL = process.env.AI_DEVS_API_BASE_URL;
const apiKey = process.env.AI_DEVS_API_KEY;
export async function getAuthToken(taskName: string) {
  const res = await axios.post<GetAuthTokenT>(`${URL}/token/${taskName}`, {
    apikey: apiKey,
  });
  if (!res.data.token) return "You didnt get auth token";
  return res.data.token;
}

export async function getTask(token: string) {
  const res = await axios.get<GetTaskResponseT>(`${URL}/task/${token}`);
  return res.data;
}

export async function sendAnswer(answer: string, token: string) {
  const res = await axios.post<SendAnswerReponseT>(`${URL}/answer/${token}`, {
    answer: answer,
  });
  return res.data.note;
}

export async function moderateText(input: string[]) {
  const res = await axios.post(
    "https://api.openai.com/v1/moderations",
    {
      input,
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    },
  );
  const result = res.data.results.map((result, i) => {
    if (result.flagged) {
      return 1;
    } else if (!result.flagged) {
      return 0;
    }
  });

  return result;
}

export async function generateBlogPosts(blogTitles: string[]) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const res = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Generate blog posts for provided blog titles, make them in polish language,
        ###
        Return in JSON format for example: ["title": xyz, "content" : blog post]
          ###
          blog post titles: 
          ${blogTitles}
          `,
      },
    ],
  });
  console.log(res);
  type AnswerT = {
    title: string;
    content: string;
  };
  let openaiAnswer: AnswerT[];
  openaiAnswer = JSON.parse(res.choices[0].message.content!) as AnswerT[];
  console.log(openaiAnswer);
  return openaiAnswer.map((firstBlogPost) => firstBlogPost.content);
}
