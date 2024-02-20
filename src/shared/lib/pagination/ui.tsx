import { PaginationModel } from './model.ts';
import * as Popover from '@radix-ui/react-popover';
import { useState } from 'react';
import { useUnit } from 'effector-react';
import ReactPaginate from 'react-paginate';
import './style.scss';

export const Pagination = ({ model }: { model: PaginationModel }) => {
  return (
    <div className="w-full flex items-center justify-between pt-2">
      <PageCountToggler model={model} />
      <PaginateController model={model} />
    </div>
  );
};

const PageCountToggler = ({ model }: { model: PaginationModel }) => {
  const [open, setOpen] = useState(false);

  const { $pageSize, $paginatedInfo, pageSizeChanged, $totalCount } = model;
  const [pageSize, paginatedInfo, totalCount] = useUnit([
    $pageSize,
    $paginatedInfo,
    $totalCount,
  ]);

  if (totalCount === 0) return null;
  return (
    <div className="flex items-center space-x-8">
      <div className="flex items-center space-x-3">
        <p className="hidden sm:block">Items per page</p>
        <Popover.Root open={open} onOpenChange={setOpen}>
          <Popover.Trigger className="hidden sm:flex p-1 rounded-md hover:bg-legocy transition-colors items-center space-x-2 disabled:hover:!bg-transparent disabled:cursor-not-allowed">
            {pageSize}
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="rounded bg-legocy"
              onClick={() => setOpen(false)}
            >
              {Array.from({ length: 10 }, (_, index) => (
                <button
                  key={index}
                  onClick={() => pageSizeChanged((index + 1) * 10)}
                  type="button"
                  className="text-sm leading-4 w-10 hover:bg-legocy-hover transition-colors px-1 py-1.5"
                >
                  {(index + 1) * 10}
                </button>
              ))}
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      </div>
      <span>{paginatedInfo}</span>
    </div>
  );
};

const PaginateController = ({ model }: { model: PaginationModel }) => {
  const { $pagesCount, $page } = model;
  const [page, pagesCount] = useUnit([$page, $pagesCount]);

  if (pagesCount === 0) return null;
  return (
    <ReactPaginate
      nextLabel={<p>&gt;</p>}
      previousLabel={<p>&lt;</p>}
      containerClassName="pagination-container"
      previousClassName="pagination-prev-btn"
      nextClassName="pagination-prev-btn"
      pageClassName="pagination-page mx-[1px]"
      breakClassName="pagination-page"
      activeClassName="pagination-active-btn"
      onPageChange={({ selected }) => model.pageChanged(selected)}
      forcePage={page}
      pageCount={pagesCount}
    />
  );
};
