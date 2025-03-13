import { useEffect, useState } from "react";
import { BoardsListResponse, fetchBoards } from "../api/boards";
import Image from "next/image";

export const Boards = () => {
  const [boards, setBoards] = useState<BoardsListResponse | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const boardsResponse = await fetchBoards();
      setBoards(boardsResponse);
    };
    fetch();
  }, []);

  return (
    <>
      Boards ({boards?.data?.length})
      <div className="flex flex-wrap gap-4">
        {boards?.data?.map((board) => (
          <div
            key={board.id}
            className="text-12 font-bold uppercase text-grey-10 w-[200px] h-[200px] overflow-hidden"
          >
            {board.thumbnails?.[0] && (
              <Image
                src={board.thumbnails?.[0]}
                alt={board.description || board.title || "boardImage"}
                priority
                width={400} // My first time working with next.js images, not sure how to handle this error when width isn't provided
                height={400}
                className="grayscale"
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
};
