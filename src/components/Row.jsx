
import Tile from "./Tile";

function Row({ guess = "", result = [], isCurrent = false }) {
  return (
    <div className="row">
      {Array.from({ length: 5 }, (_, index) => (
        <Tile
          key={index}
          letter={guess[index] || ""}
          status={result[index] || ""}
          isCurrent={isCurrent}
        />
      ))}
    </div>
  );
}

export default Row;
