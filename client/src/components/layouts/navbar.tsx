import React, { useState, useEffect, useContext } from 'react';

const AdContext = React.createContext();

const useAds = () => {
  const context = useContext(AdContext);
  if (!context) {
    throw new Error('useAds must be used within an AdProvider');
  }
  return context;
};

const AdProvider = ({ children }) => {
  const [isAdminMode, setIsAdminMode] = useState(false);

  const toggleAdminMode = () => {
    setIsAdminMode(!isAdminMode);
  };

  const value = { isAdminMode, toggleAdminMode };

  return <AdContext.Provider value={value}>{children}</AdContext.Provider>;
};


function Navigation({ user, handleLogout }) {
  return (
    <nav>
      <ul>
        {/* other navigation items */}
        {user && (
          <>
            {user.role === 'admin' && (
              <li>
                <button
                  onClick={() => useAds().toggleAdminMode()}
                  className="text-black hover:text-gray-700 mr-4"
                >
                  {useAds().isAdminMode ? '关闭广告管理' : '广告管理'}
                </button>
              </li>
            )}
            <li>
              <button
                onClick={handleLogout}
                className="text-black hover:text-gray-700"
              >
                退出
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}


function App() {
  const [user, setUser] = useState(null); // Placeholder for user authentication

  const handleLogout = () => {
    // Implement logout logic
    setUser(null);
  };

  return (
    <AdProvider>
      <div>
        <Navigation user={user} handleLogout={handleLogout} />
        {/* Rest of the app */}
      </div>
    </AdProvider>
  );
}

export default App;