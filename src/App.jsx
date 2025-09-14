import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const names = [
  "Alice", "Ben", "Charlie", "Diana", "Ethan", "Fiona", "George", "Hannah",
  "Ian", "Jack", "Kara", "Leo", "Mona", "Nathan", "Olivia", "Paul", "Quinn",
  "Rachel", "Sam", "Tina", "Uma", "Victor", "Wendy", "Xander", "Yara", "Zane"
];

const fileTypes = [
  { ext: ".pdf", icon: "📄" },
  { ext: ".jpg", icon: "🖼️" },
  { ext: ".mp3", icon: "🎵" },
  { ext: ".mp4", icon: "🎬" },
  { ext: ".docx", icon: "📃" }
];

const chatIcons = ["💬", "📨", "📱"];
const peopleIcon = "👤";

const sampleData = [];
let id = 1;

// --- PEOPLE DATA ---
names.forEach((name) => {
  sampleData.push({
    id: id++,
    type: "people",
    name: name,
    icon: peopleIcon
  });
});

// --- FILES DATA ---
// For each person, assign 1-2 unique file types randomly
names.forEach((name) => {
  const shuffledFileTypes = [...fileTypes].sort(() => Math.random() - 0.5);
  const fileCount = Math.floor(Math.random() * 2) + 1; // 1 or 2 files per person

  for (let i = 0; i < fileCount; i++) {
    const file = shuffledFileTypes[i]; // no repeat
    sampleData.push({
      id: id++,
      type: "files",
      name: `${name}_file${file.ext}`,
      icon: file.icon
    });
  }
});

// --- CHATS DATA ---
// Create 1-2 chats per person
names.forEach((name) => {
  const chatCount = Math.floor(Math.random() * 2) + 1;
  for (let i = 0; i < chatCount; i++) {
    sampleData.push({
      id: id++,
      type: "chats",
      name: `Chat with ${name}`,
      icon: chatIcons[Math.floor(Math.random() * chatIcons.length)]
    });
  }
});

function App() {
  const [search, setSearch] = useState("");
  const [activeTabs, setActiveTabs] = useState(["All", "People", "Files", "Chats"]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedTab, setSelectedTab] = useState("All");
  const dropdownRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggleTab = (tab) => {
    if (tab === "All") return; // Prevent removing All
    if (activeTabs.includes(tab)) {
      setActiveTabs(activeTabs.filter((t) => t !== tab));
      if (selectedTab === tab) setSelectedTab("All");
    } else {
      setActiveTabs([...activeTabs, tab]);
    }
  };

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const getTabCount = (type) => {
    if (type === "All") {
      return sampleData.filter(item => activeTabs.includes(capitalize(item.type))).length;
    }
    if (!activeTabs.includes(type)) return 0;
    return sampleData.filter(item => item.type === type.toLowerCase()).length;
  };

  const filteredData = sampleData.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    if (selectedTab === "All") {
      // Show only active tabs items
      return matchSearch && activeTabs.includes(capitalize(item.type));
    }
    return matchSearch && item.type === selectedTab.toLowerCase();
  });

  return (
    <div className="app">
      {/* Search Header */}
      <div className="search-header">
        <div className="search-box-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button className="clear-btn" onClick={() => setSearch("")} aria-label="Clear search">
              ×
            </button>
          )}
        </div>
      </div>

      {/* Tabs Row + Settings Icon */}
     {/* Tabs Row + Settings Icon */}
<div className="tabs-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <div className="tabs" style={{ display: "flex", gap: "10px" }}>
    {["All", "Files", "People", "Chats"].map((tab) => {
      if (!activeTabs.includes(tab) && tab !== "All") return null;

      const tabIcons = {
        All: "🗂️",
        People: "👤",
        Files: "📎",
        Chats: "💬",
      };

      return (
        <button
          key={tab}
          className={`tab ${selectedTab === tab ? "active" : ""}`}
          onClick={() => setSelectedTab(tab)}
        >
          <span className="tab-icon">{tabIcons[tab]}</span>
          <span className="tab-label">{tab}</span>
          <span className="count">{getTabCount(tab)}</span>
        </button>
      );
    })}
  </div>

  {/* Settings Dropdown */}
  <div className="settings-container" style={{ position: "relative" }}>
    <button
      className="settings-btn"
      onClick={() => setShowDropdown(!showDropdown)}
      style={{ position: "relative", zIndex: 10 }}
    >
      ⚙️
    </button>
    {showDropdown && (
      <div
        className="dropdown"
        ref={dropdownRef}
        style={{
          position: "absolute",
          top: "100%",
          right: 0,
          background: "white",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          borderRadius: "4px",
          marginTop: "4px",
          zIndex: 9,
          minWidth: "120px",
        }}
      >
        {["Files", "People", "Chats", "Lists"].map((tab) => (
          <label key={tab} className="dropdown-item" style={{ display: "block", padding: "6px 10px", cursor: "pointer" }}>
            <input
              type="checkbox"
              checked={activeTabs.includes(tab)}
              onChange={() => handleToggleTab(tab)}
              style={{ marginRight: "6px" }}
            />
            <span>{tab}</span>
          </label>
        ))}
      </div>
    )}
  </div>
</div>


      {/* Results */}
      <div className="results">
        {filteredData.length > 0 ? (
          filteredData.map((item) => (
            <div key={item.id} className="result-card">
              <div className="icon">{item.icon}</div>
              <div className="details">
                <div className="title">{item.name}</div>
                <div className="subtitle">
                  {item.type.charAt(0).toUpperCase() + item.type.slice(1)} • Just now
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-results">No results found</p>
        )}
      </div>
    </div>
  );
}

export default App;
