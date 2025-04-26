import { Customer } from "@/types/schemaTypes";
import { useState } from "react";

const CustomDialog = ({ results }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState(results || []);
  const [innerDialogOpen, setInnerDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  const handleSearch = (event: any) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    if (value) {
      const filtered = results.filter((item: any) =>
        item.name.toLowerCase().includes(value)
      );
      setFilteredResults(filtered);
    } else {
      setFilteredResults(results);
    }
  };

  const openInnerDialog = (item: any) => {
    setSelectedItem(item);
    setInnerDialogOpen(true);
  };

  const closeInnerDialog = () => {
    setInnerDialogOpen(false);
    setSelectedItem(null);
  };

  return (
    <div>
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={() => setIsOpen(true)}
      >
        Open Dialog
      </button>

      {/* Main Dialog */}
      {isOpen && (
        <div className="fixed inset-0 bg-gray-800 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
            <h2 className="text-lg font-bold mb-4">Select Item</h2>

            {/* Search Input */}
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={handleSearch}
              className="border border-gray-300 p-2 w-full mb-4 rounded"
            />

            {/* Scrollable Result List */}
            <div className="max-h-60 overflow-y-auto border rounded p-2 bg-gray-100">
              {filteredResults.length > 0 ? (
                filteredResults.map((item: Customer, index: number) => (
                  <div
                    key={index + new Date().toISOString()}
                    className="p-2 hover:bg-gray-200 cursor-pointer text-black"
                    onClick={() => openInnerDialog(item)}
                  >
                    {item.name}
                  </div>
                ))
              ) : (
                <div className="text-center">No results found</div>
              )}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                onClick={() => setIsOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inner Dialog */}
      {innerDialogOpen && selectedItem && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full relative">
            <h2 className="text-lg font-bold mb-4">
              Details for {selectedItem.name}
            </h2>

            <p className="mb-4">
              Additional details about <strong>{selectedItem.name}</strong> will
              be displayed here.
            </p>

            <div className="mt-4 flex justify-end gap-2">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded"
                onClick={closeInnerDialog}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDialog;
