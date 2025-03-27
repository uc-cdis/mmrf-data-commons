import type { Meta, StoryObj } from '@storybook/react';
import { expect, within } from '@storybook/test';
import Footer from './Footer';
import footerJSON from '../../../../config/mmrf/footer.json';

const meta = {
  title: 'Components/Navigation/Footer',
  component: Footer,
} satisfies Meta<typeof Footer>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    let testIds = [
      'mmrf-footer',
      'mmrf-footer-left-section',
      'mmrf-footer-right-section',
    ];
    const numberOfLeftColumns =
      footerJSON.mmrfFooter.leftSection.columns.length;
    const arrayOfLeftColumnsIds = Array.from(
      { length: numberOfLeftColumns },
      (_, i) => String(`mmrf-footer-left-column-${i}`),
    );
    const numberOfIcons = footerJSON.mmrfFooter.rightSection.icons.length;
    const arrayOfIconIds = Array.from({ length: numberOfIcons }, (_, i) =>
      String(`mmrf-footer-icon-${i}`),
    );

    testIds = [...testIds, ...arrayOfLeftColumnsIds, ...arrayOfIconIds];
    testIds.forEach((id) => {
      const currEle = canvas.getByTestId(id);
      expect(currEle).toBeInTheDocument();
    });
  },
};
