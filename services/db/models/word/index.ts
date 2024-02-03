import mongoose from 'mongoose'
import { WordDto } from '../../types'
const { Schema } = mongoose

export const wordSchema = new Schema<WordDto>(
  {
    value: {
      type: String,
      required: true,
    },
    translation: {
      type: String,
      required: true,
    },

    context: {
      type: String,
      required: false,
    },
    transcription: {
      type: String,
    },

    lastTrained: Date,

    mark: {
      type: Number,
      default: 1,
    },
  },
  { timestamps: true },
)
