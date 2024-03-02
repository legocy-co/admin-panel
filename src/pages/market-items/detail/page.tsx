import { useNavigate, useParams } from 'react-router-dom';
import { useGate, useUnit } from 'effector-react';
import { useState } from 'react';
import { addDefaultSrc } from '../../../services/utils.ts';
import { Button } from '../../../shared/ui/button.tsx';
import GalleryModal from '../../../components/GalleryModal';
import * as model from './model.ts';

export const MarketItemDetailPage = () => {
  const params = useParams<'id'>();
  const navigate = useNavigate();

  useGate(model.gate, { id: params.id ?? null, navigate });

  const marketItem = useUnit(model.$legoSetDetail);
  const [showGallery, setShowGallery] = useState<number>(-1);

  return (
    <>
      <div className="mt-8 mb-9 whitespace-nowrap flex flex-col gap-7">
        <img
          className="w-[300px] md:w-[595px] h-[200px] md:h-[470px] object-cover object-center rounded-md bg-silver cursor-pointer transition-opacity hover:opacity-90 active:opacity-80"
          src={'' + marketItem.images?.slice(0, 1).map((img) => img.image_url)}
          onError={addDefaultSrc}
          onClick={() => setShowGallery(0)}
          alt=""
        />
        <div className="w-[250px] md:w-[577px] align-top inline-block text-xl">
          <p className="text-3xl font-semibold mb-10">{marketItem.name}</p>
          <div className="flex flex-col justify-between h-24 mb-4">
            <p>
              Pieces:{' '}
              <span className="text-light dark:text-yellow-100">
                {marketItem.pieces}
              </span>
            </p>
            <p>
              Series:{' '}
              <span className="text-light dark:text-yellow-100">
                {marketItem.series}
              </span>
            </p>
          </div>
          <p className="mb-9">
            Set Number:{' '}
            <span className="text-light dark:text-yellow-100">
              {marketItem.number}
            </span>
          </p>
          <Button
            onClick={() => navigate('/wiki/sets/update/' + marketItem.id)}
          >
            Edit set
          </Button>
        </div>
      </div>
      {showGallery > -1 && marketItem.images && (
        <GalleryModal
          list={marketItem.images.map((img) => img.image_url)}
          i={showGallery}
          onClose={() => setShowGallery(-1)}
        />
      )}
    </>
  );
};
