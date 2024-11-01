import { Code2, Palette, Zap } from 'lucide-react';

import { useDialog } from 'hooks/ui';

import { Chat } from './content';
import Dialog from './Dialog';
import TestCard from './TestCard';

/**
 * Renders a component that displays a grid of test cards and their corresponding dialogs.
 * Each test card represents a different test functionality and opens a dialog when clicked.
 * @returns {JSX.Element} A div containing a grid of TestCard components and Dialog components for each test.
 */
export const Tests = () => {
  const chatTestDialog = useDialog();
  const secondTestDialog = useDialog();
  const thirdTestDialog = useDialog();

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
        <TestCard
          icon={<Code2 className="h-12 w-12 mb-4 text-white" />}
          title="Chat Interface Test"
          description="Test chat response validity and style quality."
          state={{
            open: chatTestDialog.open,
            onOpen: chatTestDialog.handleOpen,
            onClose: chatTestDialog.handleClose,
          }}
        />
        <TestCard
          icon={<Palette className="h-12 w-12 mb-4 text-white" />}
          title="Second Test"
          description="Description for the second test."
          state={{
            open: secondTestDialog.open,
            onOpen: secondTestDialog.handleOpen,
            onClose: secondTestDialog.handleClose,
          }}
        />
        <TestCard
          icon={<Zap className="h-12 w-12 mb-4 text-white" />}
          title="Third Test"
          description="Description for the third test."
          state={{
            open: thirdTestDialog.open,
            onOpen: thirdTestDialog.handleOpen,
            onClose: thirdTestDialog.handleClose,
          }}
        />
      </div>

      {/* Dialog for the first test */}
      {chatTestDialog.open && (
        <Dialog open={chatTestDialog.open} onClose={chatTestDialog.handleClose}>
          <Chat onClose={chatTestDialog.handleClose} />
        </Dialog>
      )}

      {/* Dialogs for the second and third tests (placeholders) */}
      {secondTestDialog.open && (
        <Dialog
          open={secondTestDialog.open}
          onClose={secondTestDialog.handleClose}
        >
          {/* Content for the second test */}
          <div>Second Test Content</div>
        </Dialog>
      )}
      {thirdTestDialog.open && (
        <Dialog
          open={thirdTestDialog.open}
          onClose={thirdTestDialog.handleClose}
        >
          {/* Content for the third test */}
          <div>Third Test Content</div>
        </Dialog>
      )}
    </div>
  );
};

export default Tests;
