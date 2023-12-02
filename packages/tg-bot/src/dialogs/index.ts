import { MyContext } from '../context'
import { DIALOG_STATE, DialogName } from './types'

export class Dialog<T extends DialogName = DialogName> {
  protected ctx: MyContext
  public name: DialogName
  protected initialState: DIALOG_STATE[T]

  constructor(ctx: MyContext) {
    this.ctx = ctx
  }

  async enter(initialState?: DIALOG_STATE[T]) {
    if (!initialState) {
      this.ctx.setDialogContext(this.name, { ...this.initialState })
    } else {
      this.ctx.setDialogContext(this.name, initialState)
    }
    return await this.handleStart()
  }

  async handleTextInput(): Promise<any> {}

  async handleAnyUpdate(): Promise<any> {}

  async handleStart(): Promise<any> {}
}
