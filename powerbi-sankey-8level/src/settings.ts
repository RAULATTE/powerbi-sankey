
import powerbi from "powerbi-visuals-api";
import DataViewObjects = powerbi.DataViewObjects;

export class VisualSettings {
  nodeWidth: number = 8;
  nodePadding: number = 16;
  linkOpacity: number = 0.5;
  align: string = 'justify';
  truncateLabels: boolean = true;
  labelMaxLen: number = 24;
  mergeSameLabelsAcrossLevels: boolean = false;

  static parse(objects?: DataViewObjects): VisualSettings {
    const s = new VisualSettings();
    const get = (obj: string, prop: string, fallback: any) => {
      try {
        if (!objects || !objects[obj]) {
          return fallback;
        }
        const objValue = (objects[obj] as any)[prop];
        return objValue !== undefined ? objValue : fallback;
      } catch {
        return fallback;
      }
    };
    s.nodeWidth = Number(get('sankeySettings', 'nodeWidth', s.nodeWidth));
    s.nodePadding = Number(get('sankeySettings', 'nodePadding', s.nodePadding));
    s.linkOpacity = Number(get('sankeySettings', 'linkOpacity', s.linkOpacity));
    s.align = String(get('sankeySettings', 'align', s.align));
    s.truncateLabels = Boolean(get('sankeySettings', 'truncateLabels', s.truncateLabels));
    s.labelMaxLen = Number(get('sankeySettings', 'labelMaxLen', s.labelMaxLen));
    s.mergeSameLabelsAcrossLevels = Boolean(get('sankeySettings', 'mergeSameLabelsAcrossLevels', s.mergeSameLabelsAcrossLevels));

    // Validate and constrain values
    s.nodeWidth = Math.max(1, Math.min(100, s.nodeWidth));
    s.nodePadding = Math.max(0, Math.min(100, s.nodePadding));
    s.linkOpacity = Math.max(0, Math.min(1, s.linkOpacity));
    s.labelMaxLen = Math.max(1, Math.min(200, s.labelMaxLen));
    if (!['left', 'right', 'center', 'justify'].includes(s.align)) {
      s.align = 'justify';
    }

    return s;
  }
}
