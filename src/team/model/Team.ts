import { model } from "mongoose";
import teamSchema from "./teamSchema.js";

const Team = model("Team", teamSchema, "teams");

export default Team;
