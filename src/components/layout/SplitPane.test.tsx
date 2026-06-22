import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SplitPane } from './SplitPane';

function Wrapper({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{children}</BrowserRouter>
    </QueryClientProvider>
  );
}

describe('SplitPane', () => {
  it('renders left and right panels', () => {
    render(
      <Wrapper>
        <SplitPane left={<div>Left Panel</div>} right={<div>Right Panel</div>} />
      </Wrapper>,
    );
    expect(screen.getByText('Left Panel')).toBeInTheDocument();
    expect(screen.getByText('Right Panel')).toBeInTheDocument();
  });

  it('renders drag handle', () => {
    render(
      <Wrapper>
        <SplitPane left={<div>Left</div>} right={<div>Right</div>} />
      </Wrapper>,
    );
    expect(screen.getByRole('separator')).toBeInTheDocument();
  });
});
