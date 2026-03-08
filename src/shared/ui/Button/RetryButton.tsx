import { useState } from "react";
import Retry  from "@/shared/asset/svg/Retry";

export default function RetryButton() {
  const [count, setCount] = useState(0);
  const max = 3;

  const handleClick = () => {
    if (count < max) {
      setCount(count + 1);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={count === max}
      className="flex flex-col items-center cursor-pointer"
    >
      <Retry />
      <span className="text-sub-2">
        ({count}/{max})
      </span>
    </button>
  )
}