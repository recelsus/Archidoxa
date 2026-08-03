export interface ResolvedLayout {
  requested_layout: string | null;
  resolved_layout: string;
  used_fallback: boolean;
}

export function resolve_layout(
  requested_layout: string | null | undefined,
  default_layout: string,
  registry: Record<string, unknown>,
): ResolvedLayout {
  const normalized_layout = requested_layout?.trim() ?? '';
  const has_requested_layout = normalized_layout.length > 0 && normalized_layout in registry;

  if (has_requested_layout) {
    return {
      requested_layout: normalized_layout,
      resolved_layout: normalized_layout,
      used_fallback: false,
    };
  }

  if (!(default_layout in registry)) {
    throw new Error(`Default layout is not registered: ${default_layout}`);
  }

  return {
    requested_layout: normalized_layout.length > 0 ? normalized_layout : null,
    resolved_layout: default_layout,
    used_fallback: true,
  };
}
