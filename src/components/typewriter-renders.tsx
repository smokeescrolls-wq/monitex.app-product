export function renderWithSpan(
  typed: string,
  full: string,
  target: string,
  spanClassName: string,
) {
  const start = full.indexOf(target);
  if (start < 0) return typed;

  const end = start + target.length;

  const a = typed.slice(0, Math.min(start, typed.length));
  const b = typed.slice(
    Math.min(start, typed.length),
    Math.min(end, typed.length),
  );
  const c = typed.slice(Math.min(end, typed.length));

  return (
    <>
      {a}
      {b ? <span className={spanClassName}>{b}</span> : null}
      {c}
    </>
  );
}

export function renderWithBold(
  typed: string,
  full: string,
  target: string,
  boldClassName?: string,
) {
  const start = full.indexOf(target);
  if (start < 0) return typed;

  const end = start + target.length;

  const a = typed.slice(0, Math.min(start, typed.length));
  const b = typed.slice(
    Math.min(start, typed.length),
    Math.min(end, typed.length),
  );
  const c = typed.slice(Math.min(end, typed.length));

  return (
    <>
      {a}
      {b ? <b className={boldClassName}>{b}</b> : null}
      {c}
    </>
  );
}
