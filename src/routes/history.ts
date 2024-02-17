import { To, Location } from 'react-router-dom';

type HistoryProps = {
  navigate: (to: To) => void;
  location: Location | null;
};

export const history: HistoryProps = {
  navigate: () => null,
  location: null,
};
