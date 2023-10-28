import { expect, test } from "@playwright/test";
import { generateBlogPosts, getAuthToken, getTask, sendAnswer } from "../index";
import { BlogTaskResponse } from "../types/types";

test("blogger, lesson2", async () => {
  const authToken = await getAuthToken("blogger");
  const {blog}: BlogTaskResponse = await getTask(authToken);  
  const posts = await generateBlogPosts(blog);
  const res = await sendAnswer(posts, authToken);
  expect(res).toBe("CORRECT");
});
