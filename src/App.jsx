import React, { useState, useEffect, useRef } from "react";
import "./App.css";

const sampleData = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  type: i % 3 === 0 ? "people" : i % 3 === 1 ? "files" : "chats",
  name: `Sample ${i + 1}`,
}));

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
        Files: "📄",
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
