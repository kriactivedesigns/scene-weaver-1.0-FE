export enum DialogType {
  Info = 'info',
  Warn = 'warn',
  Error = 'error',
  Confirmation = 'confirmation',
}

export enum DialogResult {
  Confirm = 'confirm',
  Cancel = 'cancel',
  Continue = 'continue',
}

export type ButtonType = 'confirm' | 'continue' | 'cancel'

export interface DialogData {
  title: string;
  message: string;
  type: DialogType;
  buttons: Array<{
    type: ButtonType,
    text: string
  }>
}
