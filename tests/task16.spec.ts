import { expect, test } from "@playwright/test";
import { handleTask } from "../tasks/task16";
import { getAuthToken, getTask, sendAnswer } from "../common";

test("gnome, lesson17", async () => {
  const authToken = await getAuthToken("gnome");
  const task = await getTask(authToken);
  const answer = await handleTask(task);
  const res = await sendAnswer(answer, authToken);
  expect(res).toBe("CORRECT");
});
