import type { PropsWithChildren } from 'react';
import { StyleSheet, Text as NativeText, type TextProps as NativeTextProps } from 'react-native';
import { colors } from '@/theme';

type TextProps = PropsWithChildren<
  NativeTextProps & {
    variant?: 'title' | 'heading' | 'body' | 'caption' | 'label';
    muted?: boolean;
  }
>;

export function Text({ variant = 'body', muted, style, children, ...props }: TextProps) {
  return (
    <NativeText {...props} style={[styles.base, styles[variant], muted && styles.muted, style]}>
      {children}
    </NativeText>
  );
}

const styles = StyleSheet.create({
  base: {
    color: colors.text
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    fontWeight: '900'
  },
  heading: {
    fontSize: 20,
    lineHeight: 26,
    fontWeight: '800'
  },
  body: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500'
  },
  caption: {
    fontSize: 12,
    lineHeight: 16,
    fontWeight: '600'
  },
  label: {
    fontSize: 13,
    lineHeight: 18,
    fontWeight: '800',
    textTransform: 'uppercase'
  },
  muted: {
    color: colors.subtext
  }
});
