export const APP_TOAST_EVENT = 'app:toast';

export function mostrarToast(mensagem: string) {
  window.dispatchEvent(new CustomEvent<string>(APP_TOAST_EVENT, { detail: mensagem }));
}
