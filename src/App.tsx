import React, { useState, useEffect } from 'react';
import DataGrid, { CellClickArgs } from 'react-data-grid';
import GanttChart from './Components/GanttChart.tsx';
import 'react-data-grid/lib/styles.css';
import ResizableContainer from './Components/ResizableContainer.tsx';
import MyAppBar from './Components/MyAppBar.tsx';
import { Row } from "./Model/Row.tsx";
import { initialRows } from './Model/data.tsx';
import { getColumns } from './Model/ColumArray.tsx';
import { findDepth, rowKeyGetter, findRowIndexByIdx, updateTimeColumns, getParentTaskId, sumParentHours } from './Util/UtilFunctions.tsx';
import { handleAddRow, handleDeleteRow, handleAddSubtasks, handleIndentTask, handleOutdentTask } from './Logic/rowHandlers.tsx';
import ErrorMessage from './Components/ErrorMessage.tsx';
import WorkerList from './Components/WorkerList.tsx';
import { Worker } from './Model/Worker.tsx';
import LinkResourcePicker from './Components/LinkResourcePicker.tsx';
import PDFDocument, { set } from 'pdfkit/js/pdfkit.standalone.js';
import AuthScreen from './Components/AuthScreen.tsx';
import axios from 'axios';
import { htmlToText } from 'html-to-text';
// import PDFDocument from 'pdfkit';
import blobStream from 'blob-stream';
import '@fontsource/roboto/400.css'
import ProjectPicker from './Components/ProjectPicker.tsx';
import NewProjectCreator from './Components/NewProjectCreator.tsx';
import { Project } from './Model/Project.tsx';
import TaskDescriptionWindow from './Components/TaskDescriptionWindow.tsx';

type SelectedCellState = {
  rowIdx: string;
  rowNumber: number;
  depth: number
};

type Description = {
  task_id: string;
  description: string;
}

const App: React.FC = () => {
  const [rows, setRows] = useState<Row[]>(initialRows);
  const [selectedCell, setSelectedCell] = useState<SelectedCellState | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [showWorkerList, setShowWorkerList] = useState(false);
  const [showLinkResource, setShowLinkResource] = useState(false);
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [project_name, setProjectName] = useState<string>('');
  const [user_email, setUserEmail] = useState<string>('');
  const [newProjectCreator, setNewProjectCreator] = useState<boolean>(false);
  const [projectCurrency, setProjectCurrency] = useState<'USD' | 'GBP' | 'PLN' | 'EUR'>('USD');
  const [taskDescriptions, setTaskDescriptions] = useState<Description[]>([]);
  const [showTaskDescription, setShowTaskDescription] = useState<boolean>(false);
  const [infoType, setInfoType] = useState<boolean>(false);

  const handleLoginSuccess = (user_email: string) => {
    setIsLoggedIn(true);
    setUserEmail(user_email);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setSelectedProjectId(null);
    setRows([]);
  };

  useEffect(() => {
    // Fetch projects when the component mounts
    const fetchProjects = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await axios.get('/projects', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setProjects(response.data);
      } catch (error) {
        setInfoType(true);
        setError(error.message);
      }
    };

    if (isLoggedIn) {
      fetchProjects();
    }
  }, [isLoggedIn]);

  const handleProjectSelect = (projectId: number, tasks: any[], workers: any[]) => {
    setSelectedProjectId(projectId);
    tasks = tasks.map((task) => ({
      idx: String(task.task_index),
      name: task.name,
      duration: task.days,
      start_date: task.start_date,
      end_date: task.end_date,
      hours: task.hours,
      worker_id: task.worker,
      parent_idx: '',
      previous: task.previous
    }));
    setRows(tasks);
    workers = workers.map((worker) => ({
      worker_id: worker.worker_id,
      name: worker.name,
      surname: worker.surname,
      job_name: worker.job,
      pay_per_hour: worker.pay
    }));
    setWorkers(workers);
    const selectedProject = projects.find(project => project.project_id === projectId);
    if (selectedProject) {
      setProjectName(selectedProject.project_name);
    }
    setRefreshKey(prevKey => prevKey + 1);
  };

  const handleCellClick = (args: CellClickArgs<Row, unknown>) => {
    setSelectedCell({
      rowIdx: `${args.row.idx}`,
      rowNumber: findRowIndexByIdx(rows, args.row.idx),
      depth: findDepth(`${args.row.idx}`)
    });
    setSelectedWorkerId(args.row.worker_id);
  };

  const handleChangeProjectCurrency = (currency: 'USD' | 'GBP' | 'PLN' | 'EUR') => {
    setProjectCurrency(currency);
  };

  const handleRowsChange = (updatedRows: Row[], { indexes }: { indexes: number[] }) => {
    try {
      const index = indexes[0];
      const updatedRow = updatedRows[index];

      if (updatedRow.hours !== rows[index].hours) {
        updatedRows = updateHours(updatedRow.idx, updatedRows);
      }
      if (updatedRow.previous !== rows[index].previous) {
        let previous = updatedRows[findRowIndexByIdx(updatedRows, updatedRow.previous)];
        updatedRows[index] = updatePredecessor(updatedRow, previous);
      }
      if (updatedRow.duration !== rows[index].duration) {
        updatedRows[index] = updateEndDate(updatedRow);
      }
      if (updatedRow.end_date !== rows[index].end_date) {
        let successors = getAllSuccessors(updatedRow.idx, updatedRows);
        successors.forEach(successor => {
          updatedRows[findRowIndexByIdx(updatedRows, successor.idx)] = updatePredecessor(successor, updatedRow);
        });
      }
      const newRows = updateTimeColumns(updatedRows, { indexes });
      setRows(newRows);
      setRefreshKey(prevKey => prevKey + 1);
    } catch (error) {
      setInfoType(true);
      setError(error.message);
    }
  };

  const updateRowData = (rowIdx, columnKey, date) => {
    try {
      const updatedRows = [...rows];
      let index = findRowIndexByIdx(rows, rowIdx);
      updatedRows[index] = { ...updatedRows[index], [columnKey]: date };
      let parentIndex = findRowIndexByIdx(updatedRows, getParentTaskId(rowIdx));
      if (parentIndex !== -1 && columnKey === 'end_date') {
        let parentDateValue = new Date(updatedRows[parentIndex].end_date).getTime();
        let dateValue = new Date(date).getTime();

        if (parentDateValue < dateValue) {
          updatedRows[parentIndex] = { ...updatedRows[parentIndex], end_date: date };
        }
      }

      handleRowsChange(updatedRows, { indexes: [index] });
    } catch (error) {
      setInfoType(true);
      setError(error.message);
    }

  };

  const updateHours = (rowIdx, updatedRows) => {
    let parentIndex = findRowIndexByIdx(updatedRows, getParentTaskId(rowIdx));
    if (parentIndex !== -1) {
      updatedRows = sumParentHours(updatedRows, getParentTaskId(rowIdx));
    }

    return updatedRows;
  }

  const updatePredecessor = (updatedRow, previous) => {
    let previousEndDate = new Date(previous.end_date);
    let startDate = new Date(updatedRow.start_date);
    let endDate = new Date(updatedRow.end_date);
    if (previousEndDate.getTime() > startDate.getTime()) {
      updatedRow.start_date = previous.end_date;
      if (endDate.getTime() < previousEndDate.getTime()) {
        updatedRow.end_date = updatedRow.start_date;
      }
      if (updatedRow.duration !== "") {
        let newEndDate = new Date(updatedRow.start_date);
        newEndDate.setDate(newEndDate.getDate() + parseInt(updatedRow.duration, 10));
        updatedRow.end_date = newEndDate.toISOString().split('T')[0];
      }
    }
    return updatedRow;
  }

  const updateEndDate = (row) => {
    let startDate = new Date(row.start_date);
    let duration = parseInt(row.duration, 10);
    let endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + duration);
    row.end_date = endDate.toISOString().split('T')[0];
    return row;
  }

  const getAllSuccessors = (rowIdx, rows) => {
    let successors = new Array<Row>();
    rows.forEach(row => {
      if (row.previous === rowIdx) {
        successors.push(row);
      }
    });
    return successors;
  }

  const handleCloseError = () => {
    setError(null);
  };

  const handleDefineResource = () => {
    setShowWorkerList(!showWorkerList);
  };

  const handleAddWorker = (newWorker: Worker) => {
    setWorkers([...workers, { ...newWorker, worker_id: (workers.length + 1).toString() }]);
  };

  const handleDeleteWorker = (worker_id: string) => {
    setWorkers(workers.filter(worker => worker.worker_id !== worker_id));
  };

  const handleModifyWorker = (modifiedWorker: Worker) => {
    setWorkers(workers.map(worker => (worker.worker_id === modifiedWorker.worker_id ? modifiedWorker : worker)));
  };

  const handleLinkResource = () => {
    setShowLinkResource(!showLinkResource);
  };

  const showNewProjectCreator = () => {
    setNewProjectCreator(true);
  }

  const closeNewProjectCreator = () => {
    setNewProjectCreator(false);
  }

  const handleCreateNewProject = (project: string, project_start: string) => {
    setProjectName(project);
    const newRows = new Array<Row>();
    for (let i = 1; i < 21; i++) {
      newRows.push({ idx: String(i), name: 'Task ' + String(i), duration: '1', start_date: project_start, end_date: project_start, hours: '1', worker_id: '', parent_idx: '', previous: '' });
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setInfoType(true);
      setError('No token found');
      return;
    }

    axios.post('/projects', {
      projectName: project,
      projectDescription: '',
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(response => {
      const newProject = response.data;
      setProjects([...projects, newProject]);
      setSelectedProjectId(newProject.project_id);
      setInfoType(false);
      setError('Project created successfully');
    }).catch(error => setError(error.message));

    setRows(newRows);
  };

  const handlePickWorker = (worker_id: string) => {
    if (selectedCell) {
      const updatedRows = [...rows];
      const rowIndex = selectedCell.rowNumber;
      updatedRows[rowIndex] = { ...updatedRows[rowIndex], worker_id };
      setRows(updatedRows);
      setRefreshKey(prevKey => prevKey + 1);
    }
  };

  const handleUnlinkResource = () => {
    if (selectedCell) {
      const updatedRows = [...rows];
      const rowIndex = selectedCell.rowNumber;
      updatedRows[rowIndex] = { ...updatedRows[rowIndex], worker_id: '' };
      setRows(updatedRows);
      setRefreshKey(prevKey => prevKey + 1);
    }
  };

  const handleAddTaskDescription = (task_idx: string, description: string) => {
    setTaskDescriptions(prevDescriptions => {
      const existingDescriptionIndex = prevDescriptions.findIndex(desc => desc.task_id === task_idx);
      if (existingDescriptionIndex !== -1) {
        const updatedDescriptions = [...prevDescriptions];
        updatedDescriptions[existingDescriptionIndex].description = description;
        return updatedDescriptions;
      } else {
        return [...prevDescriptions, { task_id: task_idx, description: description }];
      }
    });
  };

  const handleInitDescription = () => {
    const description = taskDescriptions.find((description) => {
      return description.task_id === selectedCell?.rowIdx;
    })?.description;

    return description === undefined ? "" : description;
  }

  const handleSaveProject = () => {
    const token = localStorage.getItem('token');
    const body = {
      project_name: project_name,
      project_description: '',
      tasks: rows.map(row => ({
        task_id: rows.findIndex(r => r.idx === row.idx) + 1,
        task_index: row.idx,
        project_id: selectedProjectId,
        name: row.name,
        days: row.duration,
        start_date: row.start_date,
        end_date: row.end_date,
        hours: row.hours,
        worker: row.worker_id,
        parent: row.parent_idx,
        previous: row.previous,
        description: taskDescriptions.find(description => description.task_id === row.idx)?.description || ''
      })),
    }
    if (!token) {
      setInfoType(true);
      setError('No token found');
      return;
    }

    axios.put(`/projects/${selectedProjectId}`, body, {
      headers: {
        Authorization: `Bearer ${token}`
      }
      
    }).then(_ => {
      setInfoType(false);
      setError('Project saved successfully');
    })
    .catch(error => setError(error.message));
  };

  const handleGenerateReport = () => {
    // Calculate the starting and ending dates of the project
    const startDate = rows.reduce((earliest, row) => {
      const rowStartDate = new Date(row.start_date);
      return rowStartDate < earliest ? rowStartDate : earliest;
    }, new Date(rows[0].start_date));

    const endDate = rows.reduce((latest, row) => {
      const rowEndDate = new Date(row.end_date);
      return rowEndDate > latest ? rowEndDate : latest;
    }, new Date(rows[0].end_date));

    // Calculate the total amount of hours
    const totalHours = rows.reduce((sum, row) => {
      const depth = row.idx.split('.').length;
      if (depth === 1) {
        const hours = parseFloat(row.hours);
        if (!isNaN(hours)) {
          return sum + hours;
        }
      }
      return sum;
    }, 0);

    // List the workers working on the project
    const workersOnProject = workers.filter(worker =>
      rows.some(row => row.worker_id === worker.worker_id)
    );

    // Calculate the total cost of the project
    const totalCost = rows.reduce((sum, row) => {
      const worker = workers.find(worker => worker.worker_id === row.worker_id);
      if (worker) {
        return sum + worker.pay_per_hour * parseFloat(row.hours);
      }
      return sum;
    }, 0);

    // Generate lists of tasks for each worker
    const tasksByWorker = workersOnProject.map(worker => {
      const tasks = rows
        .filter(row => row.worker_id === worker.worker_id)
        .map(row => ({
          task_name: row.name,
          task_id: row.idx,
          start_date: row.start_date,
          end_date: row.end_date,
          hours: row.hours
        }));
      const totalHours = tasks.reduce((sum, task) => sum + parseFloat(task.hours), 0);
      const totalPay = totalHours * worker.pay_per_hour;
      return {
        worker,
        tasks,
        totalHours,
        totalPay
      };
    });

    const fetchFont = async (url: string): Promise<ArrayBuffer> => {
      const response = await fetch(url);
      if (!response.ok) {
        setError('Failed to fetch font');
        setInfoType(true);
      }
      return await response.arrayBuffer();
    };

    // Generate the report
    const generateReport = async () => {
      const report = {
        startDate: startDate.toISOString().split('T')[0],
        endDate: endDate.toISOString().split('T')[0],
        totalHours,
        workersOnProject,
        totalCost,
        tasksByWorker
      };

      const fontBuffer = await fetchFont('/Roboto-Medium.ttf');

      // Create a new PDF document
      const doc = new PDFDocument();

      // Create a stream to blob
      const stream = doc.pipe(blobStream());

      doc.registerFont('Roboto', fontBuffer);

      doc.font('Roboto');

      // Add title
      doc.fontSize(18).text('Project Report', { align: 'center' });

      // Add project dates
      doc.moveDown();
      doc.fontSize(12).text(`Start Date: ${report.startDate}`);
      doc.text(`End Date: ${report.endDate}`);

      // Add total hours
      doc.moveDown();
      doc.text(`Total Hours: ${report.totalHours}`);

      const currencySymbol = (() => {
        switch (projectCurrency) {
          case 'USD':
            return '$';
          case 'EUR':
            return '€';
          case 'PLN':
            return 'zł';
          case 'GBP':
            return '£';
          default:
            return '';
        }
      })();
      // Add total cost
      doc.moveDown();
      doc.text(`Total Cost: ${report.totalCost.toFixed(2)}${currencySymbol}`);

      // Add workers list
      doc.moveDown();
      doc.text('Workers on Project:');
      report.workersOnProject.forEach((worker) => {
        doc.text(`${worker.name} ${worker.surname} - ${worker.job_name}`);
      });

      // Add total hours and pay for each worker at the start
      doc.addPage();
      doc.fontSize(14).text('Total Hours and Pay for Each Worker:', { underline: true });
      report.tasksByWorker.forEach((workerReport) => {
        doc.moveDown();
        doc.fontSize(12).text(`Worker: ${workerReport.worker.name} ${workerReport.worker.surname}`);
        doc.text(`Total Hours: ${workerReport.totalHours}`);
        doc.text(`Total Pay: ${workerReport.totalPay.toFixed(2)}${currencySymbol}`);
      });

      // Add tasks by worker
      doc.moveDown();
      report.tasksByWorker.forEach((workerReport, index) => {
        if (index > 0) {
          doc.addPage();
        }
        doc.moveDown();
        doc.fontSize(14).text(`Tasks for ${workerReport.worker.name} ${workerReport.worker.surname}:`, { underline: true });
        workerReport.tasks.forEach((task) => {
          doc.moveDown();
          doc.fontSize(12).text(`Task name: ${task.task_name}`);
          doc.text(`Start Date: ${task.start_date}`);
          doc.text(`End Date: ${task.end_date}`);
          doc.text(`Hours: ${task.hours}`);
          doc.text(`Total Pay: ${(parseFloat(task.hours) * workerReport.worker.pay_per_hour).toFixed(2)}${currencySymbol}`);
          const description = taskDescriptions.find(description => description.task_id === task.task_id)?.description || 'No description';
          // Convert HTML to plain text with basic formatting
          const textDescription = htmlToText(description, {
            wordwrap: 130,
            tags: {
              'a': { options: { hideLinkHrefIfSameAsText: true } },
              'b': { format: 'bold' },
              'i': { format: 'italic' },
              'u': { format: 'underline' },
            }
          });
          doc.text(`Description:`);
          doc.text(textDescription);
        });
      });

      // Finalize the PDF and end the stream
      doc.end();

      // When the stream is finished, create a blob and trigger the download
      stream.on('finish', function () {
        const blob = stream.toBlobURL('application/pdf');
        window.open(blob);
      });
    };

    // Call the generateReport function
    generateReport().catch(error => console.error(error));
  };

  const gridElement = (
    <DataGrid
      key={refreshKey}
      rowKeyGetter={rowKeyGetter}
      columns={getColumns(rows, workers, updateRowData)}
      rows={rows}
      defaultColumnOptions={{
        resizable: true
      }}
      onRowsChange={handleRowsChange}
      className="fill-grid"
      onCellClick={handleCellClick}
    />
  );

  return (
    <div>
      {isLoggedIn ? (
        selectedProjectId ? (
          <>
            <MyAppBar project_name={project_name} user_email={user_email} projects={projects} project_currency={projectCurrency} onProjectSelect={handleProjectSelect} onAddRow={() => handleAddRow(rows, setRows, selectedCell, setSelectedCell)}
              onDeleteRow={() => handleDeleteRow(rows, setRows, selectedCell, setSelectedCell)}
              onAddSubtasks={(numSubtasks) => handleAddSubtasks(rows, setRows, selectedCell, numSubtasks, setSelectedCell)}
              onIndentRow={() => handleIndentTask(rows, setRows, selectedCell, setSelectedCell)}
              onOutdentRow={() => handleOutdentTask(rows, setRows, selectedCell, setSelectedCell)}
              onHandleResources={handleDefineResource}
              onLinkResource={handleLinkResource}
              onUnlinkResource={handleUnlinkResource}
              onGenerateReport={handleGenerateReport}
              onLogout={handleLogout}
              onSaveProject={handleSaveProject}
              onCreateNewProject={showNewProjectCreator}
              onAddTaskDescription={() => setShowTaskDescription(true)}
              handleChangeProjectCurrency={handleChangeProjectCurrency}
            />
            <div id="main-content">
              <ResizableContainer>
                <div id="spreadsheet-container" className="spreadsheet-container">{gridElement}</div>
                <div id="gantt-chart-container" className="fill-grid">
                  <GanttChart project_name={project_name} key={refreshKey} rows={rows} />
                </div>
              </ResizableContainer>
              <WorkerList
                isOpen={showWorkerList}
                currency={projectCurrency}
                onRequestClose={() => {
                  setShowWorkerList(false);
                  setWorkers(workers);
                }}
                workers={workers}
                onAddWorker={handleAddWorker}
                onDeleteWorker={handleDeleteWorker}
                onModifyWorker={handleModifyWorker}
              />
              <LinkResourcePicker
                isOpen={showLinkResource}
                onRequestClose={() => setShowLinkResource(false)}
                workers={workers}
                onPickWorker={handlePickWorker}
                selectedWorkerId={selectedWorkerId}
              />
              <NewProjectCreator isOpen={newProjectCreator} onRequestClose={closeNewProjectCreator} onCreateProject={handleCreateNewProject} />
              <ErrorMessage message={error} onClose={handleCloseError} type={infoType}/>
              <TaskDescriptionWindow isModalOpen={showTaskDescription} initialDescription={handleInitDescription()} task_id={selectedCell?.rowIdx} onSave={handleAddTaskDescription} onCancel={() => setShowTaskDescription(false)} />
            </div>
          </>
        ) : (
          <div>
            <NewProjectCreator isOpen={newProjectCreator} onRequestClose={closeNewProjectCreator} onCreateProject={handleCreateNewProject} />
            <ProjectPicker handleCloseDrawer={() => { }} projects={projects} onProjectSelect={handleProjectSelect} onCreateNewProject={showNewProjectCreator} />
          </div>
        )
      ) : (
        <AuthScreen onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
};

export default App;