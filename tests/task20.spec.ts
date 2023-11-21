import { expect, test } from "@playwright/test";
import { handleTask } from "../tasks/task20";
import { getAuthToken, getTask, sendAnswer } from "../common";

test("optimaldb, lesson21", async () => {
  const authToken = await getAuthToken("optimaldb");
  const task = await getTask(authToken);
  const answer = await handleTask(task);
  const res = await sendAnswer(answer, authToken);
  console.log(res);
  expect(res).toBe("CORRECT");
});
