const CustomDrawer = ({ isOpen, onClose, children }: any) => {
  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity ${
        isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      }`}
    >
      <div
        className={`absolute inset-0 bg-black opacity-50 ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={onClose}
      />
      <div
        className={`absolute right-0 top-0 h-full bg-white w-96 shadow-lg transition-transform transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-4">
          <button className="mb-4 text-gray-500" onClick={onClose}>
            Close
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default CustomDrawer;
