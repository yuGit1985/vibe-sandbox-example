export type PrepareNoteResult =
  | { ok: true; value: string }
  | { ok: false; message: string };

export function prepareNote(rawValue: string): PrepareNoteResult {
  const value = rawValue.trim();

  if (!value) {
    return { ok: false, message: "メモを入力してください。" };
  }

  if (value.length > 500) {
    return { ok: false, message: "メモは500文字以内で入力してください。" };
  }

  return { ok: true, value };
}
