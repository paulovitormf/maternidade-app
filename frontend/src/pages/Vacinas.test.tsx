import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Vacinas from './Vacinas';

describe('Vacinas', () => {
  it('abre por padrão no calendário materno', () => {
    render(<Vacinas />);

    expect(screen.getByRole('heading', { name: 'Vacinas' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Mãe/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText('Início do pré-natal')).toBeInTheDocument();
    expect(screen.queryByText('Ao nascer')).not.toBeInTheDocument();
  });

  it('alterna para o calendário do bebê', () => {
    render(<Vacinas />);

    fireEvent.click(screen.getByRole('button', { name: /Bebê/i }));

    expect(screen.getByRole('button', { name: /Bebê/i })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByText('Ao nascer')).toBeInTheDocument();
    expect(screen.queryByText('Início do pré-natal')).not.toBeInTheDocument();
  });
});
