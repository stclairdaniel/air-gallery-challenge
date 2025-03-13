import { useEffect, useState } from "react";
import { BoardsListResponse, fetchBoards } from "../api/boards";
import Image from "next/image";
import { IMAGE_SIZE } from "./constants";
import { HoverCarat, SectionTitle } from "./shared";

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
      <SectionTitle onClick={handleTitleClick}>
        BOARDS ({boards?.data?.length}) <HoverCarat isCollapsed={isCollapsed} />
      </SectionTitle>
      {!isCollapsed && (
        <div className="flex flex-wrap gap-4">
          {boards?.data?.map((board) => (
            <div
              key={board.id}
              className={`relative w-[${IMAGE_SIZE}px] h-[${IMAGE_SIZE}px] overflow-hidden`}
            >
              {board.thumbnails?.[0] && (
                <Image
                  src={board.thumbnails?.[0]}
                  alt={board.description || board.title || "boardImage"}
                  priority
                  fill
                  className="object-cover rounded-lg"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-white/40 to-black/40 rounded-lg" />
              <div className="absolute bottom-4 left-2 text-white cursor-pointer">
                {board.title}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
