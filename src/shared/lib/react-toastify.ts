import { toast } from 'react-toastify';

const showToastSuccess = (text: string) => {
  toast.success(text, {
    toastId: '',
    position: 'bottom-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    type: 'success',
  });
};

const showToastError = (text: string) => {
  toast.error(text, {
    toastId: '',
    position: 'bottom-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    type: 'error',
  });
};

export default {
  showToastSuccess,
  showToastError,
};
