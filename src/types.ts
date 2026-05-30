export interface DefinitionRow {
  id: string;
  name: string;
  netexRole: string;
  xsdLocation: string;
  description?: string;
  raw: Record<string, unknown>;
}

export type NetexRole =
  | 'entity'
  | 'reference'
  | 'version'
  | 'frame'
  | 'enum'
  | 'collection'
  | 'abstract'
  | 'scaffolding'
  | 'unknown';
