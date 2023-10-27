import { expect, test } from "@playwright/test";
import { generateBlogPosts, getAuthToken, getTask, sendAnswer } from "../index";

test("blogger, lesson2", async () => {
  const authToken = await getAuthToken("blogger");
  const input = await getTask(authToken);
  const posts = await generateBlogPosts(input.blog!);
  //@ts-ignore
  const res = await sendAnswer(posts, authToken);
  expect(res).toBe("CORRECT");
});
