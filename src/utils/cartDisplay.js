export function shouldShowPresentationInfo(item) {
  return Boolean(item.presentationLabel?.trim());
}

export function shouldShowPresentationInCart(item) {
  if (item?.showPresentationInCart === false) return false;
  return shouldShowPresentationInfo(item);
}

export function shouldShowPresentationInWhatsApp(item) {
  return shouldShowPresentationInfo(item);
}
