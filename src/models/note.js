import { Schema, model } from 'mongoose';
import { TAGS } from '../constants/tags.js';


const noteSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    content: {
      type: String,
      default: '',
      trim: true,
    },
    tag: {
      type: String,
      enum: TAGS,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);
noteSchema.index(
  { name: "text" },
  {
    name: "NoteTextIndex",
    weights: { name: 10 },
    default_language: "english",
  }
);

export const Note = model('Note', noteSchema );
