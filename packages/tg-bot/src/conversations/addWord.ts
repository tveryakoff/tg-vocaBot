import { MyConversation } from '../types/conversation'
import { MyContextType } from '../types/context'
import { userResolver } from '../../../../services/db/resolvers/user'
import { UserMongooseHydrated } from '../../../../types/user'

export async function addWord(conversation: MyConversation, ctx: MyContextType): Promise<unknown> {
  if (!ctx?.from?.id) {
    throw new Error('No user')
  }
  await ctx.reply('Type in a word')
  const {
    msg: { text: word },
  } = await conversation.waitFor('message:text')
  if (!word) {
    await ctx.reply(`A word can't be empty!`)
  }
  await ctx.reply(`Type in a translation for ${word}`)

  const {
    msg: { text: translation },
  } = await conversation.waitFor('message:text')

  const user = (await conversation.external(() => userResolver.getByTgId(ctx?.from?.id))) as UserMongooseHydrated
  const { dictionary } = await conversation.external(
    () =>
      user?.addWordToDictionary({
        value: word,
        translation,
        dictId: ctx?.session?.activeDictionaryId,
      }),
  )
  ctx.session.state = 'addWord'
  await ctx.reply(`A new pair ${word} - ${translation} has been added to ${dictionary.name}!\n\nContinue adding vocab`)
  return
}
