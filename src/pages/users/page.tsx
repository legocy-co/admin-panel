import { useNavigate } from 'react-router-dom';
import { useGate, useUnit } from 'effector-react';
import { ColumnControl } from '../../shared/lib/column-control';
import { Pagination } from '../../shared/lib/pagination';
import * as model from './model';
import { useColumns } from './columns.tsx';
import { Table } from '../../shared/ui/table';
import { mapSetState } from '../../shared/lib/react.ts';
import { DeleteMarketItem } from '../../features/market-item/delete';

export const UsersPage = () => {
  useGate(model.gate);

  const navigate = useNavigate();

  return (
    <div className="h-full w-full flex flex-col">
      <div className="w-full flex items-center justify-between mb-6">
        <p className="text-xl">Users</p>
        <ColumnControl model={model.columnControlModel} />
      </div>
      <div className="flex-grow w-full overflow-y-auto">
        <Content />
      </div>
      <Pagination.View model={model.paginationModel} />
      <DeleteMarketItem />
    </div>
  );
};

const Content = () => {
  const [users, columnOrder, columnVisibility, columnsSizing, columnSorting] =
    useUnit([
      model.$marketItems,
      model.columnControlModel.$columnOrder,
      model.columnControlModel.$visibility,
      model.columnControlModel.$columnsSizing,
      model.columnControlModel.$columnSorting,
    ]);

  const navigate = useNavigate();
  const columns = useColumns();

  return (
    <Table
      onRowClick={(user) => navigate(`${user.id}`)}
      columns={columns}
      data={users}
      columnVisibility={columnVisibility}
      setColumnVisibility={(updater) =>
        mapSetState(updater)({
          prevState: columnVisibility,
          update: model.columnControlModel.allColumnsVisibilityChanged,
        })
      }
      columnOrder={columnOrder}
      setColumnOrder={(updater) =>
        mapSetState(updater)({
          prevState: columnOrder,
          update: model.columnControlModel.columnOrderChanged,
        })
      }
      columnSizing={columnsSizing}
      setColumnSizing={(updater) =>
        mapSetState(updater)({
          prevState: columnsSizing,
          update: model.columnControlModel.columnSizeChanged,
        })
      }
      sorting={columnSorting}
      setSorting={(updater) =>
        mapSetState(updater)({
          prevState: columnSorting,
          update: model.columnControlModel.columnSortingChanged,
        })
      }
    />
  );
};
