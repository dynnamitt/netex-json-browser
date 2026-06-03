import { useState, useEffect } from 'react';
import { DefinitionRow } from '../types';

type State =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; rows: DefinitionRow[] };

function parseDefinitions(definitions: Record<string, unknown>): DefinitionRow[] {
  return Object.entries(definitions).map(([name, def]) => {
    const d = def as Record<string, unknown>;
    return {
      id: name,
      name,
      netexRole: (d['x-netex-role'] as string | undefined) ?? 'unknown',
      xsdLocation: (d['x-netex-source'] as string | undefined) ?? '',
      description: (d['description'] as string | undefined),
      raw: d,
    };
  });
}

export function useSchema(): State {
  const [state, setState] = useState<State>({ status: 'idle' });

  useEffect(() => {
    let cancelled = false;
    setState({ status: 'loading' });

    (async () => {
      try {
        const res = await fetch(`${process.env.PUBLIC_URL}/netex-schema.json`);
        if (!res.ok) throw new Error(`Failed to load schema: ${res.status}`);
        const schema = await res.json();
        const definitions = (schema.definitions ?? schema.$defs ?? {}) as Record<string, unknown>;
        const rows = parseDefinitions(definitions);
        if (!cancelled) setState({ status: 'ready', rows });
      } catch (err) {
        if (!cancelled) setState({ status: 'error', message: String(err) });
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return state;
}
