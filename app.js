import { config } from "dotenv";

import Server from "./models/server.model.js";

config();

const server = new Server();

server.listen();
