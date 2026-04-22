import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ItemList from "../components/item/ItemList";
import { getAllItems } from "../services/itemService";
import type { Item } from "../types";

type FilterTab = "all" | "lost" | "found";

const Home = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<FilterTab>("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      setIsLoading(true);
      try {
        const params = activeTab !== "all" ? { status: activeTab } : {};
        const response = await getAllItems(params);
        setItems(response.data);
      } catch (error) {
        console.error("Failed to fetch items:", error);
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchItems();
  }, [activeTab]);

  const tabs: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "lost", label: "Lost" },
    { key: "found", label: "Found" },
  ];

  return (
    <>
      {/* ── Hero Section ── */}
      <section className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-h1 text-h1 text-on-surface mb-2">
              Community Lost & Found
            </h1>
            <p className="text-body-lg font-body-lg text-on-surface-variant max-w-2xl">
              Reconnecting people with their belongings through a dependable and
              efficient network.
            </p>
          </div>

          {/* ── Filter Tabs ── */}
          <div className="flex p-1 bg-surface-container rounded-xl">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-2 rounded-lg font-label-md transition-all cursor-pointer ${
                  activeTab === tab.key
                    ? "bg-white shadow-sm text-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Items Grid ── */}
      <ItemList
        items={items}
        isLoading={isLoading}
        onDetailsClick={(id) => navigate(`/items/${id}`)}
      />
    </>
  );
};

export default Home;
