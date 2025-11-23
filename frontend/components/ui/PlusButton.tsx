export function PlusButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      className="fixed bottom-4 right-4 bg-yellow-300 text-black font-bold text-lg rounded-full px-4 py-2 flex items-center shadow-md transition duration-200 hover:bg-yellow-400"
      onClick={onClick}>
      +
    </button>
  );
}
