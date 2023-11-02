import { expect, test } from "@playwright/test";
import { getAuthToken, getTask, sendAnswer } from "../common";
import { handleTask } from "../tasks/task7";

test("whisper, lesson8", async () => {
  const authToken = await getAuthToken("whisper");
  await getTask(authToken);
  const answer = await handleTask();
  const res = await sendAnswer(answer, authToken);
  expect(res).toBe("CORRECT");
});
