import React, { useState } from 'react'

function Delete_tab() {
    /*
    * data structure
    {
    "t_name": str,
    "col_chk_val": list} 
    */ 
   const [t_na,set_t_na] = useState('');
   const [col_chk_val,set_col_chk_val] = useState('');
   const [colval,set_colval] = useState('');
    const [dtype,set_dtype] = useState('');
    const [message,setMessage] = useState('');
    const [dSubSta, setdSubSta] = useState(false);
   const handelDel = async (e) => {
    e.preventDefault();
    setdSubSta(true);
    setMessage('');
    const payload = {
        "t_name": t_na,
        "col_name": col_chk_val,
        "col_chk_val":  colval,
    }
    const url = "http://127.0.0.1:8000";
    try {
        const result = await fetch(`${url}/delete_opr`, {
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
        console.log(result)
        const temp_mess = result.json();
        console.log(temp_mess);
        setMessage(temp_mess);
        set_t_na(''); 
        set_col_chk_val('');
        set_dtype(''); 
        set_colval('');
        setdSubSta(false);
    } catch (error) {
        console.log(error);
        setdSubSta(false);
    }
   }
  return (
    <>
    <h1>Delete from table</h1>
    <div>
    <form onSubmit={handelDel}>
        <div>
        <label>Table Name</label>
        <input  type="text" value={t_na} onChange={(e) => {
            const val = e.target.value
            if (val === '' || /^[a-zA-Z0-9_]+$/.test(val))
            {
            set_t_na(e.target.value)}}}
            required/>
        </div>
        <div>
        <label htmlFor="aaa"> column name to check value of</label>
        <input type="text" id= "aaa" value={col_chk_val} required onChange={(e) => {
            const val = e.target.value
            if (val === '' || /^[a-zA-Z0-9_]+$/.test(val))
            {
            set_col_chk_val(e.target.value)}}}/>
        <label>Data type of column</label>
        <select onSelect={(e) => {
            console.log(e.target.value);
            set_dtype(e.target.value)}}>
            <option value="int">int</option>
            <option value="float">float</option>
            <option value="text">text</option>
            <option value="bool">bool</option>
            <option value="date">date</option>
        </select>
        </div>
        <div>
        <label >Value</label>
        <input type={dtype} value={colval} onChange={(e) => set_colval(e.target.value)}/>
        </div>
        <button type='submit' disabled={dSubSta}>
            {dSubSta ? "Deleting..." : "Delete"}
        </button>
        {message.length > 0 && (<p>{message}</p>)}
    </form>
    </div>     
    </>
  )
}

export default Delete_tab;
