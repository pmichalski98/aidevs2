import { expect, test } from "@playwright/test";
import { handleTask } from "../tasks/task18";
import { getAuthToken, getTask, sendAnswer } from "../common";

test("ownapipro, lesson19", async () => {
  const authToken = await getAuthToken("ownapipro");
  await getTask(authToken);
  const answer = await handleTask();
  const res = await sendAnswer(answer, authToken);
  console.log(res);
  expect(res).toBe("CORRECT");
});
