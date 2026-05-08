export type CommandPaletteDevice = Readonly<{
  description: string;
  id: string;
  label: string;
  status: 'Online' | 'Maintenance' | 'Offline';
}>;

export const COMMAND_PALETTE_DEVICES: readonly CommandPaletteDevice[] = Object.freeze([
  {
    id: 'edge-router',
    label: 'Edge Router',
    description: 'Primary network gateway',
    status: 'Online',
  },
  {
    id: 'floor-switch',
    label: 'Floor Switch',
    description: 'Access layer switch in building A',
    status: 'Maintenance',
  },
  {
    id: 'warehouse-sensor',
    label: 'Warehouse Sensor',
    description: 'Temperature and humidity telemetry',
    status: 'Offline',
  },
  {
    id: 'lobby-display',
    label: 'Lobby Display',
    description: 'Visitor status dashboard',
    status: 'Online',
  },
]);

export function filterCommandPaletteDevices(
  devices: readonly CommandPaletteDevice[],
  query: string,
): readonly CommandPaletteDevice[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (normalizedQuery.length === 0) {
    return devices;
  }

  return devices.filter((device) => {
    return [device.label, device.description, device.status].some((value) =>
      value.toLowerCase().includes(normalizedQuery),
    );
  });
}
