import { useState, useEffect } from "react";

export default function Missions({ coins, setCoins, missions = [] }) {
  const [subscribed, setSubscribed] = useState({});
  const [allMissions, setAllMissions] = useState([]);

  const allowedTypes = ["instagram", "group", "channel"];

  // Localdan bajarilgan missiyalarni olish
  useEffect(() => {
    try {
      const savedSubs = localStorage.getItem("subscribedMissions");
      if (savedSubs) {
        setSubscribed(JSON.parse(savedSubs));
      }
    } catch (err) {
      console.error("❌ subscribedMissions JSON xato:", err);
    }
  }, []);

  // Missiyalarni localStorage yoki props'dan olish
  useEffect(() => {
    try {
      if (missions && missions.length > 0) {
        setAllMissions(missions);
        localStorage.setItem("missionsData", JSON.stringify(missions));
      } else {
        const savedMissions = localStorage.getItem("missionsData");
        if (savedMissions) {
          setAllMissions(JSON.parse(savedMissions));
        }
      }
    } catch (err) {
      console.error("❌ missionsData JSON xato:", err);
    }
  }, [missions]);

  const handleSubscribe = (key, url, item) => {
    if (subscribed[key]) return;

    window.open(url, "_blank");

    const updated = { ...subscribed, [key]: true };
    setSubscribed(updated);
    localStorage.setItem("subscribedMissions", JSON.stringify(updated));
    if (setCoins) {
      setCoins((prev) => prev + (item.price || 0));
    }
  };
  console.log(localStorage.getItem("missionsData"));

  return (
    <div
      style={{
        padding: "2rem",
        color: "white",
        fontFamily: "Arial",
        maxWidth: "600px",
        margin: "auto",
      }}
    >
      <h1 style={{ textAlign: "center", marginBottom: "2rem" }}>🎯 Missions</h1>

      <div
        style={{
          maxHeight: "70vh",
          overflowY: "auto",
          paddingRight: "0.5rem",
        }}
      >
        {allMissions.length === 0 && (
          <p style={{ color: "#aaa", textAlign: "center" }}>
            🚫 No missions yet
          </p>
        )}

        {allMissions.map((item, index) => {
          const id = item?.id || index;
          const isAllowed = allowedTypes.includes(item?.type);
          const isDone = subscribed[id];

          return (
            <div
              key={id}
              style={{
                background: "#1f2937",
                padding: "1rem",
                borderRadius: "1rem",
                marginBottom: "1rem",
                boxShadow: "0 0 15px rgba(0,0,0,0.4)",
                opacity: isAllowed ? (isDone ? 0.5 : 1) : 0.3,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                pointerEvents: isDone ? "none" : "auto",
              }}
            >
              <div style={{ maxWidth: "60%" }}>
                <h3
                  style={{
                    margin: "0 0 0.3rem 0",
                    fontSize: "1rem",
                    wordWrap: "break-word",
                  }}
                >
                  {item?.title || "Untitled"}
                </h3>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.9rem",
                    color: isAllowed ? "#ccc" : "#f87171",
                  }}
                >
                  {isAllowed
                    ? isDone
                      ? "✅ Already subscribed"
                      : `Subscribe to earn 🪙${item?.price || 0} coins`
                    : "❌ Not allowed"}
                </p>
              </div>

              {isAllowed &&
                (isDone ? (
                  <div
                    style={{
                      background: "#22c55e",
                      color: "white",
                      padding: "0.2rem 0.4rem",
                      borderRadius: "0.5rem",
                      fontWeight: "bold",
                      fontSize: "0.9rem",
                      textAlign: "center",
                      minWidth: "120px",
                    }}
                  >
                    ✅ Subscribed
                  </div>
                ) : (
                  <button
                    onClick={() => handleSubscribe(id, item.url, item)}
                    style={{
                      background: "#3b82f6",
                      color: "white",
                      padding: "0.5rem 1rem",
                      border: "none",
                      borderRadius: "0.5rem",
                      cursor: "pointer",
                      fontWeight: "bold",
                      minWidth: "120px",
                    }}
                  >
                    + Subscribe
                  </button>
                ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}
