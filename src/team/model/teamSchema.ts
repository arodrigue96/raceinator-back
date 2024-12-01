import { Schema } from "mongoose";
import { type Team } from "../types";

const teamSchema = new Schema<Partial<Team>>({
  name: {
    type: String,
    required: true,
  },
  ridersNames: {
    type: Array,
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
  isOficialTeam: {
    type: Boolean,
    required: true,
  },
});

export default teamSchema;
