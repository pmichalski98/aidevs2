import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanMessage } from "langchain/schema";

interface gtpAnswer {
  title: string;
  content: string;
}

export async function handleTask(blogTitles: string[]) {
  const gptAnswer = await generatePosts(blogTitles);
  console.log({ gptAnswer });

  const parsedAnswer: gtpAnswer[] = JSON.parse(gptAnswer.content);
  return parsedAnswer.map((firstBlogPost) => firstBlogPost.content);
}

async function generatePosts(blogTitles: string[]) {
  const chat = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
  });
  const prompt =
    new HumanMessage(`Generate blog posts for provided blog titles, make them in polish language,
  ###
  Return in this exact format: [{"title": xyz, "content" : blog post}]
    ###
    blog post titles: 
    ${blogTitles}
    `);
  return chat.call([prompt]);
}
