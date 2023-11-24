import { MyContextType } from '../types/context'
import { MiddlewareFn } from 'grammy'
import { AppState, TRAIN_WORDS_STAGE } from '../types/dialogs'

const trainWords: MiddlewareFn<MyContextType> = async (ctx, next) => {
  const state = ctx.session.state
  if (!state || state !== AppState.TRAIN_WORDS) {
    return await next()
  }

  const { type = 'word', stage } = ctx.session[AppState.TRAIN_WORDS]
  const dictId = ctx?.session?.activeDictionaryId

  if (!stage || stage === TRAIN_WORDS_STAGE.DEFAULT) {
    const word = await ctx?.user?.getWordForTraining?.(dictId)

    ctx.session[AppState.TRAIN_WORDS] = {
      ...ctx.session[AppState.TRAIN_WORDS],
      stage: TRAIN_WORDS_STAGE.CHECK_WORD,
      word: word.value,
    }

    const opposite = type === 'word' ? word.translation : word.value
    return await ctx.reply(`Type in the translation for "${opposite}":`)
  }

  if (stage === TRAIN_WORDS_STAGE.CHECK_WORD) {
    const userInput = ctx?.message?.text
    const targetWordValue = ctx.session[AppState.TRAIN_WORDS].word

    const { isCorrect, correctAnswer } = await ctx.user.checkWord({
      dictId: ctx?.session?.activeDictionaryId,
      word: targetWordValue,
      userInput,
      type,
    })

    ctx.session[AppState.TRAIN_WORDS] = {
      ...ctx.session[AppState.TRAIN_WORDS],
      stage: TRAIN_WORDS_STAGE.DEFAULT,
      word: null,
    }

    if (isCorrect) {
      await ctx.reply(`Correct!`)
      return trainWords(ctx, next)
    } else {
      await ctx.reply(`Nope, the correct answer would be "${correctAnswer}"`)
      return trainWords(ctx, next)
    }
  }
}

export default trainWords
