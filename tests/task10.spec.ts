import { expect, test } from "@playwright/test";
import { getAuthToken, getTask, sendAnswer } from "../common";
import { handleTask } from "../tasks/task10";

test("scraper, lesson11", async () => {
  const authToken = await getAuthToken("scraper");
  const task = await getTask(authToken);
  const answer = await handleTask(task);
  const res = await sendAnswer(answer, authToken);
  expect(res).toBe("CORRECT");
});
