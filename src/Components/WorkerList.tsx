import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Worker } from '../Model/Worker.tsx';
import WorkerItem from './WorkerItem.tsx';
import '../styles/WorkerList.css';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

Modal.setAppElement('#root');

interface WorkerListProps {
    isOpen: boolean;
    onRequestClose: () => void;
    workers: Worker[];
    onAddWorker: (worker: Worker) => void;
    onDeleteWorker: (worker_id: string) => void;
    onModifyWorker: (worker: Worker) => void;
  }

  const WorkerList: React.FC<WorkerListProps> = ({ isOpen, onRequestClose, workers, onAddWorker, onDeleteWorker, onModifyWorker }) => {
    const [localWorkers, setLocalWorkers] = useState<Worker[]>([]);
    const [newWorker, setNewWorker] = useState<Worker>({
      worker_id: '',
      name: '',
      surname: '',
      job_name: '',
      pay_per_hour: 0,
    });

  useEffect(() => {
    setLocalWorkers(workers);
  }, [workers]);

  const handleAddWorker = () => {
    onAddWorker(newWorker);
    setNewWorker({ worker_id: '', name: '', surname: '', job_name: '', pay_per_hour: 0 });
  };

  const handleDeleteWorker = (worker_id: string) => {
    onDeleteWorker(worker_id);
  };

  const handleModifyWorker = (modifiedWorker: Worker) => {
    onModifyWorker(modifiedWorker);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewWorker({ ...newWorker, [name]: value });
  };

  const handleClose = () => {
    onRequestClose();
    setLocalWorkers(workers);
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleClose}
      contentLabel="Worker List"
      className="worker-list-modal"
      overlayClassName="worker-list-overlay"
    >
    <IconButton className="close-button" onClick={handleClose} style={{ position: 'absolute', top: 10, right: 10 }}>
        <CloseIcon />
    </IconButton>
      <div className="worker-list">
        <h2>Worker List</h2>
        <div className="new-worker-form">
          <input name="name" placeholder="Name" value={newWorker.name} onChange={handleChange} />
          <input name="surname" placeholder="Surname" value={newWorker.surname} onChange={handleChange} />
          <input name="job_name" placeholder="Job Name" value={newWorker.job_name} onChange={handleChange} />
          <input name="pay_per_hour" type="number" placeholder="Pay per Hour" value={newWorker.pay_per_hour} onChange={handleChange} />
          <button onClick={handleAddWorker}>Add Worker</button>
        </div>
        {workers.map(worker => (
          <WorkerItem key={worker.worker_id} worker={worker} onDelete={handleDeleteWorker} onModify={handleModifyWorker} />
        ))}
      </div>
    </Modal>
  );
};

export default WorkerList;