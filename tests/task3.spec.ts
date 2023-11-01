import { expect, test } from "@playwright/test";
import { getAuthToken, getTask, sendAnswer } from "../common";
import { handleTask } from "../tasks/task3";
import { BlogTaskResponse } from "../types/types";

test("blogger, lesson2", async () => {
  const authToken = await getAuthToken("blogger");
  const { blog }: BlogTaskResponse = await getTask(authToken);
  const answer = await handleTask(blog);
  const res = await sendAnswer(answer, authToken);
  expect(res).toBe("CORRECT");
});
