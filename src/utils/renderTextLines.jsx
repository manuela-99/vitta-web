export function renderTextLines(lines, renderLine = (line) => line) {
  return lines.map((line, index) => (
    <span key={`${index}-${line}`}>
      {index > 0 ? (
        <>
          <br className="text-lines__break" aria-hidden="true" />
          <span className="text-lines__join" aria-hidden="true">
            {' '}
          </span>
        </>
      ) : null}
      {renderLine(line)}
    </span>
  ));
}
