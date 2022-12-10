import type * as worker from '../workers/api.worker';
import * as comlink from 'comlink';
import * as React from 'react';

export type WorkerAPI = comlink.Remote<worker.API>;

export const withAPIWorker = () => {
  const ref = React.useRef<WorkerAPI>();

  React.useEffect(() => {
    const worker = new Worker(new URL('../workers/api.worker', import.meta.url), {
      type: 'module'
    });
    ref.current = comlink.wrap(worker);
  }, []);

  return ref;
};
