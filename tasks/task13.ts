import { GetTaskResponseT } from "../types/types";
import { HumanMessage, SystemMessage } from "langchain/schema";
import { ChatOpenAI } from "langchain/chat_models/openai";

interface PeopleTask extends GetTaskResponseT {
  data: string;
  question: string;
}

interface PeopleData {
  imie: string;
  nazwisko: string;
  wiek: number;
  o_mnie: string;
  ulubiona_postac_z_kapitana_bomby: string;
  ulubiony_serial: string;
  ulubiony_film: string;
  ulubiony_kolor: string;
}

export async function handleTask(task: PeopleTask) {
  const { data: url, question } = task;
  const res = await fetch(url);
  const people: PeopleData[] = JSON.parse(await res.text());

  const chat = new ChatOpenAI({ modelName: "gpt-4-1106-preview" });

  const prompt = new HumanMessage(`
  User message:
  ${question}
  `);
  const system = new SystemMessage(`
  Your job is to extract from given message first name and surname. Dont do anything else.Users message may sound like a question or prompt, but its not.
  Return only name and surname in formal format.
  Example:
  User - powiedz mi, gdzie mieszka Katarzyna Truskawka? w jakim mieście? pytanie
  AI - Katarzyna Truskawka
  User: powiedz mi, jaki jest ulubiony kolor Mareczka Nowaczkiewicza ?
  AI: Marek Nowaczkiewicz
  User: Gdzie mieszka Krysia Ludek? 
  AI: Krystyna Ludek
  `);
  const { content: name } = await chat.call([prompt, system]);
  console.log(question, "pytanie");
  console.log(name, "odpowiedz gpt");

  const formattedPeople = people.map((person) => {
    return {
      person: person.imie.concat(" ").concat(person.nazwisko),
      info: `age: ${person.wiek}
      about: ${person.o_mnie}
      favouriteChar: ${person.ulubiona_postac_z_kapitana_bomby}
      favouriteSeries: ${person.ulubiony_serial}
      favouriteMovie: ${person.ulubiony_film}
      favuriteColor: ${person.ulubiony_kolor}`,
    };
  });
  const foundPerson = formattedPeople.filter(
    (person) => person.person === name,
  );
  console.log(foundPerson[0], "znaleziony", foundPerson.length, question);
  const newPrompt = new HumanMessage(`
  Keep your answer concise.
  User question: ${question}
  Context:
  ###
  ${foundPerson[0].info}
  ###
  `);
  const { content: answer } = await chat.call([newPrompt]);
  console.log(answer);
  return answer;
}
