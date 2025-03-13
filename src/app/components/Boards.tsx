import { useEffect, useState } from "react";
import { BoardsListResponse, fetchBoards } from "../api/boards";
import Image from "next/image";

export const Boards = () => {
  const [boards, setBoards] = useState<BoardsListResponse | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const boardsResponse = await fetchBoards();
      setBoards(boardsResponse);
    };
    fetch();
  }, []);

  const handleTitleClick = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <div className="cursor-pointer" onClick={handleTitleClick}>
        Boards ({boards?.data?.length})
      </div>
      {!isCollapsed && (
        <div className="flex flex-wrap gap-4">
          {boards?.data?.map((board) => (
            <div key={board.id} className="w-[200px] h-[200px] overflow-hidden">
              {board.thumbnails?.[0] && (
                <Image
                  src={board.thumbnails?.[0]}
                  alt={board.description || board.title || "boardImage"}
                  priority
                  width={400} // My first time working with next.js images, not sure how to handle this error when width isn't provided
                  height={400}
                  className="grayscale" // TODO: debug why grayscale-x is not working
                />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
