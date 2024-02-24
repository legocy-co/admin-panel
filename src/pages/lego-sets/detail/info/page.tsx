import { useNavigate, useParams } from 'react-router-dom';
import { useGate, useUnit } from 'effector-react';
import * as model from './model.ts';
import React, { useState } from 'react';
import { addDefaultSrc } from '../../../../services/utils.ts';
import GalleryModal from '../../../../components/GalleryModal';
import { Button } from '../../../../shared/ui/button.tsx';
import { legoSetService } from '../../../../services/LegoSetService.ts';

export const LegoSetDetailInfoPage = () => {
  const params = useParams<'id'>();
  const navigate = useNavigate();

  useGate(model.gate, { id: params.id ?? null, navigate });

  const legoSet = useUnit(model.$legoSetDetail);
  const [showGallery, setShowGallery] = useState<number>(-1);

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.currentTarget.files?.[0];
    if (file) {
      const data = new FormData();
      data.append('file', file);
      await legoSetService.UploadImage(data, legoSet.id);

      model.imagesChanged();
    }
  }

  async function handleImageDelete(i: number) {
    await legoSetService.DeleteImage(legoSet.images![i].id);
    model.imagesChanged();
  }

  return (
    <>
      <div className="mt-8 mb-9 whitespace-nowrap flex flex-col gap-7">
        {legoSet.images ? (
          <img
            className="w-[300px] md:w-[595px] h-[200px] md:h-[470px] object-cover object-center rounded-md bg-silver cursor-pointer transition-opacity hover:opacity-90 active:opacity-80"
            src={'' + legoSet.images?.slice(0, 1).map((img) => img.image_url)}
            onError={addDefaultSrc}
            onClick={() => setShowGallery(0)}
            alt=""
          />
        ) : (
          <div>
            <input
              accept=".jpg, .jpeg, .png"
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
          <p className="text-3xl font-semibold mb-10">{legoSet.name}</p>
          <div className="flex flex-col justify-between h-24 mb-4">
            <p>
              Pieces:{' '}
              <span className="text-light dark:text-yellow-100">
                {legoSet.pieces}
              </span>
            </p>
            <p>
              Series:{' '}
              <span className="text-light dark:text-yellow-100">
                {legoSet.series}
              </span>
            </p>
          </div>
          <p className="mb-9">
            Set Number:{' '}
            <span className="text-light dark:text-yellow-100">
              {legoSet.number}
            </span>
          </p>
          <Button onClick={() => navigate('/wiki/sets/update/' + legoSet.id)}>
            Edit set
          </Button>
        </div>
      </div>
      {showGallery > -1 && legoSet.images && (
        <GalleryModal
          changeable
          onUpload={handleImageUpload}
          onDelete={handleImageDelete}
          list={legoSet.images.map((img) => img.image_url)}
          i={showGallery}
          onClose={() => setShowGallery(-1)}
        />
      )}
    </>
  );
};
