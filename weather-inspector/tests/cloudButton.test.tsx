import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CloudButton from '@/components/CloudButton';

describe('CloudButton', () => {
  it('calls onActivate when clicked', () => {
    const handleActivate = vi.fn();
    render(<CloudButton onActivate={handleActivate} />);

    const button = screen.getByRole('button', { name: /secret cloud/i });
    fireEvent.click(button);

    expect(handleActivate).toHaveBeenCalledTimes(1);
  });

  it('is disabled when the disabled prop is true', () => {
    const handleActivate = vi.fn();
    render(<CloudButton onActivate={handleActivate} disabled={true} />);

    const button = screen.getByRole('button', { name: /secret cloud/i });
    expect(button).toBeDisabled();
    fireEvent.click(button);
    expect(handleActivate).not.toHaveBeenCalled();
  });
});
