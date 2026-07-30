declare module 'expo-router' {
  import type { ComponentType } from 'react';
  export const Tabs: ComponentType<any> & { Screen: ComponentType<any> };
  export const Redirect: ComponentType<any>;
  export const Stack: ComponentType<any> & { Screen: ComponentType<any> };
  export function Link(props: any): JSX.Element;
  export const router: { replace(path: string): void; push(path: string): void };
  export function useRouter(): { replace(path: string): void; push(path: string): void };
}
