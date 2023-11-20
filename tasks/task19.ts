import { GetTaskResponseT } from "../types/types";
import { post } from "axios";

interface MemeTask extends GetTaskResponseT {
  service: string;
  image: string;
  text: string;
}
export async function handleTask(task: MemeTask) {
  const RENDER_URL = "https://get.renderform.io/api/v2/render";
  const apiKey = process.env.RENDERFORM_API_KEY;
  if (!apiKey) return;
  const postData = {
    data: {
      "text.text": task.text,
      "image.src": task.image,
    },
    template: "yellow-deer-chew-monthly-1046",
  };
  console.log(postData);
  try {
    const res = await fetch(RENDER_URL, {
      headers: {
        "Content-Type": "application/json",
        "X-API-KEY": apiKey,
      },
      body: JSON.stringify(postData),
      method: "POST",
    });
    if (res.ok) {
      const responseData = await res.json();
      console.log(responseData);
      return responseData.href;
    }
  } catch (e) {
    console.log(e);
  }
}
