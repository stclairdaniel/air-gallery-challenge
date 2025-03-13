import { useEffect, useState } from "react";
import { ClipsListResponse, fetchAssets } from "../api/clips";
import Image from "next/image";

export const Assets = () => {
  const [assets, setAssets] = useState<ClipsListResponse | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const assetsResponse = await fetchAssets({ cursor: null });
      setAssets(assetsResponse);
    };
    fetch();
  }, []);

  console.log(assets);

  return (
    <>
      Assets ({assets?.data?.total})
      <div className="flex flex-wrap gap-4">
        {assets?.data?.clips?.map((asset) => (
          <div
            key={asset.id}
            className="text-12 font-bold uppercase text-grey-10 w-[200px] h-[200px] overflow-hidden"
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
                width={400}
                height={400}
              />
            )}
          </div>
        ))}
      </div>
    </>
  );
};
