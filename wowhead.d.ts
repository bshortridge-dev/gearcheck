interface Window {
  $WowheadPower?: {
    refreshLinks: () => void;
  };
  whTooltips?: {
    colorLinks: boolean;
    iconizeLinks: boolean;
    renameLinks: boolean;
    iconSize?: "small" | "medium" | "large";
  };
}
