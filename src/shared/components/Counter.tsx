import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <button
      className="btn btn-primary"
      onClick={() => {
        setCount((n) => n + 1);
      }}
    >
      {count}
    </button>
  );
}

export default Counter;
