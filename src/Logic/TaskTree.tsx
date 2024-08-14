import { Row } from "../Model/Row.tsx";

  type TaskNode = {
    rowIdx: string; // row index that represents the task node for example 1.2.1 (first child of the second child of first node)
    rowNumber: number; // index of a task in a row array (0,1,2,3,etc.)
    row: Row; // Row infor
    children: TaskNode[]; // array with children nodes of the taskNode
    parent: TaskNode | null; // parent task node
  }

  
  
  export class TaskTree {
    private nodes: TaskNode[] = [];
    // make sure that the order of the elements in both arrays correspond to one another
    public rows: Row[] = [];
  
    constructor(rows: Row[]) {
        this.rows = rows;
        this.buildTree();
      }
    
      private buildTree(): void {
        const nodeMap: { [key: string]: TaskNode } = {};
    
        // Create TaskNode objects for each row and store them in a map
        this.rows.forEach((row, index) => {
          const rowIdx = row.idx; // Assuming Row has an idx property
          const taskNode: TaskNode = {
            rowIdx,
            rowNumber: index,
            row,
            children: [],
            parent: null
          };
          nodeMap[rowIdx] = taskNode;
          this.nodes.push(taskNode);
        });
    
        // Set parent and children relationships
        this.nodes.forEach(node => {
          const parentIdx = node.rowIdx.substring(0, node.rowIdx.lastIndexOf('.'));
          if (parentIdx) {
            const parentNode = nodeMap[parentIdx];
            if (parentNode) {
              node.parent = parentNode;
              parentNode.children.push(node);
            }
          }
        });
      }

    public addTask = (currentCellIdx: string): void => {
        const selectedNode = this.findNodeByCellIdx(currentCellIdx);
        if (selectedNode) {
          const parentNode = selectedNode.parent;
          if (parentNode) {
            const newRowIdx = `${parentNode.rowIdx}.${parentNode.children.length + 1}`;
            const newRowNumber = this.rows.length;
            const newRow: Row = { ...selectedNode.row, idx: newRowIdx }; // Assuming Row has an idx property
            const newTaskNode: TaskNode = {
              rowIdx: newRowIdx,
              rowNumber: newRowNumber,
              row: newRow,
              children: [],
              parent: parentNode
            };
            parentNode.children.push(newTaskNode);
            this.nodes.push(newTaskNode);
            this.rows.push(newRow);
          } else {
            // If there is no parent, it means the selected node is a root node
            const newRowIdx = `${this.nodes.length + 1}`;
            const newRowNumber = this.rows.length;
            const newRow: Row = { ...selectedNode.row, idx: newRowIdx }; // Assuming Row has an idx property
            const newTaskNode: TaskNode = {
              rowIdx: newRowIdx,
              rowNumber: newRowNumber,
              row: newRow,
              children: [],
              parent: null
            };
            this.nodes.push(newTaskNode);
            this.rows.push(newRow);
          }
        }
    }
  
    public deleteTask = (currentCellIdx: string): void => {
      const nodeToDelete = this.findNodeByCellIdx(currentCellIdx);
      if (nodeToDelete) {
        const parentNode = nodeToDelete.parent;
        if (parentNode) {
          parentNode.children = parentNode.children.filter(child => child.rowIdx !== currentCellIdx);
        }
        this.nodes = this.nodes.filter(node => node.rowIdx !== currentCellIdx);
        this.rows = this.rows.filter(row => row.idx !== currentCellIdx);
      }
    }
  
    public addSubtasks = (currentCellIdx: string, numberOfSubtasks: number): void => {
      const parentNode = this.findNodeByCellIdx(currentCellIdx);
      if (parentNode) {
        for (let i = 0; i < numberOfSubtasks; i++) {
          const newRowIdx = `${parentNode.rowIdx}.${parentNode.children.length + 1}`;
          const newRowNumber = this.rows.length;
          const newRow: Row = { ...parentNode.row, idx: newRowIdx }; // Assuming Row has an idx property
          const newTaskNode: TaskNode = {
            rowIdx: newRowIdx,
            rowNumber: newRowNumber,
            row: newRow,
            children: [],
            parent: parentNode
          };
          parentNode.children.push(newTaskNode);
          this.nodes.push(newTaskNode);
          this.rows.push(newRow);
        }
      }
    }
  
    public outdentTask = (currentCellIdx: string): void => {
      const nodeToOutdent = this.findNodeByCellIdx(currentCellIdx);
      if (nodeToOutdent && nodeToOutdent.parent) {
        const parentNode = nodeToOutdent.parent;
        const grandParentNode = parentNode.parent;
        if (grandParentNode) {
          const newRowIdx = `${grandParentNode.rowIdx}.${grandParentNode.children.length + 1}`;
          nodeToOutdent.rowIdx = newRowIdx;
          nodeToOutdent.parent = grandParentNode;
          grandParentNode.children.push(nodeToOutdent);
          parentNode.children = parentNode.children.filter(child => child.rowIdx !== currentCellIdx);
          this.updateRowIndices();
        }
      }
    }
  
    public indentTask = (rowNumber: number): void => {
      if (rowNumber > 0) {
        const nodeToIndent = this.nodes[rowNumber];
        const newParentNode = this.nodes[rowNumber - 1];
        const newRowIdx = `${newParentNode.rowIdx}.${newParentNode.children.length + 1}`;
        nodeToIndent.rowIdx = newRowIdx;
        nodeToIndent.parent = newParentNode;
        newParentNode.children.push(nodeToIndent);
        this.updateRowIndices();
      }
    }
  
    private findNodeByCellIdx = (cellIdx: string): TaskNode | null => {
      return this.nodes.find(node => node.rowIdx === cellIdx) || null;
    }
  
    private updateRowIndices = (): void => {
      this.nodes.forEach((node, index) => {
        node.rowNumber = index;
        this.rows[index] = node.row;
      });
    }
  }