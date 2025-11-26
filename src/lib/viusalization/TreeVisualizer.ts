import * as d3 from 'd3';
import type TwoThreeTree from '$lib/classes/twoThreeTree';
import type TreeNode from '$lib/classes/node';

interface VisualNode {
	node: TreeNode;
	x: number;
	y: number;
	depth: number;
}

export default class TreeVisualizer {
	private tree: TwoThreeTree;
	private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
	private g: d3.Selection<SVGGElement, unknown, null, undefined>;
	private width: number;
	private height: number;
	private nodeWidth = 80;
	private nodeHeight = 40;
	private levelHeight = 100;

	constructor(container: HTMLElement, tree: TwoThreeTree) {
		this.tree = tree;
		this.width = container.clientWidth || 800;
		this.height = container.clientHeight || 600;

		// Create SVG
		this.svg = d3
			.select(container)
			.append('svg')
			.attr('width', this.width)
			.attr('height', this.height);

		// Create main group for zoom/pan
		this.g = this.svg.append('g').attr('transform', 'translate(0, 50)');

		// Add zoom behavior
		const zoom = d3.zoom<SVGSVGElement, unknown>().on('zoom', (event) => {
			this.g.attr('transform', event.transform);
		});

		this.svg.call(zoom);
	}

	// Convert tree structure to visual nodes with positions
	private calculateLayout(): VisualNode[] {
		if (!this.tree.root) return [];

		const visualNodes: VisualNode[] = [];
		const levelWidths: Map<number, number> = new Map();

		// First pass: calculate how many nodes at each level
		this.traverseForCounting(this.tree.root, 0, levelWidths);

		// Second pass: assign positions
		const levelCounters: Map<number, number> = new Map();
		this.traverseForPositioning(this.tree.root, 0, visualNodes, levelWidths, levelCounters);

		return visualNodes;
	}

	private traverseForCounting(
		node: TreeNode,
		depth: number,
		levelWidths: Map<number, number>,
	): void {
		levelWidths.set(depth, (levelWidths.get(depth) || 0) + 1);

		for (const child of node.children) {
			this.traverseForCounting(child, depth + 1, levelWidths);
		}
	}

	private findParent(node: TreeNode, visualNodes: VisualNode[]): VisualNode | null {
		for (const vNode of visualNodes) {
			if (vNode.node.children.includes(node)) {
				return vNode;
			}
		}
		return null;
	}

	private traverseForPositioning(
		node: TreeNode,
		depth: number,
		visualNodes: VisualNode[],
		levelWidths: Map<number, number>,
		levelCounters: Map<number, number>,
	): void {
		const currentIndex = levelCounters.get(depth) || 0;
		levelCounters.set(depth, currentIndex + 1);

		const totalAtLevel = levelWidths.get(depth) || 1;
		const spacing = this.width / (totalAtLevel + 1);
		const x = spacing * (currentIndex + 1);
		const y = depth * this.levelHeight;

		visualNodes.push({
			node,
			x,
			y,
			depth,
		});

		for (const child of node.children) {
			this.traverseForPositioning(child, depth + 1, visualNodes, levelWidths, levelCounters);
		}
	}

	// Main draw method
	draw(): void {
		// Clear existing
		this.g.selectAll('*').remove();

		const visualNodes = this.calculateLayout();

		if (visualNodes.length === 0) return;

		// Draw links first (so they appear behind nodes)
		this.drawLinks(visualNodes);

		// Draw nodes
		this.drawNodes(visualNodes);
	}

	private drawLinks(visualNodes: VisualNode[]): void {
		const links: Array<{ source: VisualNode; target: VisualNode }> = [];

		// Build link data
		visualNodes.forEach((vNode) => {
			vNode.node.children.forEach((child) => {
				const childVNode = visualNodes.find((vn) => vn.node === child);
				if (childVNode) {
					links.push({ source: vNode, target: childVNode });
				}
			});
		});

		// Draw links
		this.g
			.selectAll('line.link')
			.data(links)
			.join('line')
			.attr('class', 'link')
			.attr('x1', (d) => d.source.x)
			.attr('y1', (d) => d.source.y + this.nodeHeight / 2)
			.attr('x2', (d) => d.target.x)
			.attr('y2', (d) => d.target.y - this.nodeHeight / 2)
			.attr('stroke', '#999')
			.attr('stroke-width', 2);
	}

	private drawNodes(visualNodes: VisualNode[]): void {
		const nodeGroups = this.g
			.selectAll('g.node')
			.data(visualNodes)
			.join('g')
			.attr('class', 'node')
			.attr('transform', (d) => `translate(${d.x}, ${d.y})`);

		// Draw node rectangles
		nodeGroups
			.append('rect')
			.attr('x', -this.nodeWidth / 2)
			.attr('y', -this.nodeHeight / 2)
			.attr('width', this.nodeWidth)
			.attr('height', this.nodeHeight)
			.attr('fill', (d) => (d.node.is3Node() ? '#6366f1' : '#8b5cf6'))
			.attr('stroke', '#1e293b')
			.attr('stroke-width', 2)
			.attr('rx', 5);

		// Draw keys text
		nodeGroups
			.append('text')
			.attr('text-anchor', 'middle')
			.attr('dominant-baseline', 'middle')
			.attr('fill', 'white')
			.attr('font-size', '14px')
			.attr('font-weight', 'bold')
			.text((d) => d.node.keys.join(' | '));
	}

	async animateInsert(value: string): Promise<void> {
		const visualNodes = this.calculateLayout();

		if (visualNodes.length === 0) {
			this.draw();
			return;
		}

		// Find the newly inserted node
		const newNode = this.tree.search(value);
		const newVNode = visualNodes.find((vn) => vn.node === newNode);

		// Update links with transition
		const links: Array<{ source: VisualNode; target: VisualNode }> = [];
		visualNodes.forEach((vNode) => {
			vNode.node.children.forEach((child) => {
				const childVNode = visualNodes.find((vn) => vn.node === child);
				if (childVNode) {
					links.push({ source: vNode, target: childVNode });
				}
			});
		});

		// Animate links
		this.g
			.selectAll('line.link')
			.data(links, (d: any) => `${d.source.node.keys.join('-')}-${d.target.node.keys.join('-')}`)
			.join(
				(enter) =>
					enter
						.append('line')
						.attr('class', 'link')
						.attr('x1', (d) => d.source.x)
						.attr('y1', (d) => d.source.y + this.nodeHeight / 2)
						.attr('x2', (d) => d.source.x)
						.attr('y2', (d) => d.source.y + this.nodeHeight / 2)
						.attr('stroke', '#999')
						.attr('stroke-width', 2)
						.call((enter) =>
							enter
								.transition()
								.duration(500)
								.attr('x2', (d) => d.target.x)
								.attr('y2', (d) => d.target.y - this.nodeHeight / 2),
						),
				(update) =>
					update.call((update) =>
						update
							.transition()
							.duration(500)
							.attr('x1', (d) => d.source.x)
							.attr('y1', (d) => d.source.y + this.nodeHeight / 2)
							.attr('x2', (d) => d.target.x)
							.attr('y2', (d) => d.target.y - this.nodeHeight / 2),
					),
				(exit) => exit.transition().duration(300).style('opacity', 0).remove(),
			);

		// Animate nodes
		const nodeGroups = this.g
			.selectAll('g.node')
			.data(visualNodes, (d: any) => d.node.keys.join('-'))
			.join(
				(enter) => {
					const g = enter
						.append('g')
						.attr('class', 'node')
						.attr('transform', (d) => {
							// New nodes appear at parent position if they have one
							const parent = this.findParent(d.node, visualNodes);
							return parent ? `translate(${parent.x}, ${parent.y})` : `translate(${d.x}, ${d.y})`;
						})
						.style('opacity', 0);

					// Add rectangle
					g.append('rect')
						.attr('x', -this.nodeWidth / 2)
						.attr('y', -this.nodeHeight / 2)
						.attr('width', this.nodeWidth)
						.attr('height', this.nodeHeight)
						.attr('fill', (d) => (d.node.is3Node() ? '#6366f1' : '#8b5cf6'))
						.attr('stroke', '#1e293b')
						.attr('stroke-width', 2)
						.attr('rx', 5);

					// Add text
					g.append('text')
						.attr('text-anchor', 'middle')
						.attr('dominant-baseline', 'middle')
						.attr('fill', 'white')
						.attr('font-size', '14px')
						.attr('font-weight', 'bold')
						.text((d) => d.node.keys.join(' | '));

					// Animate to final position
					g.transition()
						.duration(500)
						.attr('transform', (d) => `translate(${d.x}, ${d.y})`)
						.style('opacity', 1);

					return g;
				},
				(update) => {
					// Update existing nodes
					update
						.transition()
						.duration(500)
						.attr('transform', (d) => `translate(${d.x}, ${d.y})`);

					// Update rectangle color
					update
						.select('rect')
						.transition()
						.duration(500)
						.attr('fill', (d) => (d.node.is3Node() ? '#6366f1' : '#8b5cf6'));

					// Update text
					update.select('text').text((d) => d.node.keys.join(' | '));

					// Highlight if it's the newly inserted node
					if (newVNode) {
						update
							.filter((d) => d.node === newVNode.node)
							.select('rect')
							.transition()
							.duration(200)
							.attr('fill', '#22c55e')
							.transition()
							.duration(300)
							.attr('fill', (d) => (d.node.is3Node() ? '#6366f1' : '#8b5cf6'));
					}

					return update;
				},
				(exit) =>
					exit
						.transition()
						.duration(300)
						.style('opacity', 0)
						.attr('transform', (d) => {
							// Exit nodes shrink to parent position
							const parent = this.findParent(d.node, visualNodes);
							return parent ? `translate(${parent.x}, ${parent.y})` : `translate(${d.x}, ${d.y})`;
						})
						.remove(),
			);

		// Wait for animations to complete
		await new Promise((resolve) => setTimeout(resolve, 500));
	}

	// Clear and redraw
	clear(): void {
		this.g.selectAll('*').remove();
	}

	// Update tree reference (if needed)
	setTree(tree: TwoThreeTree): void {
		this.tree = tree;
		this.draw();
	}
}
