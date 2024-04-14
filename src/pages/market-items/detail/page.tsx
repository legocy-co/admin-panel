import { useNavigate, useParams } from 'react-router-dom';
import { useGate, useUnit } from 'effector-react';
import React, { useState } from 'react';
import { addDefaultSrc } from '../../../services/utils.ts';
import { Button } from '../../../shared/ui/button.tsx';
import GalleryModal from '../../../components/GalleryModal';
import * as model from './model.ts';
import { PageHeading } from '../../../shared/ui/page-heading.tsx';
import toaster from '../../../shared/lib/react-toastify.ts';
import { marketItemService } from '../../../services/MarketItemService.ts';

export const MarketItemDetailPage = () => {
  const params = useParams<'id'>();
  const navigate = useNavigate();

  useGate(model.gate, { id: params.id ?? null, navigate });

  const marketItem = useUnit(model.$marketItemDetail);
  const [showGallery, setShowGallery] = useState<number>(-1);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.[0];
    if (file) {
      if (file.size > 20000000) {
        toaster.showToastError('Maximum file size is 20MB');
        return;
      }

      const data = new FormData();
      data.append('file', file);
      await marketItemService.UploadImage(data, marketItem.id);

      model.imagesChanged();
    }
  }

  async function handleImageDelete(i: number) {
    await marketItemService.DeleteImage(marketItem.images![i].id);
    model.imagesChanged();
  }

  return (
    <div className="w-full h-screen flex flex-col items-center">
      <PageHeading to="/market-items/" />
      <div className="mt-8 mb-9 whitespace-nowrap flex flex-col gap-7">
        {marketItem.images.length > 0 ? (
          <img
            className="w-[300px] md:w-[595px] h-[200px] md:h-[470px] object-cover object-center rounded-md bg-silver cursor-pointer transition-opacity hover:opacity-90 active:opacity-80"
            src={
              '' + marketItem.images?.slice(0, 1).map((img) => img.imageURL)
            }
            onError={addDefaultSrc}
            onClick={() => setShowGallery(0)}
            alt=""
          />
        ) : (
          <div>
            <input
              accept=".jpg, .jpeg, .png, .heic"
              className="hidden"
              type="file"
              name="input_image"
              id="input_image"
              onChange={handleImageUpload}
            />
            <label
              htmlFor="input_image"
              className="text-center cursor-pointer p-5 bg-legocy rounded-xl text-2xl text-black transition-colors hover:bg-legocy-hover active:bg-legocy-active"
            >
              Upload image
            </label>
          </div>
        )}
        <div className="w-[250px] md:w-[577px] align-top inline-block text-xl">
          <p
            onClick={() => navigate('/wiki/sets/' + marketItem.lego_set_id)}
            className="text-3xl font-semibold mb-10 cursor-pointer hover:opacity-90 active:opacity-80"
          >
            {marketItem.lego_set}
          </p>
          <div className="flex flex-col justify-between h-48 mb-4">
            <p>
              Price:{' '}
              <span className="text-light dark:text-yellow-100">
                {marketItem.price}
              </span>
            </p>
            <p>
              Seller:{' '}
              <span className="text-light dark:text-yellow-100">
                {marketItem.seller}
              </span>
            </p>
            <p>
              State:{' '}
              <span className="text-light dark:text-yellow-100">
                {marketItem.set_state}
              </span>
            </p>
            <p>
              Status:{' '}
              <span className="text-light dark:text-yellow-100">
                {marketItem.status}
              </span>
            </p>
          </div>
          <p className="mb-9">
            Location:{' '}
            <span className="text-light dark:text-yellow-100">
              {marketItem.location}
            </span>
          </p>
          <div className="bg-dark border border-solid border-black rounded-xl whitespace-normal py-3.5 pr-5 pl-6 mb-5 sm:mb-28">
            <p>Set description: {marketItem.description}</p>
          </div>
          <Button
            className="mb-8"
            onClick={() => navigate('/market-items/update/' + marketItem.id)}
          >
            Edit market item
          </Button>
        </div>
      </div>
      {showGallery > -1 && marketItem.images.length > 0 && (
        <GalleryModal
          changeable
          onUpload={handleImageUpload}
          onDelete={handleImageDelete}
          list={marketItem.images.map((img) => img.imageURL)}
          i={showGallery}
          onClose={() => setShowGallery(-1)}
        />
      )}
    </div>
  );
};
