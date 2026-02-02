
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
        const o = (objects && (objects as any)[obj]) || undefined;
        const v = o && (o as any)[prop] && (o as any)[prop].solid ? (o as any)[prop].solid.color : (o as any)[prop];
        return (o && (o as any)[prop] !== undefined) ? (o as any)[prop] : fallback;
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
    return s;
  }
}
