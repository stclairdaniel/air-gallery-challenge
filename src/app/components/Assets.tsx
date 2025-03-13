import { useEffect, useState } from "react";
import { ClipsListResponse, fetchAssets } from "../api/clips";
import Image from "next/image";

export const Assets = () => {
  const [assets, setAssets] = useState<ClipsListResponse | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const assetsResponse = await fetchAssets({ cursor: null });
      setAssets(assetsResponse);
    };
    fetch();
  }, []);

  const handleTitleClick = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      <div className="cursor-pointer" onClick={handleTitleClick}>
        Assets ({assets?.data?.total})
      </div>
      {!isCollapsed && (
        <div className="flex flex-wrap gap-4">
          {assets?.data?.clips?.map((asset) => (
            <div key={asset.id} className="w-[200px] h-[200px] overflow-hidden">
              {asset.assets.image && (
                <Image
                  src={asset.assets.image}
                  alt={
                    asset.description ||
                    asset.title ||
                    asset.displayName ||
                    "assetImage"
                  }
                  width={400}
                  height={400}
                />
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
};
