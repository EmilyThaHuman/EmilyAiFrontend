import { Code2, Palette, Zap } from 'lucide-react';

import { useDialog } from 'hooks/ui';

import { Chat } from './content';
import Dialog from './Dialog';
import TestCard from './TestCard';

export const Tests = () => {
  const chatTestDialog = useDialog();
  const reactAgentDialog = useDialog();
  const artifactsChatDialog = useDialog();

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
            open: reactAgentDialog.open,
            onOpen: reactAgentDialog.handleOpen,
            onClose: reactAgentDialog.handleClose,
          }}
        />
        <TestCard
          icon={<Zap className="h-12 w-12 mb-4 text-white" />}
          title="Third Test"
          description="Description for the third test."
          state={{
            open: artifactsChatDialog.open,
            onOpen: artifactsChatDialog.handleOpen,
            onClose: artifactsChatDialog.handleClose,
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
      {reactAgentDialog.open && (
        <Dialog
          open={reactAgentDialog.open}
          onClose={reactAgentDialog.handleClose}
        >
          {/* Content for the second test */}
          <div>Second Test Content</div>
        </Dialog>
      )}
      {artifactsChatDialog.open && (
        <Dialog
          open={artifactsChatDialog.open}
          onClose={artifactsChatDialog.handleClose}
        >
          {/* Content for the third test */}
          <div>Third Test Content</div>
        </Dialog>
      )}
    </div>
  );
};

export default Tests;
