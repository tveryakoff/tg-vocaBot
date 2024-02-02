import { Other } from 'grammy/out/core/api'
import { WordDto } from '../../../services/db/types'

export type ReplyReturn = [string, Other<any, any>]

export const typeInReplacementFor = (replacingWord: string): ReplyReturn => [
  `Type in a replacement for "<b>${replacingWord}</b>"`,
  { parse_mode: 'HTML' },
]

export const wordPairHasBeenReplaced = (word: WordDto, editedWord: WordDto): ReplyReturn => [
  `Pair "<b>${word.value}</b>" - "<b>${word.translation}</b>" has been replaced with:
"<b>${editedWord.value}</b>" - "<b>${editedWord.translation}</b>"`,
  { parse_mode: 'HTML' },
]

export const wordPairHasBeenAdded = (word: WordDto, dictName: string): ReplyReturn => [
  `🎉 A new pair "<b>${word.value}</b>" - "<b>${word.translation}</b>" has been added to "<b>${dictName}</b>"!
Enter a new word:`,
  { parse_mode: 'HTML' },
]
