import Link from "next/link";
import { MouseEventHandler, useState, useEffect } from "react";
export function Card({
  card_name,
  on_name_update = () => {},
  card_description,
  on_description_update = () => {},
  persistent_description = false,
  redirect_url,
  on_click,
  do_update = false,
  on_delete = () => {},
  on_update = (name: string, description: string) => {},
}: {
  card_name: string;
  on_name_update?: (name: string) => void;
  card_description: string;
  on_description_update?: (description: string) => void;
  persistent_description?: boolean;
  redirect_url: string | undefined;
  on_click: (() => void) | undefined;
  do_update?: boolean;
  on_delete?: () => void;
  on_update?: (name: string, description: string) => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedName, setEditedName] = useState(card_name);
  const [editedDescription, setEditedDescription] = useState(card_description);

  useEffect(() => {
    if (!editMode) {
      setEditedName(card_name);
      setEditedDescription(card_description);
    }
  }, [card_name, card_description, editMode]);

  const base = (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-all duration-300"
      onClick={on_click}>
      <div className="flex justify-between items-center">
        {editMode ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="text-xl font-semibold mb-2 border border-gray-300 rounded px-2 py-1 flex-1"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <h3 className="text-xl font-semibold mb-2">{card_name}</h3>
        )}
        {hovered ? (
          editMode ? (
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setEditMode(false);
                  setEditedName(card_name);
                  setEditedDescription(card_description);
                }}
                className="text-gray-500 hover:text-gray-700 text-lg">
                ❌
              </button>
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  console.log(editedName, editedDescription);
                  await on_update(editedName, editedDescription);
                  setEditMode(false);
                }}
                className="text-gray-500 hover:text-gray-700 text-lg">
                ✅
              </button>
            </div>
          ) : do_update ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditMode(true);
              }}
              className="text-gray-500 hover:text-gray-700 text-lg">
              ✏️
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();
                on_delete();
              }}
              className="text-gray-500 hover:text-gray-700 text-lg">
              🗑️
            </button>
          )
        ) : null}
      </div>
      {editMode ? (
        <input
          type="text"
          value={editedDescription}
          onChange={(e) => setEditedDescription(e.target.value)}
          className="text-gray-600 text-sm border border-gray-300 rounded px-2 py-1 w-full"
          onClick={(e) => e.stopPropagation()}
        />
      ) : (
        <p className="text-gray-600 text-sm">{card_description}</p>
      )}
      <p className="text-gray-600 text-sm">{persistent_description}</p>
    </div>
  );
  return redirect_url !== undefined ? (
    <Link href={redirect_url ?? ""}>{base}</Link>
  ) : (
    base
  );
}
