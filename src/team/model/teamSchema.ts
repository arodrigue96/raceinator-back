import { Schema } from "mongoose";
import { type TeamStructure } from "../types";

const teamSchema = new Schema<TeamStructure>({
  name: {
    type: String,
    required: true,
  },
  ridersNames: {
    type: [String],
    required: true,
  },
  championshipTitles: {
    type: Number,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  altImageText: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  debutYear: {
    type: Number,
    required: true,
  },
  isOfficialTeam: {
    type: Boolean,
    required: true,
  },
});

export default teamSchema;
