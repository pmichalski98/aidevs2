import { readdirSync, readFileSync, writeFileSync } from "fs";

const newNum = process.argv[2];
if (newNum === undefined)
  throw new Error("YOu need to specify new task number");
async function run() {
  createNewTestFile();
  createNewTaskFile();
  editPckJson();
}

run();

function editPckJson() {
  const pckJsonContent = readFileSync(`./package.json`, "utf-8");
  const parsed = JSON.parse(pckJsonContent);
  const scripts = Object.entries(parsed.scripts);
  const newLine: string[] = [];
  newLine.push(`task${newNum}`);
  newLine.push(`npx playwright test --grep Task${newNum}`);
  const newScripts = [...scripts, newLine];
  const newScriptsObject = Object.fromEntries(newScripts);
  writeFileSync(
    `./package.json`,
    JSON.stringify({ ...parsed, scripts: newScriptsObject }),
  );
}
function createNewTaskFile() {
  writeFileSync(
    `./tasks/task${newNum}.ts`,
    "export async function handleTask() {\n" + "    \n" + "}",
  );
}
function createNewTestFile() {
  const dirs = readdirSync(`./tests`);
  const sorted = dirs.sort((a, b) => {
    const [splittedA] = a.split(".");
    const [splittedB] = b.split(".");
    const numA = Number(splittedA.replace("task", ""));
    const numB = Number(splittedB.replace("task", ""));
    if (numA < numB) {
      return -1;
    }
    return 1;
  });
  const fileContent = readFileSync(
    `./tests/${sorted.at(sorted.length - 1)}`,
    "utf-8",
  );
  writeFileSync(`./tests/task${newNum}.spec.ts`, fileContent);
}
