import { ColumnControl } from '../../shared/lib/column-control';
import { Pagination } from '../../shared/lib/pagination';
import { useGate, useUnit } from 'effector-react';
import * as model from './model.ts';
import { mapSetState } from '../../shared/lib/react.ts';
import { Table } from '../../shared/ui/table';
import { useNavigate } from 'react-router-dom';
import { useColumns } from './columns.tsx';
import { Button } from '../../shared/ui/button.tsx';
import { DeleteLegoSet } from '../../features/lego-set/delete';
import { EntityFilter } from '../../shared/lib/entity-filter';
import { LegoSetsFilter } from '../../features/lego-set/filter';

export const LegoSetsPage = () => {
  useGate(model.gate);

  const navigate = useNavigate();

  return (
    <EntityFilter.Container model={model.entityFilterModel}>
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
        <div className="flex justify-end pb-4">
          <LegoSetsFilter.View model={model.legoSetsFilterModel} />
        </div>
        <LegoSetsFilter.ActiveFilters model={model.legoSetsFilterModel} />
        <div className="flex-grow w-full overflow-y-auto">
          <Content />
        </div>
        <Pagination.View model={model.paginationModel} />
        <DeleteLegoSet />
      </div>
    </EntityFilter.Container>
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
