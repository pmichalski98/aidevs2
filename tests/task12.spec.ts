import { expect, test } from "@playwright/test";
import { handleTask } from "../tasks/task12";
import { getAuthToken, getTask, sendAnswer } from "../common";

test("search, lesson13", async () => {
  const authToken = await getAuthToken("search");
  const task = await getTask(authToken);
  const answer = await handleTask(task);
  const res = await sendAnswer(answer, authToken);
  // console.log(res);
  expect(res).toBe("CORRECT");
});
