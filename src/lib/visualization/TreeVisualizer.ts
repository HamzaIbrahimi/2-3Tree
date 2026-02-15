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
	private nodeRadius = 18;
	private pillWidth = 55;
	private pillHeight = 36;
	private levelHeight = 80;
	private minHorizontalSpacing = 60;
	private padding = 40; // Increased base padding

	constructor(container: HTMLElement, tree: TwoThreeTree) {
		this.tree = tree;
		this.width = container.clientWidth || 800;
		this.height = container.clientHeight || 600;

		// Create SVG with white background
		this.svg = d3
			.select(container)
			.append('svg')
			.attr('width', '100%')
			.attr('height', '100%')
			.style('background', '#f8fafc');

		// Create main group
		this.g = this.svg.append('g');
	}

	// Helper to calculate node dimensions based on content
	private getNodeDimensions(node: TreeNode): { width: number; height: number; radius: number } {
		const keyText = node.keys.join(' ');
		// Rough estimate: ~8px per character for bold serif font
		const estimatedWidth = Math.max(keyText.length * 8, 30);

		if (node.is2Node()) {
			// For circles, use radius that accommodates text
			const radius = Math.max(this.nodeRadius, estimatedWidth / 2 + 8);
			return { width: radius * 2, height: radius * 2, radius };
		} else {
			// For ellipses (pills), expand width to fit text
			const width = Math.max(this.pillWidth, estimatedWidth + 20);
			const height = this.pillHeight;
			return { width, height, radius: 0 };
		}
	}

	// Calculate positions using a proper tree layout algorithm
	private calculateLayout(): {
		nodes: VisualNode[];
		bounds: { minX: number; maxX: number; maxY: number };
	} {
		if (!this.tree.root) return { nodes: [], bounds: { minX: 0, maxX: 0, maxY: 0 } };

		// Adjust spacing based on tree size (extremely conservative - prioritize readability)
		const treeSize = this.tree.size();
		if (treeSize > 80) {
			this.minHorizontalSpacing = 50;
			this.levelHeight = 75;
			this.nodeRadius = 17.5;
			this.pillWidth = 54;
			this.pillHeight = 35.5;
		} else if (treeSize > 60) {
			this.minHorizontalSpacing = 55;
			this.levelHeight = 78;
			this.nodeRadius = 18;
			this.pillWidth = 55;
			this.pillHeight = 36;
		} else {
			// Keep full size for trees up to 60 nodes
			this.minHorizontalSpacing = 60;
			this.levelHeight = 80;
			this.nodeRadius = 18;
			this.pillWidth = 55;
			this.pillHeight = 36;
		}

		const visualNodes: VisualNode[] = [];

		// Calculate subtree widths first
		const subtreeWidths = new Map<TreeNode, number>();
		this.calculateSubtreeWidths(this.tree.root, subtreeWidths);

		// Position nodes (start from center)
		const rootWidth = subtreeWidths.get(this.tree.root) || 0;
		const startX = rootWidth / 2 + this.padding;
		this.positionNode(this.tree.root, startX, this.padding, 0, visualNodes, subtreeWidths);

		// Calculate bounds with dynamic padding based on content
		let minX = Infinity;
		let maxX = -Infinity;
		let maxY = -Infinity;

		visualNodes.forEach((vn) => {
			const dims = this.getNodeDimensions(vn.node);
			const halfWidth = vn.node.is3Node() ? dims.width / 2 : dims.radius;
			minX = Math.min(minX, vn.x - halfWidth);
			maxX = Math.max(maxX, vn.x + halfWidth);
			maxY = Math.max(maxY, vn.y + (vn.node.is3Node() ? dims.height / 2 : dims.radius));
		});

		// Add extra padding for large numbers
		const extraPadding = this.padding * 1.5;

		return {
			nodes: visualNodes,
			bounds: {
				minX: minX - extraPadding,
				maxX: maxX + extraPadding,
				maxY: maxY + this.padding,
			},
		};
	}

	private calculateSubtreeWidths(node: TreeNode, widthMap: Map<TreeNode, number>): number {
		if (node.isLeaf()) {
			const width = this.minHorizontalSpacing;
			widthMap.set(node, width);
			return width;
		}

		let totalWidth = 0;
		for (const child of node.children) {
			totalWidth += this.calculateSubtreeWidths(child, widthMap);
		}

		// Add spacing between children
		totalWidth += (node.children.length - 1) * this.minHorizontalSpacing;

		widthMap.set(node, totalWidth);
		return totalWidth;
	}

	private positionNode(
		node: TreeNode,
		x: number,
		y: number,
		depth: number,
		visualNodes: VisualNode[],
		widthMap: Map<TreeNode, number>,
	): void {
		visualNodes.push({ node, x, y, depth });

		if (node.isLeaf()) return;

		const children = node.children;
		const totalWidth = widthMap.get(node) || 0;
		let currentX = x - totalWidth / 2;

		// Position each child
		for (let i = 0; i < children.length; i++) {
			const child = children[i];
			const childWidth = widthMap.get(child) || 0;
			const childX = currentX + childWidth / 2;
			const childY = y + this.levelHeight;

			this.positionNode(child, childX, childY, depth + 1, visualNodes, widthMap);

			currentX += childWidth;
			if (i < children.length - 1) {
				currentX += this.minHorizontalSpacing;
			}
		}
	}

	// Main draw method
	draw(): void {
		this.g.selectAll('*').remove();

		const { nodes: visualNodes, bounds } = this.calculateLayout();
		if (visualNodes.length === 0) return;

		// Calculate viewBox dimensions
		let viewBoxWidth = bounds.maxX - bounds.minX;
		let viewBoxHeight = bounds.maxY;

		// Set minimum viewBox dimensions to prevent excessive scaling
		const minViewBoxWidth = 600;
		const minViewBoxHeight = 400;

		viewBoxWidth = Math.max(viewBoxWidth, minViewBoxWidth);
		viewBoxHeight = Math.max(viewBoxHeight, minViewBoxHeight);

		// Center content if viewBox is larger than content
		const offsetX = bounds.minX - (viewBoxWidth - (bounds.maxX - bounds.minX)) / 2;

		// Update SVG viewBox to fit content
		this.svg
			.attr('viewBox', `${offsetX} 0 ${viewBoxWidth} ${viewBoxHeight}`)
			.attr('preserveAspectRatio', 'xMidYMid meet');

		// Draw links first
		this.drawLinks(visualNodes);

		// Draw nodes
		this.drawNodes(visualNodes);
	}

	private drawLinks(visualNodes: VisualNode[]): void {
		const links: Array<{ source: VisualNode; target: VisualNode; sourceIndex: number }> = [];

		visualNodes.forEach((vNode) => {
			vNode.node.children.forEach((child, index) => {
				const childVNode = visualNodes.find((vn) => vn.node === child);
				if (childVNode) {
					links.push({ source: vNode, target: childVNode, sourceIndex: index });
				}
			});
		});

		// Draw links from edge to edge
		this.g
			.selectAll('line.link')
			.data(links)
			.join('line')
			.attr('class', 'link')
			.attr('x1', (d) => {
				// Start point at bottom edge of parent
				const dx = d.target.x - d.source.x;
				const dy = d.target.y - d.source.y;
				const angle = Math.atan2(dy, dx);

				if (d.source.node.is3Node()) {
					// For ellipse, calculate edge point
					const dims = this.getNodeDimensions(d.source.node);
					const rx = dims.width / 2;
					return d.source.x + rx * Math.cos(angle);
				} else {
					// For circle
					const dims = this.getNodeDimensions(d.source.node);
					return d.source.x + dims.radius * Math.cos(angle);
				}
			})
			.attr('y1', (d) => {
				const dx = d.target.x - d.source.x;
				const dy = d.target.y - d.source.y;
				const angle = Math.atan2(dy, dx);

				if (d.source.node.is3Node()) {
					const dims = this.getNodeDimensions(d.source.node);
					const ry = dims.height / 2;
					return d.source.y + ry * Math.sin(angle);
				} else {
					const dims = this.getNodeDimensions(d.source.node);
					return d.source.y + dims.radius * Math.sin(angle);
				}
			})
			.attr('x2', (d) => {
				// End point at top edge of child
				const dx = d.source.x - d.target.x;
				const dy = d.source.y - d.target.y;
				const angle = Math.atan2(dy, dx);

				if (d.target.node.is3Node()) {
					const dims = this.getNodeDimensions(d.target.node);
					const rx = dims.width / 2;
					return d.target.x + rx * Math.cos(angle);
				} else {
					const dims = this.getNodeDimensions(d.target.node);
					return d.target.x + dims.radius * Math.cos(angle);
				}
			})
			.attr('y2', (d) => {
				const dx = d.source.x - d.target.x;
				const dy = d.source.y - d.target.y;
				const angle = Math.atan2(dy, dx);

				if (d.target.node.is3Node()) {
					const dims = this.getNodeDimensions(d.target.node);
					const ry = dims.height / 2;
					return d.target.y + ry * Math.sin(angle);
				} else {
					const dims = this.getNodeDimensions(d.target.node);
					return d.target.y + dims.radius * Math.sin(angle);
				}
			})
			.attr('stroke', 'black')
			.attr('stroke-width', 1.5);
	}

	private drawNodes(visualNodes: VisualNode[]): void {
		const that = this;
		const nodeGroups = this.g
			.selectAll('g.node')
			.data(visualNodes)
			.join('g')
			.attr('class', 'node')
			.attr('transform', (d) => `translate(${d.x}, ${d.y})`);

		// Draw shapes based on node type
		nodeGroups.each(function (d) {
			const group = d3.select(this);
			const dims = that.getNodeDimensions(d.node);

			if (d.node.is2Node()) {
				// Single circle for 2-node
				group
					.append('circle')
					.attr('r', dims.radius)
					.attr('fill', 'white')
					.attr('stroke', 'black')
					.attr('stroke-width', 2);
			} else {
				// Ellipse/pill shape for 3-node
				group
					.append('ellipse')
					.attr('cx', 0)
					.attr('cy', 0)
					.attr('rx', dims.width / 2)
					.attr('ry', dims.height / 2)
					.attr('fill', 'white')
					.attr('stroke', 'black')
					.attr('stroke-width', 2);
			}
		});

		// Draw keys text
		nodeGroups
			.append('text')
			.attr('text-anchor', 'middle')
			.attr('dominant-baseline', 'middle')
			.attr('fill', 'black')
			.attr('font-size', '13px')
			.attr('font-weight', 'bold')
			.attr('font-family', 'serif')
			.text((d) => d.node.keys.join(' '));
	}

	// Animate insertion
	async animateInsert(value: string): Promise<void> {
		const that = this; // Capture 'this' for use in nested functions
		const { nodes: visualNodes, bounds } = this.calculateLayout();

		if (visualNodes.length === 0) {
			this.draw();
			return;
		}

		// Calculate viewBox dimensions
		let viewBoxWidth = bounds.maxX - bounds.minX;
		let viewBoxHeight = bounds.maxY;

		// Set minimum viewBox dimensions to prevent excessive scaling
		const minViewBoxWidth = 600;
		const minViewBoxHeight = 400;

		viewBoxWidth = Math.max(viewBoxWidth, minViewBoxWidth);
		viewBoxHeight = Math.max(viewBoxHeight, minViewBoxHeight);

		// Center content if viewBox is larger than content
		const offsetX = bounds.minX - (viewBoxWidth - (bounds.maxX - bounds.minX)) / 2;

		// Update SVG viewBox with transition
		this.svg
			.transition()
			.duration(500)
			.attr('viewBox', `${offsetX} 0 ${viewBoxWidth} ${viewBoxHeight}`);

		// Build link data
		const links: Array<{ source: VisualNode; target: VisualNode; sourceIndex: number }> = [];
		visualNodes.forEach((vNode) => {
			vNode.node.children.forEach((child, index) => {
				const childVNode = visualNodes.find((vn) => vn.node === child);
				if (childVNode) {
					links.push({ source: vNode, target: childVNode, sourceIndex: index });
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
						.attr('y1', (d) => d.source.y)
						.attr('x2', (d) => d.source.x)
						.attr('y2', (d) => d.source.y)
						.attr('stroke', 'black')
						.attr('stroke-width', 1.5)
						.call((enter) =>
							enter
								.transition()
								.duration(500)
								.attr('x1', (d) => {
									const dx = d.target.x - d.source.x;
									const dy = d.target.y - d.source.y;
									const angle = Math.atan2(dy, dx);
									if (d.source.node.is3Node()) {
										const dims = this.getNodeDimensions(d.source.node);
										const rx = dims.width / 2;
										return d.source.x + rx * Math.cos(angle);
									} else {
										const dims = this.getNodeDimensions(d.source.node);
										return d.source.x + dims.radius * Math.cos(angle);
									}
								})
								.attr('y1', (d) => {
									const dx = d.target.x - d.source.x;
									const dy = d.target.y - d.source.y;
									const angle = Math.atan2(dy, dx);
									if (d.source.node.is3Node()) {
										const dims = this.getNodeDimensions(d.source.node);
										const ry = dims.height / 2;
										return d.source.y + ry * Math.sin(angle);
									} else {
										const dims = this.getNodeDimensions(d.source.node);
										return d.source.y + dims.radius * Math.sin(angle);
									}
								})
								.attr('x2', (d) => {
									const dx = d.source.x - d.target.x;
									const dy = d.source.y - d.target.y;
									const angle = Math.atan2(dy, dx);
									if (d.target.node.is3Node()) {
										const dims = this.getNodeDimensions(d.target.node);
										const rx = dims.width / 2;
										return d.target.x + rx * Math.cos(angle);
									} else {
										const dims = this.getNodeDimensions(d.target.node);
										return d.target.x + dims.radius * Math.cos(angle);
									}
								})
								.attr('y2', (d) => {
									const dx = d.source.x - d.target.x;
									const dy = d.source.y - d.target.y;
									const angle = Math.atan2(dy, dx);
									if (d.target.node.is3Node()) {
										const dims = this.getNodeDimensions(d.target.node);
										const ry = dims.height / 2;
										return d.target.y + ry * Math.sin(angle);
									} else {
										const dims = this.getNodeDimensions(d.target.node);
										return d.target.y + dims.radius * Math.sin(angle);
									}
								}),
						),
				(update) =>
					update.call((update) =>
						update
							.transition()
							.duration(500)
							.attr('x1', (d) => {
								const dx = d.target.x - d.source.x;
								const dy = d.target.y - d.source.y;
								const angle = Math.atan2(dy, dx);
								if (d.source.node.is3Node()) {
									const dims = this.getNodeDimensions(d.source.node);
									const rx = dims.width / 2;
									return d.source.x + rx * Math.cos(angle);
								} else {
									const dims = this.getNodeDimensions(d.source.node);
									return d.source.x + dims.radius * Math.cos(angle);
								}
							})
							.attr('y1', (d) => {
								const dx = d.target.x - d.source.x;
								const dy = d.target.y - d.source.y;
								const angle = Math.atan2(dy, dx);
								if (d.source.node.is3Node()) {
									const dims = this.getNodeDimensions(d.source.node);
									const ry = dims.height / 2;
									return d.source.y + ry * Math.sin(angle);
								} else {
									const dims = this.getNodeDimensions(d.source.node);
									return d.source.y + dims.radius * Math.sin(angle);
								}
							})
							.attr('x2', (d) => {
								const dx = d.source.x - d.target.x;
								const dy = d.source.y - d.target.y;
								const angle = Math.atan2(dy, dx);
								if (d.target.node.is3Node()) {
									const dims = this.getNodeDimensions(d.target.node);
									const rx = dims.width / 2;
									return d.target.x + rx * Math.cos(angle);
								} else {
									const dims = this.getNodeDimensions(d.target.node);
									return d.target.x + dims.radius * Math.cos(angle);
								}
							})
							.attr('y2', (d) => {
								const dx = d.source.x - d.target.x;
								const dy = d.source.y - d.target.y;
								const angle = Math.atan2(dy, dx);
								if (d.target.node.is3Node()) {
									const dims = this.getNodeDimensions(d.target.node);
									const ry = dims.height / 2;
									return d.target.y + ry * Math.sin(angle);
								} else {
									const dims = this.getNodeDimensions(d.target.node);
									return d.target.y + dims.radius * Math.sin(angle);
								}
							}),
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
							const parent = this.findParent(d.node, visualNodes);
							return parent ? `translate(${parent.x}, ${parent.y})` : `translate(${d.x}, ${d.y})`;
						})
						.style('opacity', 0);

					// Add shape based on node type
					g.each(function (d) {
						const group = d3.select(this);
						const dims = that.getNodeDimensions(d.node);

						if (d.node.is2Node()) {
							group
								.append('circle')
								.attr('r', dims.radius)
								.attr('fill', 'white')
								.attr('stroke', 'black')
								.attr('stroke-width', 2);
						} else {
							// Use ellipse for 3-nodes (consistent with drawNodes)
							group
								.append('ellipse')
								.attr('cx', 0)
								.attr('cy', 0)
								.attr('rx', dims.width / 2)
								.attr('ry', dims.height / 2)
								.attr('fill', 'white')
								.attr('stroke', 'black')
								.attr('stroke-width', 2);
						}
					});

					// Add text
					g.append('text')
						.attr('text-anchor', 'middle')
						.attr('dominant-baseline', 'middle')
						.attr('fill', 'black')
						.attr('font-size', '13px')
						.attr('font-weight', 'bold')
						.attr('font-family', 'serif')
						.text((d) => d.node.keys.join(' '));

					g.transition()
						.duration(500)
						.attr('transform', (d) => `translate(${d.x}, ${d.y})`)
						.style('opacity', 1);

					return g;
				},
				(update) => {
					update
						.transition()
						.duration(500)
						.attr('transform', (d) => `translate(${d.x}, ${d.y})`);

					// Update shapes
					update.each(function (d) {
						const group = d3.select(this);
						const dims = that.getNodeDimensions(d.node);

						// Remove old shape
						group.select('circle, ellipse').remove();

						// Add new shape
						if (d.node.is2Node()) {
							group
								.append('circle')
								.attr('r', dims.radius)
								.attr('fill', 'white')
								.attr('stroke', 'black')
								.attr('stroke-width', 2);
						} else {
							// Use ellipse for 3-nodes (consistent with drawNodes)
							group
								.append('ellipse')
								.attr('cx', 0)
								.attr('cy', 0)
								.attr('rx', dims.width / 2)
								.attr('ry', dims.height / 2)
								.attr('fill', 'white')
								.attr('stroke', 'black')
								.attr('stroke-width', 2);
						}

						// Move text to front
						const textNode = group.select('text').node();
						if (textNode) {
							(group.node() as SVGElement)?.appendChild(textNode as Node);
						}
					});

					update.select('text').text((d) => d.node.keys.join(' '));

					return update;
				},
				(exit) => exit.transition().duration(300).style('opacity', 0).remove(),
			);

		await new Promise((resolve) => setTimeout(resolve, 500));
	}

	private findParent(node: TreeNode, visualNodes: VisualNode[]): VisualNode | null {
		for (const vNode of visualNodes) {
			if (vNode.node.children.includes(node)) {
				return vNode;
			}
		}
		return null;
	}

	// Animate search/find operation
	async animateSearch(value: string): Promise<boolean> {
		const { nodes: visualNodes } = this.calculateLayout();
		if (visualNodes.length === 0) return false;

		const path: VisualNode[] = [];
		let currentNode = this.tree.root;

		// Build the search path
		while (currentNode) {
			const vNode = visualNodes.find((vn) => vn.node === currentNode);
			if (vNode) path.push(vNode);

			// Check if found
			if (currentNode.keys.includes(value)) {
				break;
			}

			// Determine which child to traverse
			if (currentNode.isLeaf()) {
				break;
			}

			if (currentNode.is2Node()) {
				const cmp = value.localeCompare(currentNode.keys[0], undefined, { numeric: true });
				currentNode = cmp < 0 ? currentNode.children[0] : currentNode.children[1];
			} else {
				const [a, b] = currentNode.keys;
				if (value.localeCompare(a, undefined, { numeric: true }) < 0) {
					currentNode = currentNode.children[0];
				} else if (value.localeCompare(b, undefined, { numeric: true }) < 0) {
					currentNode = currentNode.children[1];
				} else {
					currentNode = currentNode.children[2];
				}
			}
		}

		// Animate traversal
		for (let i = 0; i < path.length; i++) {
			const vNode = path[i];
			const isFound = vNode.node.keys.includes(value);

			// Highlight current node in red
			this.g
				.selectAll('g.node')
				.filter((d: any) => d.node === vNode.node)
				.select('circle, ellipse')
				.transition()
				.duration(300)
				.attr('stroke', '#ef4444')
				.attr('stroke-width', 3);

			await new Promise((resolve) => setTimeout(resolve, 500));

			if (isFound) {
				// Found! Do success animation
				await this.animateFoundNode(vNode);
				break;
			} else if (i < path.length - 1) {
				// Not found, turn back to black and continue
				this.g
					.selectAll('g.node')
					.filter((d: any) => d.node === vNode.node)
					.select('circle, ellipse')
					.transition()
					.duration(200)
					.attr('stroke', 'black')
					.attr('stroke-width', 2);
			} else {
				// Not found at all
				this.g
					.selectAll('g.node')
					.filter((d: any) => d.node === vNode.node)
					.select('circle, ellipse')
					.transition()
					.duration(200)
					.attr('stroke', 'black')
					.attr('stroke-width', 2);
			}
		}

		return path.length > 0 && path[path.length - 1].node.keys.includes(value);
	}

	private async animateFoundNode(vNode: VisualNode): Promise<void> {
		const nodeGroup = this.g.selectAll('g.node').filter((d: any) => d.node === vNode.node);

		const shape = nodeGroup.select('circle, ellipse');
		const text = nodeGroup.select('text');
		const isCircle = vNode.node.is2Node();
		const dims = this.getNodeDimensions(vNode.node);

		// Pulse and wiggle animation
		await new Promise((resolve) => {
			// For circles, use r attribute; for ellipses, use rx/ry
			if (isCircle) {
				const originalR = dims.radius;
				shape
					.transition()
					.duration(200)
					.attr('stroke', '#22c55e')
					.attr('stroke-width', 4)
					.attr('r', originalR * 1.3)
					.transition()
					.duration(200)
					.attr('r', originalR)
					.transition()
					.duration(200)
					.attr('r', originalR * 1.3)
					.transition()
					.duration(200)
					.attr('r', originalR)
					.transition()
					.duration(300)
					.attr('stroke', 'black')
					.attr('stroke-width', 2)
					.on('end', resolve);
			} else {
				const originalRx = dims.width / 2;
				const originalRy = dims.height / 2;
				shape
					.transition()
					.duration(200)
					.attr('stroke', '#22c55e')
					.attr('stroke-width', 4)
					.attr('rx', originalRx * 1.3)
					.attr('ry', originalRy * 1.3)
					.transition()
					.duration(200)
					.attr('rx', originalRx)
					.attr('ry', originalRy)
					.transition()
					.duration(200)
					.attr('rx', originalRx * 1.3)
					.attr('ry', originalRy * 1.3)
					.transition()
					.duration(200)
					.attr('rx', originalRx)
					.attr('ry', originalRy)
					.transition()
					.duration(300)
					.attr('stroke', 'black')
					.attr('stroke-width', 2)
					.on('end', resolve);
			}

			// Animate text along with shape
			text
				.transition()
				.duration(200)
				.attr('fill', '#22c55e')
				.style('font-size', '16px')
				.transition()
				.duration(200)
				.style('font-size', '13px')
				.transition()
				.duration(200)
				.style('font-size', '16px')
				.transition()
				.duration(200)
				.style('font-size', '13px')
				.transition()
				.duration(300)
				.attr('fill', 'black');
		});
	}

	clear(): void {
		this.g.selectAll('*').remove();
	}

	setTree(tree: TwoThreeTree): void {
		this.tree = tree;
		this.draw();
	}
}
