import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { getAllItems } from "../services/itemService";
import { getMyClaims } from "../services/claimService";
import ItemList from "../components/item/ItemList";
import Loader from "../components/common/Loader";
import type { Item, Claim } from "../types";

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myItems, setMyItems] = useState<Item[]>([]);
  const [myClaims, setMyClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"items" | "claims">("items");

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [itemsRes, claimsRes] = await Promise.all([
          getAllItems(),
          getMyClaims(),
        ]);
        // Filter to current user's items
        setMyItems(
          itemsRes.data.filter((item: Item) => item.user_id === user?.id)
        );
        setMyClaims(claimsRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  if (isLoading) return <Loader text="Loading dashboard..." />;

  const tabs = [
    { key: "items" as const, label: "My Items", count: myItems.length },
    { key: "claims" as const, label: "My Claims", count: myClaims.length },
  ];

  return (
    <>
      <div className="mb-8">
        <h1 className="font-h1 text-h1 text-on-surface mb-2">Dashboard</h1>
        <p className="text-body-lg text-on-surface-variant">
          Welcome back, {user?.name || user?.email}
        </p>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Items", value: myItems.length, icon: "inventory_2" },
          {
            label: "Lost",
            value: myItems.filter((i) => i.status === "lost").length,
            icon: "search",
          },
          {
            label: "Found",
            value: myItems.filter((i) => i.status === "found").length,
            icon: "check_circle",
          },
          { label: "Claims", value: myClaims.length, icon: "gavel" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-outline-variant p-5 flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center">
              <span className="material-symbols-outlined text-primary">
                {stat.icon}
              </span>
            </div>
            <div>
              <p className="text-h2 font-h2 text-on-surface">{stat.value}</p>
              <p className="text-label-sm text-on-surface-variant">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Tab Toggle ── */}
      <div className="flex p-1 bg-surface-container rounded-xl w-fit mb-6">
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
            {tab.label} ({tab.count})
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      {activeTab === "items" ? (
        <ItemList
          items={myItems}
          onDetailsClick={(id) => navigate(`/items/${id}`)}
        />
      ) : (
        <div className="flex flex-col gap-4">
          {myClaims.length === 0 ? (
            <p className="text-body-lg text-on-surface-variant text-center py-10">
              You haven't submitted any claims yet.
            </p>
          ) : (
            myClaims.map((claim) => (
              <div
                key={claim.id}
                className="bg-white rounded-xl border border-outline-variant p-5 flex items-center justify-between"
              >
                <div>
                  <h3 className="font-h3 text-h3 text-on-surface">
                    {claim.items?.title || "Item"}
                  </h3>
                  <p className="text-body-sm text-on-surface-variant mt-1">
                    {claim.message}
                  </p>
                </div>
                <span
                  className={`text-label-sm font-label-sm px-3 py-1 rounded-full uppercase ${
                    claim.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : claim.status === "rejected"
                      ? "bg-error-container text-on-error-container"
                      : "bg-surface-container text-on-surface-variant"
                  }`}
                >
                  {claim.status}
                </span>
              </div>
            ))
          )}
        </div>
      )}
    </>
  );
};

export default Dashboard;
