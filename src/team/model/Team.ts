import { model } from "mongoose";
import teamSchema from "./teamSchema";

const Team = model("Team", teamSchema, "teams");

export default Team;
