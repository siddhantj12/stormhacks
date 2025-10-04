'use client';

// TODO(design): Style the chat dock.
// This is a simplified version. A real implementation might have a history.

export default function ChatDock() {
  return (
    <footer className="p-4 bg-gray-800 z-10">
      <input 
        type="text" 
        placeholder="Ask a general question... (mocked)"
        className="w-full p-2 border bg-gray-700 text-white rounded"
        disabled // Disabled for now as it's not tied to specific evidence
      />
    </footer>
  );
}
