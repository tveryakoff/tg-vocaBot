import { Word } from '../../../types/user'
import { Other } from 'grammy/out/core/api'

export type ReplyReturn = [string, Other<any, any>]

export const typeInReplacementFor = (replacingWord: string): ReplyReturn => [
  `Type in a replacement for "<b>${replacingWord}</b>"`,
  { parse_mode: 'HTML' },
]

export const wordPairHasBeenReplaced = (word: Word, editedWord: Word): ReplyReturn => [
  `Pair "<b>${word.value}</b>" - "<b>${word.translation}</b>" has been replaced with:
"<b>${editedWord.value}</b>" - "<b>${editedWord.translation}</b>"`,
  { parse_mode: 'HTML' },
]

export const wordPairHasBeenAdded = (word: Word, dictName: string): ReplyReturn => [
  `🎉 A new pair "<b>${word.value}</b>" - "<b>${word.translation}</b>" has been added to "<b>${dictName}</b>"!
Enter a new word:`,
  { parse_mode: 'HTML' },
]
