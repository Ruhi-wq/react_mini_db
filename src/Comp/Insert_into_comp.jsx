import React, { useState } from 'react'
import { use } from 'react';

export default function Insert_into_comp() {
  /*
  I am taking a list to be used as colums in tabel
  * variables (in state) column_comma_separated, data_values_comma_separated, and tabel name
  w-flow 1. define state variables
    1. submit_state
    2. data 
    3. columns
    4. tabel name
    5. message/ result
  w-flow 2. create outline like a form (keep a check to not have space but comma)
    1. the form will have the following elements
       1.1 name of table
       1.2 comma separated columns (check on component function make)
       1.3 comma separated data (dynamic component added as a button is clicked)
       1.4 delete button to delete data
       1.5 submit button
  w-flow 3. add dynamic form field that will take comma separated values for data

  w-flow 5. send data to backend
  w-flow 4. handel on submit function
  i will also need 
  */ 
 // seg-expl: define state variables
    const [comm_sp_vals, set_comm_sp_vals] = useState('');
    const [SubSta, setSubSta] = useState(false);
    const [data, setData] = useState([]);
    const [tab_na, settab_na] = useState('');
    const [message, setMessage] = useState('');
    
// seg-expl: creating functions to handle the form dynamic elemnet and check values
    const handleDataChange = (index, e) => {
        const newData = [...data];
        newData[index] = e.target.value;
        setData(newData);
    };

    const handleDelete = (index) => {
        const newDat = data.filter((_, i) => i !== index);
        setData(newDat);
    };
    const handleAddData = () => {
        setData([...data, '']);
    }
    const create_data = (data) => {
        const result = [];
        for (let i = 0; i < data.length; i++) {
            console.log(data[i]);

            result.push(data[i].split(','));
        }
        return result
    }
    const handelInsert = async (e) => {
        e.preventDefault();
        setSubSta(true);
        console.log(comm_sp_vals);
        // creating the request payload
        const payload = {
            "table_name": tab_na,
            "columns": comm_sp_vals,
            "data": create_data(data)
        };
        console.log(payload);
        console.log(JSON.stringify(payload));

        // sending the request to the backend
        const url = "http://127.0.0.1:8000";
        try {
        const result = await fetch(`${url}/insert_into_table`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
    if (!result.ok) {
        console.log(result);
        throw new Error(`HTTP error! status: ${result}`);
    }
    setMessage("Data inserted successfully");
    setData([]);
    settab_na('');
}
        catch (error) {
            console.log(error);
        }
        finally {
            setSubSta(false);
        }
    };

    
    return (
    <>
    <h1>Insert table</h1>
    <div>
        <form onSubmit={handelInsert}>
            <div>
                <label> Name of table </label>
                <input type='text' placeholder='Enter the name of table' onChange={(e) => settab_na(e.target.value)} value={tab_na} required/>

            </div>
            <div>
                <label htmlFor="columnsCommaSeparated">Enter the columns (comma separated)</label>
                    <input type="text" 
                    id="columnsCommaSeparated" 
                    value = {comm_sp_vals} 
                    onChange={ (e)=> {
                        const value = e.target.value;
                        if (value === '' || /^[a-zA-Z0-9,_]+$/.test(value))
                            {set_comm_sp_vals(e.target.value)}}} 
                    required />
            </div>
            <div>
                <label>Data to insert</label>
                {data.map((item, index) => (
                    <div key={index}>
                        <div>
                        <input type="text" 

                        onChange={(e) => handleDataChange(index, e)} 
                        value={item} />
                        </div>                                   
                        { data.length > 1 && (
                        <button type="button" variant="destructive" onClick={() => handleDelete(index)}>Delete</button>)}
                        
                    </div>
                ))}
                
            </div>
            <button
            type="button"
            variant="outline"
            onClick={handleAddData}
            
          >
            
            Add Column
          </button>

          <button
            type="submit"
            
            disabled={SubSta}
          >
            {SubSta ? 'Inserting...' : 'Insert into table'}
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

