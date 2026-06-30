import type { ReactNode } from 'react';
import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { colors, radii, spacing } from '@/theme';
import { Text } from './Text';

type ActionButtonProps = {
  label: string;
  icon?: ReactNode;
  onPress?: () => void;
  variant?: 'primary' | 'secondary' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
};

export function ActionButton({ label, icon, onPress, variant = 'primary', disabled, style }: ActionButtonProps) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, styles[variant], pressed && styles.pressed, disabled && styles.disabled, style]}
    >
      {icon}
      <Text variant="label" style={variant === 'primary' ? styles.primaryText : undefined}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 46,
    borderRadius: radii.sm,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg
  },
  primary: {
    backgroundColor: colors.cyan
  },
  secondary: {
    backgroundColor: colors.surfaceHigh,
    borderColor: colors.border,
    borderWidth: 1
  },
  danger: {
    backgroundColor: colors.red
  },
  pressed: {
    opacity: 0.8
  },
  disabled: {
    opacity: 0.5
  },
  primaryText: {
    color: '#061018'
  }
});
