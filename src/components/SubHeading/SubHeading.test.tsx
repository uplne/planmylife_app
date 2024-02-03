import { render, screen} from '@testing-library/react';
import '@testing-library/jest-dom';

import { SubHeading } from './index';

describe("SubHeading component", () => {
  test('It renders correctly', async () => {
    render(<SubHeading>Title</SubHeading>);
    
    expect(await screen.findByText('Title')).toBeInTheDocument();
  });
})
