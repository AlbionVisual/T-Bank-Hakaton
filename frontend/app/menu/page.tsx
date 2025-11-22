import Link from "next/link";
import { List } from "@/components/ui/List";

export default function Page() {
  return (
    <>
      <header>
        <List items={[]} renderItem={() => <div>Item</div>} keyExtractor={() => '1'} />
      </header>
    </>
  );
}
