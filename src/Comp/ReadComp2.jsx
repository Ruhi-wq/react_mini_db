import React, { useState } from 'react';
import TableComponent from './ui/TabelComponent';

const Read_comp = () => {
  const [tableName, setTableName] = useState('');
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDat, setShowDat] = useState(false);

  // Function to parse the stringified JSON into an object
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const url = "http://127.0.0.1:8000";
    try {
      const response = await fetch(`${url}/read_from_table`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ t_name: tableName }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json(); // Get the raw response string
      console.log("Raw response from backend:", result); // Log the raw response

      // Parse the string to get the actual data
      console.log("Parsed response from backend:", JSON.parse(result));
      console.log("type of parsed response from backend:", typeof(JSON.parse(result)));
      console.log("type of raw result from backend", typeof(result));
      setData(JSON.parse(result));
      setShowDat(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Render the table
  

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-4">
          <label htmlFor="tableName" className="block mb-2">
            Table Name:
          </label>
          <input
            id="tableName"
            type="text"
            value={tableName}
            onChange={(e) => setTableName(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-400"
        >
          {loading ? 'Loading...' : 'Read Table'}
        </button>
      </form>

      {error && (
        <div>
          <p>Error: {error}</p>
        </div>
      )}

      {showDat && (
        <div>
          <h3>Result:</h3>
          <table>
            <tbody>
            {
              Object.keys(data.data).map((key) => (
                <tr key={key}>
                  {data.data[key].map((value) => (
                    <td key={value}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          {/* Display the data in table format */}
        </div>
      )}
    </div>
  );
};

export default Read_comp;
