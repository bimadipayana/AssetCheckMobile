import MaterialIcons from '@expo/vector-icons/MaterialIcons';

export type AssetIconName = keyof typeof MaterialIcons.glyphMap;

export const assetTypeIcons: Record<string, AssetIconName> = {
  Laptop: 'laptop-mac',
  Tools: 'construction',
  Vehicle: 'directions-car',
  WFM: 'smartphone',
};

export function getAssetIcon(category: string): AssetIconName {
  if (category.includes('Tools')) {
    return assetTypeIcons.Tools;
  }

  if (category.includes('Vehicle')) {
    return assetTypeIcons.Vehicle;
  }

  if (category.includes('OTDR')) {
    return 'cable';
  }

  if (category.includes('Splicer')) {
    return 'precision-manufacturing';
  }

  if (category.includes('Power')) {
    return 'electrical-services';
  }

  if (category.includes('Grandmax')) {
    return 'local-shipping';
  }

  if (category.includes('Motor') || category.includes('Revo')) {
    return 'two-wheeler';
  }

  if (category.includes('Honeywell')) {
    return 'qr-code-scanner';
  }

  if (category.includes('Laptop')) {
    return 'laptop-mac';
  }

  if (category.includes('WFM')) {
    return 'smartphone';
  }

  return 'inventory-2';
}
