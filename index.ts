import axios from "axios";
import OpenAI from "openai";
import {
  GetAuthTokenT,
  GetTaskResponseT,
  InpromptTaskResponse,
  LiarTaskResponse,
  ModerationResults,
  SendAnswerReponseT,
  gtpAnswer,
} from "./types/types";
import { log } from "console";

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

//task 4 functions

export async function sendQuestionTask4(token: string) {
  const formData = new FormData();
  const question = "Who is polish president ?";
  formData.append("question", question);
  const { data } = await axios.post<LiarTaskResponse>(
    `${URL}/task/${token}`,
    formData
  );
  const answerToCheck = data.answer;
  const openai = createOPENAIinstance();
  const openaiAnswer = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Check if this answer is valid for provided question,
          ###
          Return in this exact format: "YES" or "NO"
            ###
            Question: ${question}
            ###
            Answer: ${answerToCheck}
            `,
      },
    ],
  });
  return openaiAnswer.choices[0].message.content;
}
//task 5 functions
export async function handleTask(task: InpromptTaskResponse) {
  //regex
  // const splittedQuestion = task.question.split(" ");
  // const personNameWithQuestionmark = splittedQuestion.filter((chunk) =>
  //   chunk.match(/[A-Z]{1}/)
  // )[0];
  // const humanName = personNameWithQuestionmark.slice(
  //   0,
  //   personNameWithQuestionmark.length - 1
  // );

  const openai = createOPENAIinstance();
  const openaiAnswer = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `In given text find human name and return it.
          ###
          Return only name, if u dont find any return 0
            ###
            Text to find in : ${task.question}
            `,
      },
    ],
  });
  const personName = openaiAnswer.choices[0].message.content;
  if (!personName) throw new Error("Failed to find person name");

  const filteredInput = task.input.filter((row) => row.includes(personName));
  const openAiResponse = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Answer for proviced question using information that u have in context. If u dont know the answer say that you dont know.

            ###
            Question: ${task.question}
            ###
            Context:
            ${JSON.stringify(filteredInput)}
            `,
      },
    ],
  });
  const answer = openAiResponse.choices[0].message.content;
  console.log({ filteredInput });
  console.log({ answer });
  return answer;
}
