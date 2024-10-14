import { Row } from "../Model/Row.tsx";

class TaskNode {
  rowIdx: string; // row index that represents the task node for example 1.2.1 (first child of the second child of first node)
  rowNumber: number; // index of a task in a row array (0,1,2,3,etc.)
  row: Row; // Row information
  children: TaskNode[]; // array with children nodes of the taskNode
  isLastChild: boolean;
  level: number;
  parent: TaskNode | null; // parent task node

  constructor(row: Row, rownumber: number, parent: TaskNode | null = null) {
    this.rowIdx = row.idx;
    this.rowNumber = rownumber; // Placeholder, will be set when added to rows array
    this.row = row;
    this.parent = parent;
    this.children = [];
    this.isLastChild = false;
    this.level = row.idx.split(".").length; // Task level depends on the number of dots in the index
  }

  // Add a child to the node
  addChild(newChild: TaskNode) {
    this.children.push(newChild);
    this.updateLastChildFlags();
  }

  // Remove a child along with all its subtasks
  removeChild(index: string) {
    const childIndex = this.children.findIndex(
      (child) => child.rowIdx === index
    );
    if (childIndex !== -1) {
      this.children.splice(childIndex, 1);
      this.updateLastChildFlags();
    }
  }

  // Increment the task index
  incrementIndex(index: string): string {
    const parts = index.split(".").map(Number);
    parts[parts.length - 1] += 1;
    const newIdx = parts.join(".");
    this.rowIdx = newIdx;
    this.row.idx = newIdx;
    return newIdx;
  }

  // Decrement the task index
  decrementIndex(index: string): string {
    const parts = index.split(".").map(Number);
    parts[parts.length - 1] -= 1;
    const newIdx = parts.join(".");
    this.rowIdx = newIdx;
    this.row.idx = newIdx;
    return newIdx;
  }

  addChildren(numberOfChildren: number) {
    const baseIndex = this.rowIdx;
    const existingChildrenCount = this.children.length;
    let startIndex = existingChildrenCount + 1;

    for (let i = 0; i < numberOfChildren; i++) {
      const newIndex = `${baseIndex}.${startIndex + i}`;
      const newTask = new TaskNode(
        this.generateRow(newIndex, ""),
        this.rowNumber + i + 1,
        this
      );
      this.children.push(newTask);
    }
  }

  // Recursively update the indices of children
  updateChildIndexRecursive(newIndex: string) {
    this.rowIdx = newIndex;
    this.row.idx = newIndex; // Update row's index

    // Update the children's indexes recursively
    for (let child of this.children) {
      // Calculate the new index for the child
      const childOldParts = child.rowIdx.split(".");
      const childNewParts = newIndex.split(".");
      childNewParts.push(
        String(Number(childOldParts[childOldParts.length - 1])
      ));
    
      const childNewIndex = childNewParts.join(".");

      // Recursively update the child's index and its descendants
      child.updateChildIndexRecursive(childNewIndex);
    }
  }

  // Update the isLastChild flag for all children
  updateLastChildFlags() {
    for (let i = 0; i < this.children.length; i++) {
      if (i !== this.children.length - 1) {
        this.children[i].isLastChild = false;
      } else {
        this.children[i].isLastChild = true;
      }
    }
  }

  private generateRow(idx: string, name: string): Row {
    return {
      idx,
      name,
      duration: "",
      start_date: "",
      end_date: "",
      hours: "",
      worker_id: "",
      predecessor: "",
    };
  }

  reverseChildrenOrder() {
    this.children.reverse();
    for (let child of this.children) {
      child.reverseChildrenOrder();
    }
  }

  orderChildrenByIndex() {
    this.children.sort((a, b) => {
      const aParts = a.rowIdx.split('.').map(Number);
      const bParts = b.rowIdx.split('.').map(Number);
  
      for (let i = 0; i < Math.min(aParts.length, bParts.length); i++) {
        if (aParts[i] !== bParts[i]) {
          return aParts[i] - bParts[i];
        }
      }
  
      return aParts.length - bParts.length;
    });
  
    for (let child of this.children) {
      child.orderChildrenByIndex();
    }
  }
}

export class TaskTree {
  public rows: Row[] = [];
  root: TaskNode;

  constructor(rows: Row[]) {
    this.root = new TaskNode(
      {
        idx: "0",
        name: "Root",
        duration: "",
        start_date: "",
        end_date: "",
        hours: "",
        worker_id: "",
        predecessor: "",
      },
      -1
    );
    this.rows = rows;
    this.buildTree();
  }

  // Find a node based on its index
  private findNode(
    index: string,
    currentNode: TaskNode = this.root
  ): TaskNode | null {
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

    for (const child of this.root.children) {
      nodeMap[child.rowNumber] = child;
    }
    let i = 0;
    for (const row of this.rows) {
      const taskNode = new TaskNode(row, i++);
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
      const parentIndex = row.idx.split(".").slice(0, -1).join(".");
      const parentNode = nodeMap[parentIndex];

      if (parentNode) {
        parentNode.addChild(taskNode);
        taskNode.parent = parentNode; // Set the parent attribute
        parentNode.children.sort((a, b) => a.rowNumber - b.rowNumber);
      }
    }

    this.root.children.sort((a, b) => a.rowNumber - b.rowNumber);
  }

  // Add a new task automatically
  addTask(index: string) {
    const node = this.findNode(index);
    if (node && node.parent) {
      const parent = node.parent;
      const rowNumberIndex = this.rows.findIndex(
        (child) => child.idx === node.rowIdx
      );
      parent.children.reverse();
      const childIndex = parent.children.findIndex(
        (child) => child.rowIdx === index
      );
      let newIndex = this.incrementIndex(index);

      // Generate a new row with a new index and default values
      const newTask = new TaskNode(
        this.generateRow(newIndex, `Task ${newIndex}`),
        rowNumberIndex + 1,
        parent
      );

      // Insert the new task as a sibling
      parent.children.splice(childIndex + 1, 0, newTask);

      // Shift the indices of subsequent tasks
      for (let i = childIndex + 1; i < parent.children.length; i++) {
        parent.children[i].updateChildIndexRecursive(newIndex);
        newIndex = this.incrementIndex(newIndex);
      }
      // Update the last-child flag
      this.root.reverseChildrenOrder();
      this.root.orderChildrenByIndex();
      parent.updateLastChildFlags();
      this.assignRowNumbers();
      this.mapTreeToRows();
    }
  }

  // Remove a task and its children from the tree and the rows array
  removeTask(index: string) {
    const node = this.findNode(index);
    this.root.orderChildrenByIndex();
    if (node && node.parent) {
      const parent = node.parent;
      const childIndex = parent.children.findIndex(
        (child) => child.rowIdx === index
      );

      node.parent.removeChild(index);
      // Shift the indices of subsequent tasks
      for (let i = childIndex; i < parent.children.length; i++) {
        const child = parent.children[i];
        const childNewIndex = this.decrementIndex(child.rowIdx);
        child.rowIdx = childNewIndex;
        child.row.idx = childNewIndex;
        child.updateChildIndexRecursive(childNewIndex);
      }

      this.root.orderChildrenByIndex();
      this.assignRowNumbers();
      // Update the last-child flag
      parent.updateLastChildFlags();
      this.mapTreeToRows();
    }
  }

  addSubtasks(index: string, numSubtasks: number) {
    const node = this.findNode(index);
    if (node && node.parent) {
      node.addChildren(numSubtasks);
      // const rowNumberIndex = this.rows.findIndex(
      //   (child) => child.idx === node.rowIdx
      // );
      // for (let i = 0; i < numSubtasks; i++) {
      //   this.rows.splice(rowNumberIndex + i + 1, 0, node.children[i].row);
      // }
      this.root.orderChildrenByIndex();
      this.assignRowNumbers();
      this.mapTreeToRows();
    }
  }

  // Increment the index
  private incrementIndex(index: string): string {
    const parts = index.split(".").map(Number);
    parts[parts.length - 1] += 1;
    return parts.join(".");
  }

  private decrementIndex(index: string): string {
    const parts = index.split(".").map(Number);
    parts[parts.length - 1] -= 1;
    return parts.join(".");
  }

  // Generate a new Row with default values
  private generateRow(idx: string, name: string): Row {
    return {
      idx,
      name: "",
      duration: "",
      start_date: "",
      end_date: "",
      hours: "",
      worker_id: "",
      predecessor: "",
    };
  }

  assignRowNumbers() {
    let currentRowNumber = 0;

    const assignRowNumberRecursive = (node: TaskNode) => {
      node.rowNumber = currentRowNumber++;
      for (let child of node.children) {
        assignRowNumberRecursive(child);
      }
    };

    assignRowNumberRecursive(this.root);
  }

  mapTreeToRows() {
    const rows: Row[] = [];

    const mapTreeToRowsRecursive = (node: TaskNode) => {
      if (node.row.idx !== "0") rows.push(node.row);
      node.children.sort((a, b) => a.rowNumber - b.rowNumber);
      for (let child of node.children) {
        mapTreeToRowsRecursive(child);
      }
    };

    mapTreeToRowsRecursive(this.root);
    this.rows = rows;
  }
}
