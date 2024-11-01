class TreeNode {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.type = data.type;
    this.isDirectory = data.isDirectory;
    this.metadata = data.metadata;
    this.children = [];
    this.parent = null;
    this.path = data.path;
  }

  addChild(child) {
    child.parent = this;
    this.children.push(child);
    return child;
  }

  removeChild(childId) {
    const index = this.children.findIndex(child => child.id === childId);
    if (index !== -1) {
      const [removed] = this.children.splice(index, 1);
      removed.parent = null;
      return removed;
    }
    return null;
  }

  updatePath() {
    this.path = this.parent
      ? `${this.parent.path}/${this.name}`
      : `/${this.name}`;
    this.children.forEach(child => child.updatePath());
  }
}

export function buildTree(items) {
  const nodes = new Map();
  const root = new TreeNode({ id: 'root', name: '', isDirectory: true });

  // Create nodes
  items.forEach(item => {
    nodes.set(item.id, new TreeNode(item));
  });

  // Build relationships
  items.forEach(item => {
    const node = nodes.get(item.id);
    const parentId = item.metadata?.parentId;

    if (parentId && nodes.has(parentId)) {
      nodes.get(parentId).addChild(node);
    } else {
      root.addChild(node);
    }
  });

  // Update all paths
  root.children.forEach(child => child.updatePath());

  return root.children;
}
