import { Dialog } from './dialog';

const Modal = ({ open, onClose, children }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50" />
        <Dialog.Content className="fixed left-[50%] top-[50%] w-[90vw] max-w-md -translate-x-[50%] -translate-y-[50%] rounded-lg bg-white p-6 shadow-lg">
          {children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog>
  );
};

const ModalHeader = ({ children }) => {
  return (
    <Dialog.Title className="text-2xl font-bold mb-4">
      {children}
    </Dialog.Title>
  );
};

const ModalContent = ({ children }) => {
  return (
    <div className="mb-4">
      {children}
    </div>
  );
};

const ModalFooter = ({ children }) => {
  return (
    <Dialog.Actions className="flex justify-end">
      {children}
    </Dialog.Actions>
  );
};

export { Modal, ModalHeader, ModalContent, ModalFooter };