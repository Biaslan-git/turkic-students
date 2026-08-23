/**
 * ВРЕМЕННЫЙ компонент для ревью правок с заказчиком.
 * Удалить этот файл и все использования <ChangedText> после утверждения копирайта.
 */
export function ChangedText({ old, children }: { old: string; children: React.ReactNode }) {
  return (
    <span className="changed-text" tabIndex={0}>
      {children}
      <span className="changed-text-tooltip">Было: {old || "(этого текста не было)"}</span>
    </span>
  );
}
