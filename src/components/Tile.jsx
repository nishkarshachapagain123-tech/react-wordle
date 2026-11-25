
function Tile({ letter, status, isCurrent }) {
  const className = [
    "tile",
    status || "",
    isCurrent && letter ? "filled" : ""
  ].filter(Boolean).join(" ");

  return (
    <div className={className}>
      {letter}
    </div>
  );
}

export default Tile;
