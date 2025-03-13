import { useEffect, useMemo, useState } from "react";
import { ClipsListResponse, fetchAssets } from "../api/clips";
import Image from "next/image";
import {
  CellMeasurer,
  CellMeasurerCache,
  Grid,
  GridCellRenderer,
  Index,
} from "react-virtualized";
import { useScrollPosition, useWindowDimensions } from "./Assets.utils";
import { IMAGE_SIZE, LOAD_MORE_SCROLL_THRESHOLD } from "./constants";
import { HoverCarat, SectionTitle } from "./shared";

const cache = new CellMeasurerCache({
  fixedWidth: false,
  defaultHeight: IMAGE_SIZE,
});

const GRID_SPACING_PX = 10;

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
      scrollPosition > LOAD_MORE_SCROLL_THRESHOLD &&
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
  const NUM_VISIBLE_ROWS = 6; // TODO: Determine from initial container height

  // Struggling a bit here - for Grid this feels like it should take both row and column index?
  const getDynamicColumnWidth = (index: Index) => {
    return assets?.data.clips?.[index.index]?.width || IMAGE_SIZE;
  };

  const gridCellRenderer: GridCellRenderer = ({
    columnIndex,
    key,
    rowIndex,
    style,
    parent,
  }) => {
    const assetIndex = rowIndex * numColumns + columnIndex;
    const asset = assets?.data.clips?.[assetIndex];

    if (!asset) {
      return null;
    }

    const scale = asset.width / asset.height;
    const scaledWidth = IMAGE_SIZE * scale;

    return (
      <CellMeasurer
        key={key}
        cache={cache}
        columnIndex={columnIndex}
        rowIndex={rowIndex}
        parent={parent}
      >
        <div
          key={key}
          style={{
            ...style,
            height: IMAGE_SIZE - GRID_SPACING_PX,
            width: IMAGE_SIZE - GRID_SPACING_PX,
          }}
          className="flex overflow-hidden justify-center items-center content-center box-border margin-4"
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
              height={IMAGE_SIZE}
              width={scaledWidth}
              quality={75}
              sizes="300px"
            />
          )}
        </div>
      </CellMeasurer>
    );
  };

  return (
    <>
      <SectionTitle onClick={handleTitleClick}>
        ASSETS ({assets?.data?.total}) <HoverCarat isCollapsed={isCollapsed} />
      </SectionTitle>
      {!isCollapsed && (
        <Grid
          cellRenderer={gridCellRenderer}
          columnCount={numColumns}
          columnWidth={IMAGE_SIZE}
          height={NUM_VISIBLE_ROWS * IMAGE_SIZE}
          rowCount={numRows}
          rowHeight={IMAGE_SIZE}
          width={width}
          deferredMeasurementCache={cache}
        />
      )}
    </>
  );
};
