import { expect, test } from "@playwright/test";
import { handleTask } from "../tasks/task19";
import { getAuthToken, getTask, sendAnswer } from "../common";

test("meme, lesson20", async () => {
  const authToken = await getAuthToken("meme");
  const task = await getTask(authToken);
  const answer = await handleTask(task);
  const res = await sendAnswer(answer, authToken);
  console.log(res);
  expect(res).toBe("CORRECT");
});
