import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import './GalleryModal.scss';
import { addDefaultSrc } from '../../services/utils.ts';

interface GalleryModalProps {
  list: string[];
  i: number;
  onClose: (e: React.MouseEvent) => void;
  changeable?: boolean;
  onUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onDelete?: (i: number) => void;
}

const GalleryModal = (props: GalleryModalProps) => {
  const {
    list,
    i,
    onClose,
    changeable = false,
    onUpload,
    onDelete,
  }: GalleryModalProps = {
    ...props,
  };

  const [index, setIndex] = useState(i);
  const modalElement = useMemo(
    () => document.getElementById('portal_root'),
    [i]
  );

  const listElement = list.map((img, i) => (
    <div className="relative" key={'gallery-' + i}>
      <img
        className="gallery--list_member"
        src={img}
        onError={addDefaultSrc}
        alt=""
        onClick={() => setIndex(i)}
      />
      {changeable && onDelete && (
        <div
          className="gallery--list_delete"
          onClick={(e) => {
            e.stopPropagation();
            index === i && setIndex(index - 1);
            onDelete(i);
          }}
        >
          x
        </div>
      )}
    </div>
  ));

  if (!modalElement) return null;
  return createPortal(
    <div className="gallery" onClick={onClose}>
      <div className="gallery--main" onClick={(e) => e.stopPropagation()}>
        {list.length > 1 && (
          <button
            onClick={() =>
              setIndex((prev) => (prev + list.length - 1) % list.length)
            }
          >
            &lt;
          </button>
        )}
        <img
          onClick={() => setIndex((prev) => (prev + 1) % list.length)}
          className="gallery--image"
          src={list.length ? list[index] : ''}
          alt=""
          onError={addDefaultSrc}
        />
        {list.length > 1 && (
          <button onClick={() => setIndex((prev) => (prev + 1) % list.length)}>
            &gt;
          </button>
        )}
      </div>
      {list.length > 1 && (
        <div className="gallery--index">
          {index + 1}/{list.length}
        </div>
      )}
      <div className="gallery--list" onClick={(e) => e.stopPropagation()}>
        {listElement}

        {changeable && (
          <div>
            <input
              accept=".jpg, .jpeg, .png"
              className="hidden"
              type="file"
              name="input_image"
              id="input_image"
              onChange={onUpload}
            />
            <label htmlFor="input_image" className="gallery--list_input">
              +
            </label>
          </div>
        )}
      </div>
    </div>,
    modalElement
  );
};

export default GalleryModal;
