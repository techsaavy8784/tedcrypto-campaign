import * as dotenv from 'dotenv';
import path = require("path");
import {myContainer} from "../src/Infrastructure/DependencyInjection/inversify.config";
import InMemoryLogger from "./Helper/InMemoryLogger";
import {TYPES} from "../src/Infrastructure/DependencyInjection/types";

dotenv.config({
    path: path.join(__dirname, `/../${process.env.DOT_FILE ?? '.env.test'}`),
    override: true,
    debug: false
})

myContainer.rebind(TYPES.Logger).toConstantValue(new InMemoryLogger())
