export interface PixlrSettings {
  referrer?: string;
  icon?: string;
  accent?: 'ash' | 'brown' | 'coral' | 'pink' | 'rose' | 'red' | 'plum' | 'maroon' | 
          'purple' | 'lavender' | 'denim' | 'blue' | 'teal' | 'green' | 'lime' | 'mustard';
  workspace?: 'dark' | 'iron' | 'steel' | 'light';
  tabLimit?: number;
  blockOpen?: boolean;
  exportFormats?: Array<'png' | 'jpeg' | 'webp' | 'pxz' | 'pdf'>;
  disabledTools?: string[];
}

export interface PixlrTokenPayload {
  sub: string;
  mode: 'http' | 'embedded';
  origin?: string;
  openUrl?: string;
  saveUrl?: string;
  follow?: boolean;
  settings?: PixlrSettings;
}
