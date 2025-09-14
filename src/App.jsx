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

// Preview first 10 entries
console.log(sampleData.slice(0, 10));


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

  const filteredData = sampleData.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    if (selectedTab === "All") return matchSearch;
    return matchSearch && item.type === selectedTab.toLowerCase();
  });

  const getTabCount = (type) => {
    if (type === "All") return sampleData.length;
    return sampleData.filter((item) => item.type === type.toLowerCase()).length;
  };

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
      <div className="tabs-row">
  <div className="tabs">
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
        <div className="settings-container">
          <button className="settings-btn" onClick={() => setShowDropdown(!showDropdown)}>
            ⚙️
          </button>
          {showDropdown && (
            <div className="dropdown" ref={dropdownRef}>
              {["Files", "People", "Chats", "Lists"].map((tab) => (
                <label key={tab} className="dropdown-item">
                  <input
                    type="checkbox"
                    checked={activeTabs.includes(tab)}
                    onChange={() => handleToggleTab(tab)}
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
              <div className="icon">
                {item.type === "people" ? "👤" : item.type === "files" ? "📄" : "💬"}
              </div>
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
