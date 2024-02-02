import { Menu } from '@grammyjs/menu'
import { MyContext } from '../../context'
import natural from 'natural'
import { WordDto } from '../../../../../services/db/types'

const tokenizer = new natural.WordTokenizer()

const wrapWordInSpoiler = async ({ context: sentenceRow, value: valueRaw }: Partial<WordDto>): Promise<string> => {
  const valueLowerCased = valueRaw.trim().toLowerCase()
  const valueStem = natural.LancasterStemmer.stem(valueLowerCased) || valueLowerCased

  const sentence = sentenceRow.trim().toLowerCase()
  const wordList = tokenizer.tokenize(sentence)

  const wordListWithHiddenSpoilers = wordList.map((word) => {
    const wordLoweCased = word.trim().toLowerCase()
    const wordStem = natural.LancasterStemmer.stem(wordLoweCased) || wordLoweCased
    if (wordStem === valueStem) {
      return `<tg-spoiler>${word}</tg-spoiler>`
    }

    return word
  })

  const sentenceWithHiddenSpoilers = wordListWithHiddenSpoilers.join(' ')

  return sentenceWithHiddenSpoilers[0].toUpperCase() + sentenceWithHiddenSpoilers.slice(1)
}

export const showContextHint = new Menu<MyContext>('showContextHint')

showContextHint.dynamic((ctx, range) => {
  const contextData = ctx.getDialogContext('studyWords')
  if (!contextData?.context || contextData?.hintShown) {
    return range
  }

  return range.text('Show hint', async (ctx) => {
    ctx.setDialogContext('studyWords', { ...contextData, hintShown: true })
    const reply = await wrapWordInSpoiler({ value: contextData.word, context: contextData.context })
    if (reply) {
      return await ctx.reply(reply, { parse_mode: 'HTML' })
    }

    return
  })
})
