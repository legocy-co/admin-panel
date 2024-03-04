import { useNavigate, useParams } from 'react-router-dom';
import { useGate, useUnit } from 'effector-react';
import * as model from './model.ts';
import { PageHeading } from '../../../shared/ui/page-heading.tsx';
import { Button } from '../../../shared/ui/button.tsx';
import React, { useState } from 'react';
import toaster from '../../../shared/lib/react-toastify.ts';
import { userService } from '../../../services/UserService.ts';
import { addDefaultSrc } from '../../../services/utils.ts';
import GalleryModal from '../../../components/GalleryModal';

export const UserDetailPage = () => {
  const params = useParams<'id'>();
  const navigate = useNavigate();

  useGate(model.gate, { id: params.id ?? null, navigate });

  const user = useUnit(model.$userDetail);
  const images = useUnit(model.$userImages);

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
      await userService.UploadUserImage(data, user.id);

      model.imagesChanged();
    }
  }

  return (
    <div className="w-full h-screen flex flex-col items-center">
      <PageHeading to="/users/" />
      {images.length > 0 && (
        <img
          className="w-[300px] md:w-[595px] h-[200px] md:h-[470px] object-cover object-center rounded-md bg-silver cursor-pointer transition-opacity hover:opacity-90 active:opacity-80"
          src={'' + images?.slice(0, 1).map((img) => img.downloadURL)}
          onError={addDefaultSrc}
          onClick={() => setShowGallery(0)}
          alt=""
        />
      )}
      <div className="my-10">
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
          className="text-center cursor-pointer p-5 bg-legocy rounded-xl text-2xl text-black transition-colors hover:bg-legocy-hover active:bg-legocy-active z-10"
        >
          Upload image
        </label>
      </div>
      <div className="w-[250px] md:w-[577px] align-top inline-block text-xl">
        <p className="text-3xl font-semibold mb-10">{user.username}</p>
        <div className="flex flex-col justify-between h-48 mb-4">
          <p>
            Email:{' '}
            <span className="text-light dark:text-yellow-100">
              {user.email}
            </span>
          </p>
          <p>
            Role:{' '}
            <span className="text-light dark:text-yellow-100">{user.role}</span>
          </p>
        </div>
        <Button
          className="mb-8"
          onClick={() => navigate('/users/update/' + user.id)}
        >
          Edit user
        </Button>
      </div>
      {showGallery > -1 && images && (
        <GalleryModal
          list={images.map((img) => img.downloadURL!)}
          i={showGallery}
          onClose={() => setShowGallery(-1)}
        />
      )}
    </div>
  );
};
