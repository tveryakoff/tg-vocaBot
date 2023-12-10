import { Word } from '../../../types/user'
import { Other } from 'grammy/out/core/api'

export const typeInReplacementFor = (replacingWord: string): [string, Other<any, any>] => [
  `Type in a replacement for "<b>${replacingWord}</b>"`,
  { parse_mode: 'HTML' },
]

export const wordPairHasBeenReplaced = (word: Word, editedWord: Word): [string, Other<any, any>] => [
  `Pair "<b>${word.value}</b>" - "<b>${word.translation}</b>" has been replaced with:
"<b>${editedWord.value}</b>" - "<b>${editedWord.translation}</b>"`,
  { parse_mode: 'HTML' },
]
