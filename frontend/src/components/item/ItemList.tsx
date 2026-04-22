import ItemCard from "./ItemCard";
import Loader from "../common/Loader";
import type { ItemListProps } from "../../types";

const ItemList = ({ items, isLoading, onDetailsClick }: ItemListProps) => {
  if (isLoading) {
    return <Loader text="Loading items..." />;
  }

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant opacity-40">
          inbox
        </span>
        <p className="text-body-lg text-on-surface-variant">
          No items found. Try adjusting your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-gutter">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onDetailsClick={onDetailsClick} />
      ))}
    </div>
  );
};

export default ItemList;
