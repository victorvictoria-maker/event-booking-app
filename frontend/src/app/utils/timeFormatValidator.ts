export function timeFormatValidator(control: any) {
  if (!control.value || control.value.trim() === '') {
    return null;
  }

  const timePattern =
    /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s*-\s*([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timePattern.test(control.value)) {
    return { invalidTimeFormat: true };
  }
  return null;
}
