import { ColumnControl } from '../../shared/lib/column-control';
import { Pagination } from '../../shared/lib/pagination';
import { useGate, useUnit } from 'effector-react';
import * as model from './model.ts';
import { mapSetState } from '../../shared/lib/react.ts';
import { Table } from '../../shared/ui/table';
import { useNavigate } from 'react-router-dom';
import { useColumns } from './columns.tsx';
import { Button } from '../../shared/ui/button.tsx';

export const LegoSetsPage = () => {
  useGate(model.gate);

  const navigate = useNavigate();

  return (
    <div className="h-full w-full flex flex-col">
      <div className="w-full flex items-center justify-between mb-6">
        <div className="flex items-center space-x-6">
          <p className="text-xl">Lego sets</p>
          <Button
            className="text-xl max-w-12 h-9 rounded-sm"
            onClick={() => navigate('/wiki/sets/add/')}
          >
            new
          </Button>
        </div>
        <ColumnControl model={model.columnControlModel} />
      </div>
      <div className="w-full overflow-y-auto flex justify-center">
        <Content />
      </div>
      <Pagination.View model={model.paginationModel} />
    </div>
  );
};

const Content = () => {
  const [sets, columnOrder, columnVisibility, columnsSizing, columnSorting] =
    useUnit([
      model.$sets,
      model.columnControlModel.$columnOrder,
      model.columnControlModel.$visibility,
      model.columnControlModel.$columnsSizing,
      model.columnControlModel.$columnSorting,
    ]);
  const navigate = useNavigate();
  const columns = useColumns();

  return (
    <Table
      onRowClick={(row) => navigate(`${row.id}`)}
      columns={columns}
      data={sets}
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
