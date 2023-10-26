import { expect, test } from "@playwright/test";
import { getAuthToken, getTask, moderateText, sendAnswer } from "../index";
import { log } from "console";

test("moderation, lesson2 ", async () => {
  const authToken = await getAuthToken("moderation");
  const { input } = await getTask(authToken);
  const res = await moderateText(input!);
  const adb = await sendAnswer(res, authToken);
  console.log(adb);
});

test("blogger, lesson2", async () => {
  const authToken = await getAuthToken("blogger");
  const input = await getTask(authToken);
  console.log(input);
});
