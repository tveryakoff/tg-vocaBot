import { Menu } from '@grammyjs/menu'
import { MyContext } from '../../context'
import { Word } from '../../../../../types/user'

const wrapWordInSpoiler = ({ context: contextRaw, value: valueRaw }: Partial<Word>): string => {
  const value = valueRaw.trim().toLowerCase()
  const context = contextRaw.trim().toLowerCase()
  if (!context.includes(value)) {
    return context
  }
  const newContext = context.replace(value, `<tg-spoiler>${value}</tg-spoiler>`)
  return newContext[0].toUpperCase() + newContext.slice(1)
}

export const showContextHint = new Menu<MyContext>('showContextHint')

showContextHint.dynamic((ctx, range) => {
  const contextData = ctx.getDialogContext('studyWords')
  if (!contextData.context || contextData?.hintShown) {
    return range
  }

  return range.text('Show hint', async (ctx) => {
    ctx.setDialogContext('studyWords', { ...contextData, hintShown: true })
    const reply = wrapWordInSpoiler({ value: contextData.word, context: contextData.context })
    if (reply) {
      return await ctx.reply(reply, { parse_mode: 'HTML' })
    }

    return
  })
})
