import { useGate, useUnit } from 'effector-react';
import * as model from './model.ts';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../shared/ui/button.tsx';
import { ColumnControl } from '../../shared/lib/column-control';

import { useColumns } from './columns.tsx';
import { Table } from '../../shared/ui/table';
import { mapSetState } from '../../shared/lib/react.ts';
import { DeleteLegoSeries } from '../../features/lego-series/delete';

export const LegoSeriesPage = () => {
  useGate(model.gate);

  const navigate = useNavigate();

  return (
    <div className="h-full w-full flex flex-col">
      <div className="w-full flex items-center justify-between mb-6">
        <div className="flex items-center space-x-6">
          <p className="text-xl">Lego series</p>
          <Button
            className="text-xl max-w-12 h-9 rounded-sm"
            onClick={() => navigate('/wiki/series/add/')}
          >
            new
          </Button>
        </div>
        <ColumnControl model={model.columnControlModel} />
      </div>
      <div className="flex-grow w-full overflow-y-auto">
        <Content />
      </div>
      <DeleteLegoSeries />
    </div>
  );
};

const Content = () => {
  const [series, columnOrder, columnVisibility, columnsSizing, columnSorting] =
    useUnit([
      model.$series,
      model.columnControlModel.$columnOrder,
      model.columnControlModel.$visibility,
      model.columnControlModel.$columnsSizing,
      model.columnControlModel.$columnSorting,
    ]);
  const columns = useColumns();

  return (
    <Table
      columns={columns}
      data={series}
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
