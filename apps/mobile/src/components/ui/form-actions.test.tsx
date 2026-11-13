import { render, screen } from '@testing-library/react-native';
import { Text } from 'react-native';

import { jsonStyle, type JsonNode } from '@/test-utils/render-tree';
import { spacing } from '@/theme/tokens';

import { FormActions } from './form-actions';

describe('FormActions', () => {
  it('should render its children', () => {
    render(
      <FormActions>
        <Text>ação</Text>
      </FormActions>,
    );

    expect(screen.getByText('ação')).toBeTruthy();
  });

  it('should leave 24 between the last field and the actions, discounting the field gap', () => {
    render(
      <FormActions>
        <Text>ação</Text>
      </FormActions>,
    );

    const style = jsonStyle(screen.toJSON() as JsonNode);

    expect((style.marginTop as number) + spacing.field).toBe(spacing.lg);
  });
});
