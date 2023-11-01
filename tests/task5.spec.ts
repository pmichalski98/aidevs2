import { expect, test } from "@playwright/test";
import { getAuthToken, getTask, sendAnswer } from "../common";
import { InpromptTaskResponse } from "../types/types";
import { handleTask } from "../tasks/task5";

test("inprompt, lesson6", async () => {
  const authToken = await getAuthToken("inprompt");
  const task: InpromptTaskResponse = await getTask(authToken);
  const answer = await handleTask(task);
  const res = await sendAnswer(answer, authToken);
  expect(res).toBe("CORRECT");
});
