import React, { useEffect,useState } from 'react';

const Read_comp = () => {
  const [tableName, setTableName] = useState('');
  const [data, setData] = useState();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [show_dat,set_show_dat] = useState(false);

  
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

      const result = await response.json(); // * await is important else it will give promise pending

      console.log(result);
      console.log("type of result ", typeof(result)) // this is a string 
      console.log("type of result .data",typeof (result.data)); // ? is undefined
      setData(result);
      set_show_dat(true);
      console.log("in the handel submit function");
      console.log(data);
    } catch (err) {
      setError(err.message);
    } finally {

      setLoading(false);
    };
  };
  
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
        <div >
          Error: {error}
        </div>
      )}

{show_dat  && (
  <div>
    <h3>Result:</h3>
    {console.log("type of data",typeof(data))}
    <div>{data}</div> 
    {/* i want to have the data here in table format */}
    {/* have to jsonify else will hive an error */}
  </div>
)}
    </div>
  );
};

export default Read_comp;