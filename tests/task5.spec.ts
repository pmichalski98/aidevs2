import { expect, test } from "@playwright/test";
import {
  getAuthToken,
  getTask,
  handleTask,
  sendAnswer,
  sendQuestionTask4,
} from "../index";
import { InpromptTaskResponse } from "../types/types";

test("liar, lesson5", async () => {
  const authToken = await getAuthToken("inprompt");
  const task: InpromptTaskResponse = await getTask(authToken);
  const answer = await handleTask(task);
  const res = await sendAnswer(answer, authToken);
  console.log({ res });

  expect(res).toBe("CORRECT");
});
