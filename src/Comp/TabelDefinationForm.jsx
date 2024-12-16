import React, { useState } from 'react';
// import { Card, div, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Plus, Trash2 } from 'lucide-react';
// import axios from 'axios';

const TableDefinitionForm = () => {
  const [tableName, setTableName] = useState('');
  const [columns, setColumns] = useState([
    { name: '', dataType: '' }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const handleAddColumn = () => {
    setColumns([...columns, { name: '', dataType: '' }]);
  };
  const createPayload = () => {
    const col_def = columns.reduce((acc, col) => {
      if (col.name && col.dataType) {
        acc[col.name] = col.dataType;  // Key = column name, value = data type
      }
      return acc;
    }, {});

    return {
      table_name: tableName,
      col_def: col_def  // The transformed columns data
    };
  };

  const handleRemoveColumn = (index) => {
    const newColumns = columns.filter((_, idx) => idx !== index);
    setColumns(newColumns);
  };

  const handleColumnChange = (index, field, value) => {
    const newColumns = [...columns];
    newColumns[index][field] = value;
    setColumns(newColumns);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    // Transform columns array to col_def object
    const col_def = columns.reduce((acc, col) => {
      if (col.name && col.dataType) {
        acc[col.name] = col.dataType;
      }
      return acc;
    }, {});
    
    

    const payload = createPayload()
    console.log(payload)
    console.log(typeof(JSON.stringify(payload)))
    console.log(typeof(payload))
    const url = "http://127.0.0.1:8000";
    try {
      
      const response = await fetch(`${url}/create_table`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        console.log(response)
        throw new Error('Failed to create table');
        
      }

      setMessage('Table definition saved successfully!');
      // Reset form
      setTableName('');
      setColumns([{ name: '', dataType: '' }]);
    } catch (error) {
      setMessage('Error: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
    <div >
      
        <h1 >Create Table</h1>
      </div>
      <div>
        <form onSubmit={handleSubmit} >
          <div>
            <label >
              Table Name
            </label>
            <input
              type="text"
              value={tableName}
              onChange={(e) => setTableName(e.target.value)}
              placeholder="Enter table name"
              required
              
            />
          </div>

          <div >
            <label >Columns</label>
            {columns.map((column, index) => (
              <div key={index} >
                <div >
                  <input
                    type="text"
                    value={column.name}
                    onChange={(e) => handleColumnChange(index, 'name', e.target.value)}
                    placeholder="Column name"
                    required
                  />
                </div>
                <div >
                  <input
                    type="text"
                    value={column.dataType}
                    onChange={(e) => handleColumnChange(index, 'dataType', e.target.value)}
                    placeholder="Data type (e.g., VARCHAR(255))"
                    required
                  />
                </div>
                {columns.length > 1 && (
                  <button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => handleRemoveColumn(index)}
                  >
                    delete
                  </button>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            variant="outline"
            onClick={handleAddColumn}
            
          >
            
            Add Column
          </button>

          <button
            type="submit"
            
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Table Definition'}
          </button>

          {message && (
            <div >
              {message}
            </div>
          )}
        </form>
      </div>
      </>
  );
};

export default TableDefinitionForm;