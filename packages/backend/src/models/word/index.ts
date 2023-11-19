import mongoose from 'mongoose'
const { Schema } = mongoose

export const WORD_MODEL_NAME = 'Word'

export const wordSchema = new Schema({
  value: {
    type: String,
    required: true,
  },
  translation: {
    type: String,
    required: true,
  },
  transcription: {
    type: String,
  },
})
