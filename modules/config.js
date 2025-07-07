import {Folder, Document} from "./database.js";

const schema = [
  new Document("Users", "name", [], ["settings", "pages"]),
  new Document("Settings", "user", [],["speech_volume", "speech_voice", "prompt_volume", "prompt_voice", "speech_delay"]),
  new Document("Pages", "user", [], ["name", "layout", "description", "actions"]),
  new Document("GamepadSettings", "user", [], ["button_actions"])
];

let folder = new Folder("AAC Application", 1, schema);

export {folder}
