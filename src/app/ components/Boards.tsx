import { useEffect, useState } from "react";
import { BoardsListResponse, fetchBoards } from "../api/boards";

export const Boards = () => {
  const [boards, setBoards] = useState<BoardsListResponse | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const boardsResponse = await fetchBoards();
      setBoards(boardsResponse);
    };
    fetch();
  }, []);

  return <>Boards</>;
};
