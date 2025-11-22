import Link from "next/link";
export function Card({
  card_name,
  card_description,
  redirect_url,
  on_click,
}: {
  card_name: string;
  card_description: string;
  redirect_url: string;
  on_click: () => void;
}) {
  return (
    <Link href={redirect_url}>
      <div
        className="bg-white rounded-lg shadow-md p-4 cursor-pointer hover:shadow-lg transition-all duration-300"
        onClick={on_click}>
        <h3 className="text-xl font-semibold mb-2">{card_name}</h3>
        <p className="text-gray-600 text-sm">{card_description}</p>
      </div>
    </Link>
  );
}
