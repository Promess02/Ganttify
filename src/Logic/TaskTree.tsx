import { Row } from "../Model/Row.tsx";

class TaskNode {
  rowIdx: string; // row index that represents the task node for example 1.2.1 (first child of the second child of first node)
  rowNumber: number; // index of a task in a row array (0,1,2,3,etc.)
  row: Row; // Row information
  children: TaskNode[]; // array with children nodes of the taskNode
  isLastChild: boolean;
  level: number;
  parent: TaskNode | null; // parent task node

  constructor(row: Row, parent: TaskNode | null = null) {
    this.rowIdx = row.idx;
    this.rowNumber = 0; // Placeholder, will be set when added to rows array
    this.row = row;
    this.parent = parent;
    this.children = [];
    this.isLastChild = false;
    this.level = row.idx.split('.').length; // Task level depends on the number of dots in the index
  }

  // Add a child to the node
  addChild(newChild: TaskNode) {
    this.children.push(newChild);
    this.updateLastChildFlags();
  }

  // Remove a child along with all its subtasks
  removeChild(index: string) {
    const childIndex = this.children.findIndex((child) => child.rowIdx === index);
    if (childIndex !== -1) {
      this.children.splice(childIndex, 1);
      this.updateLastChildFlags();
    }
  }

  // Increment the task index
  incrementIndex(index: string): string {
    const parts = index.split('.').map(Number);
    parts[parts.length - 1] += 1;
    return parts.join('.');
  }

  // Decrement the task index
  decrementIndex(index: string): string {
    const parts = index.split('.').map(Number);
    parts[parts.length - 1] -= 1;
    return parts.join('.');
  }

  // Recursively update the indices of children
  updateChildIndexRecursive(oldIndex: string, newIndex: string) {
    this.rowIdx = newIndex;
    this.row.idx = newIndex; // Update row's index
    for (let child of this.children) {
      const childNewIndex = child.rowIdx.replace(oldIndex, newIndex);
      child.updateChildIndexRecursive(child.rowIdx, childNewIndex);
    }
  }

  // Update the isLastChild flag for all children
  updateLastChildFlags() {
    for (let i = 0; i < this.children.length; i++) {
      this.children[i].isLastChild = i === this.children.length - 1;
    }
  }
}

export class TaskTree {
  public rows: Row[] = [];
  root: TaskNode;

  constructor(rows: Row[]) {
    this.root = new TaskNode({
      idx: '0',
      name: 'Root',
      duration: '',
      start_date: '',
      end_date: '',
      hours: '',
      worker_id: '',
      predecessor: '',
    });
    this.rows = rows;
    this.buildTree();
  }

  // Find a node based on its index
  private findNode(index: string, currentNode: TaskNode = this.root): TaskNode | null {
    const stack: TaskNode[] = [currentNode]; // Initialize a stack with the root node
  
    // Perform depth-first search (DFS) iteratively using a stack
    while (stack.length > 0) {
      const node = stack.pop()!; // Pop the last element in the stack
  
      // Check if this is the node we're looking for
      if (node.rowIdx === index) {
        return node;
      }
  
      // Add children to the stack for further searching
      // We reverse the children array so that the first child gets processed first
      stack.push(...node.children.reverse());
    }
  
    // Return null if the node with the given index wasn't found
    return null;
  }

  private buildTree() {
    const nodeMap: { [key: string]: TaskNode } = {};

    // Add all tasks as TaskNodes, and store them in a map for easy access by index
    for (const row of this.rows) {
      const taskNode = new TaskNode(row);
      nodeMap[row.idx] = taskNode;

      // Add tasks with no dots (e.g., 1, 2, 3) directly under the root
      if (taskNode.level === 1) {
        this.root.addChild(taskNode);
        taskNode.parent = this.root; // Set parent to root
      }
    }

    // Now, link all tasks to their respective parents based on their indices
    for (const row of this.rows) {
      const taskNode = nodeMap[row.idx];

      // Skip root-level tasks as they are already added to the root
      if (taskNode.level === 1) continue;

      // Find parent index (remove the last segment of the index)
      const parentIndex = row.idx.split('.').slice(0, -1).join('.');
      const parentNode = nodeMap[parentIndex];

      if (parentNode) {
        parentNode.addChild(taskNode);
        taskNode.parent = parentNode; // Set the parent attribute
      }
    }

    this.root.children.reverse();
  }

  // Add a new task automatically with generated Row details
  addTask(index: string) {
        if (index === '0') {
          // If adding the first task to root
          if (this.root.children.length === 0) {
            const newTask = new TaskNode(this.generateRow('1', 'Task 1'), this.root);
            this.root.addChild(newTask);
            this.addRow(newTask);
          }
          return;
        }
    
    const node = this.findNode(index);
    if (node && node.parent) {
      const parent = node.parent;
      const siblingIndex = parent.children.findIndex((child) => child.rowIdx === node.rowIdx);
      const newIndex = this.incrementIndex(index);

      // Generate a new row with a new index and default values
      const newTask = new TaskNode(this.generateRow(newIndex, `Task ${newIndex}`), parent);

      // Insert the new task as a sibling
      parent.children.splice(siblingIndex, 0, newTask);
      this.addRow(newTask);

      // Shift the indices of subsequent tasks
      for (let i = siblingIndex + 2; i < parent.children.length; i++) {
        parent.children[i].updateChildIndexRecursive(
          parent.children[i].rowIdx,
          this.incrementIndex(parent.children[i].rowIdx)
        );
      }

      // Update the last-child flag
      parent.updateLastChildFlags();
    }
  }

  // Remove a task and its children from the tree and the rows array
  removeTask(index: string) {
    const node = this.findNode(index);
    if (node && node.parent) {
      this.removeRowsForNode(node);
      node.parent.removeChild(index);
    }
  }

  // Increment the index
  private incrementIndex(index: string): string {
    const parts = index.split('.').map(Number);
    parts[parts.length - 1] += 1;
    return parts.join('.');
  }

  // Add a task node to the rows array
  private addRow(node: TaskNode) {
    node.rowNumber = this.rows.length; // Set the row number
    this.rows.push(node.row); // Add the row to the rows array
  }

  // Remove all rows for a node and its children
  private removeRowsForNode(node: TaskNode) {
    this.rows = this.rows.filter((row) => !row.idx.startsWith(node.rowIdx));
  }

  // Generate a new Row with default values
  private generateRow(idx: string, name: string): Row {
    return {
      idx,
      name: '',
      duration: '',
      // start_date: new Date().toISOString().split('T')[0], // current date
      // end_date: new Date().toISOString().split('T')[0], // current date
      start_date: '',
      end_date: '',
      hours: '',
      worker_id: '', // Default worker id, can be modified
      predecessor: '',
    };
  }

  // Update the index recursively for children
  private updateChildIndexRecursive(node: TaskNode, oldIndex: string, newIndex: string) {
    node.updateChildIndexRecursive(oldIndex, newIndex);
  }
}
