import { GetTaskResponseT } from "../types/types";
import OpenAI from "openai";
interface GnomeTask extends GetTaskResponseT {
  url: string;
}
export async function handleTask(task: GnomeTask) {
  const openai = new OpenAI();
  const res = await openai.chat.completions.create({
    model: "gpt-4-vision-preview",
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: task.msg },
          {
            type: "image_url",
            image_url: {
              url: task.url,
            },
          },
        ],
      },
    ],
  });
  return res.choices[0].message.content;
}
