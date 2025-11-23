export function Dialog({
  children,
  on_add,
  on_cancel,
  disabled = true,
}: {
  children: React.ReactNode;
  on_add: () => void;
  on_cancel: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="w-1/2 h-1/2 gb-black rounded-4xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black bg-opacity-50 flex flex-col items-center justify-center">
      <div className="h-full w-full">{children}</div>
      <div className="flex gap-2 mb-4 mt-4">
        <button
          onClick={on_add}
          className={`bg-yellow-300 text-black font-bold px-4 py-2 rounded-md ${
            disabled ? "opacity-50 cursor-not-allowed" : ""
          }`}>
          Всё правильно
        </button>
        <button
          onClick={on_cancel}
          className=" text-white underline px-4 py-2 rounded-md">
          Отмена
        </button>
      </div>
    </div>
  );
}
