interface WH {
  Tooltip: {
    init(): void;
    refresh(): void;
  };
}

interface Window {
  WH?: WH;
  whTooltips?: {
    colorLinks: boolean;
    iconizeLinks: boolean;
    renameLinks: boolean;
    iconSize: string;
  };
}
