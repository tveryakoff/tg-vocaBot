import { MyContext } from '../context'
import { DIALOG_STATE, DialogName } from './types'

export class Dialog<T extends DialogName = DialogName> {
  protected ctx: MyContext
  public name: DialogName
  protected initialState: DIALOG_STATE[T]

  constructor(ctx: MyContext) {
    this.ctx = ctx
  }

  protected set contextState(state: DIALOG_STATE[T]) {
    this.ctx.setDialogContext(this.name, state)
  }

  protected get contextState() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return this.ctx.getDialogContext(this.name)
  }

  async enterDialog<T extends DialogName>(name: T, initialState?: DIALOG_STATE[T]) {
    return await this.ctx.enterDialog(name, initialState)
  }

  async start(initialState?: DIALOG_STATE[T]): Promise<any> {
    if (this.name !== this.ctx.session.activeDialogName) {
      this.ctx.session.activeDialogName = this.name
    }
    if (!initialState) {
      this.ctx.setDialogContext(this.name, { ...this.initialState })
    } else {
      this.ctx.setDialogContext(this.name, initialState)
    }
  }

  async handleTextInput(): Promise<any> {}

  async handleAnyUpdate(): Promise<any> {}
}
