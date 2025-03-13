import { useEffect, useMemo, useState } from "react";
import { ClipsListResponse, fetchAssets } from "../api/clips";
import Image from "next/image";
import { Grid, GridCellRenderer } from "react-virtualized";
import { useScrollPosition, useWindowDimensions } from "./Assets.utils";

const IMAGE_SIZE = 200; // Naive approch to get virtualization working

export const Assets = () => {
  const [assets, setAssets] = useState<ClipsListResponse | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { width } = useWindowDimensions();
  const scrollPosition = useScrollPosition();

  useEffect(() => {
    const fetch = async () => {
      const assetsResponse = await fetchAssets({ cursor: null });
      setAssets(assetsResponse);
    };
    fetch();
  }, []);

  useEffect(() => {
    const fetch = async (cursor: string) => {
      const assetsResponse = await fetchAssets({ cursor });
      const updatedAssets = {
        ...assets,
        data: {
          total: assetsResponse.data.total,
          clips: [
            ...(assets?.data.clips || []),
            ...(assetsResponse.data.clips || []),
          ],
        },
        pagination: assetsResponse.pagination,
      };
      setAssets(updatedAssets);
    };

    if (
      scrollPosition > 75 &&
      assets?.pagination.hasMore &&
      assets?.pagination.cursor
    ) {
      fetch(assets?.pagination.cursor);
    }
  }, [scrollPosition, assets]);

  const handleTitleClick = () => {
    setIsCollapsed(!isCollapsed);
  };

  if (!assets) {
    return null;
  }

  const numColumns = Math.floor(width / IMAGE_SIZE);
  const numRows = Math.ceil((assets?.data?.clips || []).length / numColumns);
  const NUM_VISIBLE_ROWS = 6; // TODO: Determine from container height

  const gridCellRenderer: GridCellRenderer = ({
    columnIndex,
    key,
    rowIndex,
    style,
  }) => {
    const assetIndex = rowIndex * numColumns + columnIndex;
    const asset = assets?.data.clips?.[assetIndex];

    if (!asset) {
      return null;
    }

    return (
      <div
        key={key}
        style={style}
        className={`w-[${IMAGE_SIZE}px] h-[${IMAGE_SIZE}px] overflow-hidden`}
      >
        {asset.assets.image && (
          <Image
            src={asset.assets.image}
            alt={
              asset.description ||
              asset.title ||
              asset.displayName ||
              "assetImage"
            }
            width={IMAGE_SIZE}
            height={IMAGE_SIZE}
          />
        )}
      </div>
    );
  };

  return (
    <>
      <div className="cursor-pointer" onClick={handleTitleClick}>
        Assets ({assets?.data?.total})
      </div>
      {!isCollapsed && (
        <Grid
          cellRenderer={gridCellRenderer}
          columnCount={numColumns}
          columnWidth={IMAGE_SIZE}
          height={NUM_VISIBLE_ROWS * IMAGE_SIZE}
          rowCount={numRows}
          rowHeight={IMAGE_SIZE}
          width={width}
        />
      )}
    </>
  );
};
