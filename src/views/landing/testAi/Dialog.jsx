export const Dialog = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="dialog fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Dialog;
