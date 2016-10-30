export type Dependency = {
    project: string,
    dependedOnProject: string
};

export class Graph {
    _nodes: Node[] = [];

    addNode(node : Node) {
        this._nodes.push(node);
    }

    getNode(value : string) : Node {
        for (let node of this._nodes) {
            if (node.value === value) {
                return node;
            }
        }
        return null;
    }

    get nodes() : Node[] {
        return this._nodes;
    }
}

export class Node {
    private _children: Node[] = [];
    private _visited : boolean = false;

    constructor(private _value : string) {
    }

    addChild(node : Node) {
        this._children.push(node);
    }

    visit() {
        this._visited = true;
    }

    get visited() : boolean {
        return this._visited;
    }

    get value() : string {
        return this._value;
    }

    get children() : Node[] {
        return this._children;
    }
}

export function determineBuildOrder(projects : string[], dependencies : Dependency[]) : string[] {
    let buildGraph = _buildGraph(projects, dependencies);
    let buildOrderProjects : string[] = [];
    while (!_allNodesVisited(buildGraph)) {
        buildOrderProjects.push(_findNextProjectToBuild(buildGraph));
    }
    return buildOrderProjects;
}

function _buildGraph(projects : string[], dependencies : Dependency[]) : Graph {
    let graph = new Graph();
    for (let project of projects) {
        graph.addNode(new Node(project));
    }
    for (let node of graph.nodes) {
        for (let dependency of dependencies) {
            if (dependency.project === node.value) {
                node.addChild(graph.getNode(dependency.dependedOnProject));
            }
        }
    }
    return graph;
}

function _allNodesVisited(buildGraph : Graph) : boolean {
    for (let node of buildGraph.nodes) {
        if (!node.visited) {
            return false;
        }
    }
    return true;
}

function _findNextProjectToBuild(buildGraph : Graph) {
    for (let node of buildGraph.nodes) {
        let numNonVisitedDependencies = _findNumberOfNonVisitedDependencies(node);
        if (numNonVisitedDependencies === 0 && !node.visited) {
            node.visit();
            return node.value;
        }
    }

    throw new Error("No valid build order possible");
}

function _findNumberOfNonVisitedDependencies(node : Node) : number {
    let numberNonVisitedDependencies = 0;
    for (let child of node.children) {
        if (!child.visited)  {
            numberNonVisitedDependencies++;
        }
    }
    return numberNonVisitedDependencies;
}
