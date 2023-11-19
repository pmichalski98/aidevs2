import { expect, test } from "@playwright/test";
import { handleTask } from "../tasks/task17";
import { getAuthToken, getTask, sendAnswer } from "../common";

test("ownapi, lesson18", async () => {
  const authToken = await getAuthToken("ownapi");
  await getTask(authToken);
  const answer = await handleTask();
  const res = await sendAnswer(answer, authToken);
  console.log(res);
  // expect(res).toBe("CORRECT");
});
