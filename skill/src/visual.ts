
    import powerbi from "powerbi-visuals-api";
    import * as d3 from 'd3';
    import { sankey as d3sankey, sankeyLinkHorizontal, SankeyGraph, SankeyNode as D3SankeyNode, SankeyLink as D3SankeyLink, sankeyLeft, sankeyRight, sankeyCenter, sankeyJustify } from 'd3-sankey';
    import { VisualSettings } from './settings';

    import IVisual = powerbi.extensibility.visual.IVisual;
    import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
    import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
    import DataView = powerbi.DataView;
    import ISelectionManager = powerbi.extensibility.ISelectionManager;
    import ISelectionId = powerbi.extensibility.ISelectionId;

    type SelId = ISelectionId | null;

    interface Row {
      levels: (string | null)[]; // up to 8
      value: number;
      tooltip?: string;
      identity?: SelId;
    }

    interface SankeyNode {
      name: string;
      rawLabel: string;
      levelIndex: number; // 0..7
      color: string;
      identity?: SelId;
    }

    interface SankeyLink {
      source: number; // node index
      target: number; // node index
      value: number;
      tooltip?: string;
      identity?: SelId;
    }

    export class Visual implements IVisual {
      private target: HTMLElement;
      private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
      private container: d3.Selection<SVGGElement, unknown, null, undefined>;
      private selectionManager: ISelectionManager;
      private colorPalette: powerbi.extensibility.IColorPalette;

      constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.selectionManager = options.host.createSelectionManager();
        this.colorPalette = options.host.colorPalette;
        this.svg = d3.select(this.target).append('svg').classed('sankey-svg', true);
        this.container = this.svg.append('g').classed('sankey-container', true);
      }

      public update(options: VisualUpdateOptions) {
        const dv = options.dataViews && options.dataViews[0];
        const width = options.viewport.width;
        const height = options.viewport.height;
        this.svg.attr('width', width).attr('height', height);
        this.container.attr('transform', 'translate(0,0)');

        if (!dv || !dv.table || !dv.table.rows || dv.table.rows.length === 0) {
          this.container.selectAll('*').remove();
          this.container.append('text')
            .attr('x', 12).attr('y', 24)
            .text('Add columns Level1..Level8 and Value to build a Sankey path.');
          return;
        }

        const settings = VisualSettings.parse(dv.metadata && dv.metadata.objects);

        // Parse rows from table
        const columns = dv.table.columns || [];
        const colIndex: { [key: string]: number } = {};
        ['Level1','Level2','Level3','Level4','Level5','Level6','Level7','Level8','Value','Tooltip'].forEach(role => {
          const idx = columns.findIndex(c => (c && c.roles && (c.roles as any)[role]));
          colIndex[role] = idx;
        });

        const rows: Row[] = dv.table.rows.map(r => {
          const levels: (string | null)[] = [];
          for (let i = 1; i <= 8; i++) {
            const idx = colIndex['Level' + i];
            const val = idx >= 0 ? r[idx] : null;
            levels.push(val !== null && val !== undefined ? String(val) : null);
          }
          const vIdx = colIndex['Value'];
          const value = vIdx >= 0 && r[vIdx] !== null && r[vIdx] !== undefined ? Number(r[vIdx]) : 1;
          const tIdx = colIndex['Tooltip'];
          const tooltip = tIdx >= 0 && r[tIdx] !== null && r[tIdx] !== undefined ? String(r[tIdx]) : undefined;
          return { levels, value, tooltip };
        });

        // Build nodes and links
        const nodeMap = new Map<string, number>();
        const nodes: SankeyNode[] = [];
        const links: SankeyLink[] = [];
        const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

        const makeKey = (label: string, level: number) => settings.mergeSameLabelsAcrossLevels ? label : `L${level+1}|${label}`;

        rows.forEach(row => {
          // find last non-null level
          let maxLevel = row.levels.reduce((acc, v, i) => v ? i : acc, -1);
          for (let li = 0; li <= maxLevel; li++) {
            const lbl = row.levels[li];
            if (!lbl) continue;
            const key = makeKey(lbl, li);
            if (!nodeMap.has(key)) {
              const idx = nodes.length;
              nodeMap.set(key, idx);
              nodes.push({
                name: settings.truncateLabels && lbl.length > settings.labelMaxLen ? (lbl.slice(0, settings.labelMaxLen) + '…') : lbl,
                rawLabel: lbl,
                levelIndex: li,
                color: colorScale(String(li))
              });
            }
            if (li < maxLevel) {
              const nextLbl = row.levels[li+1];
              if (nextLbl) {
                const srcKey = makeKey(lbl, li);
                const tgtKey = makeKey(nextLbl, li+1);
                const sIdx = nodeMap.get(srcKey)!;
                const tIdx = nodeMap.get(tgtKey)!;
                links.push({ source: sIdx, target: tIdx, value: Math.max(0, row.value), tooltip: row.tooltip });
              }
            }
          }
        });

        // Compose sankey layout
        const alignMap: any = {
          'left': sankeyLeft,
          'right': sankeyRight,
          'center': sankeyCenter,
          'justify': sankeyJustify
        };
        const sankey = d3sankey<D3SankeyNode<any>, D3SankeyLink<any, any>>()
          .nodeWidth(settings.nodeWidth)
          .nodePadding(settings.nodePadding)
          .nodeAlign(alignMap[settings.align] || sankeyJustify)
          .extent([[1,1],[width-1,height-1]]);

        const graph: SankeyGraph<any, any> = sankey({
          nodes: nodes.map(n => ({ ...n })),
          links: links.map(l => ({ ...l }))
        });

        // Render
        this.container.selectAll('*').remove();

        // Links
        const linkSel = this.container.append('g').classed('links', true)
          .selectAll('path').data(graph.links as any);
        linkSel.enter().append('path')
          .attr('class', 'link')
          .attr('d', sankeyLinkHorizontal())
          .attr('stroke', d => '#888')
          .attr('stroke-width', d => Math.max(1, (d as any).width))
          .attr('stroke-opacity', settings.linkOpacity)
          .append('title')
          .text(d => `${(d as any).source.rawLabel} → ${(d as any).target.rawLabel}
${(d as any).value}`);

        // Nodes
        const nodeSel = this.container.append('g').classed('nodes', true)
          .selectAll('g').data(graph.nodes as any).enter().append('g').attr('class', 'node');
        nodeSel.append('rect')
          .attr('x', d => (d as any).x0)
          .attr('y', d => (d as any).y0)
          .attr('width', d => Math.max(1, (d as any).x1 - (d as any).x0))
          .attr('height', d => Math.max(1, (d as any).y1 - (d as any).y0))
          .attr('fill', d => (d as any).color)
          .append('title')
          .text(d => `${(d as any).rawLabel}
${(d as any).value}`);

        nodeSel.append('text')
          .attr('x', d => (d as any).x0 - 6)
          .attr('y', d => ((d as any).y0 + (d as any).y1) / 2)
          .attr('dy', '0.35em')
          .attr('text-anchor', 'end')
          .text(d => (d as any).name)
          .filter(d => (d as any).x0 < width / 2)
          .attr('x', d => (d as any).x1 + 6)
          .attr('text-anchor', 'start');
      }
    }
