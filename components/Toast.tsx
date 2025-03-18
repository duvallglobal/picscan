import { Toaster } from 'react-hot-toast';

export function Toast() {
  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        duration: 3000,
        style: {
          background: '#333',
          color: '#fff',
        },
      }}
    />
  );
}
