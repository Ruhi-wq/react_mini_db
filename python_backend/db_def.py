import psycopg2 as pg
from psycopg2 import sql
from fastapi import FastAPI, Depends
from pydantic import BaseModel, conlist

import json
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="DB_Microservices")

# Allow all origins for simplicity (can be changed to a specific origin for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins, change to ["http://localhost:3000"] for specific origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, etc.)
    allow_headers=["*"],  # Allows all headers
)


def create_db():
    conn = pg.connect(host = "localhost", password = "Ruhi@5084", user = "postgres", dbname = "postgres")
    conn.autocommit = True
    cur = conn.cursor()
    try:
        cur.execute("Create Database Sample_database")
        return "Created Successfully"
    except Exception as a:
        return "Error" + "\n\n" + str(a)

def initialize():
    conn = pg.connect(host = "localhost", password = "Ruhi@5084", user = "postgres", dbname = "postgres")
    cur = conn.cursor()
    cur.execute("Select datname from pg_database")
    
    databases = cur.fetchall()
    
    if ("sample_database",) in databases:
        print("database already exists")
        res = "database already exists"
    else:
        res = create_db()
    return res



async def make_table(table_name:str,col_def:dict):
    string_table_def = ""
    for key,value in col_def.items():
        string_temp = "{col_name} {type_and_def}".format(col_name = key,type_and_def = value)
        if key == list(col_def)[-1]:
            add = ""
        else:
            add = ","
        string_table_def = string_table_def + string_temp + add
    query_create_table = """create table if not exists {table_name} (
    {columns}
    )""".format(table_name= table_name,columns=string_table_def)
    #get database handel
    try:
        sdb = pg.connect(host = "localhost", password = "Ruhi@5084", user = "postgres", dbname = "sample_database")
        cur = sdb.cursor()
        
    except pg.OperationalError as e:
        print("Error connection while creating")
        print(e)
        return e
    try:
        query = sql.SQL(query_create_table)
        cur.execute(query)
        sdb.commit()
        res = "table created: " + table_name
        print ("table created: " + table_name)
    except Exception as e:
        print("Error creating table")
        print(e)
        res = "Error: \n" + e
    return str(res)
class Add_Dat(BaseModel):
    table_name: str
    columns: str # these must be comma separated
    data: list[list]
async def insert_into_table(data:Add_Dat):
    try:
        sdb = pg.connect(host = "localhost", password = "Ruhi@5084", user = "postgres", dbname = "sample_database")
        cur = sdb.cursor()
    except pg.OperationalError as e:
        print("Error connection while inserting")
        print("Connection error inserting")
        print(e)
    columns_list = data.columns.split(",")  # This splits the comma-separated string into a list

    # Create the SQL query dynamically
    query = sql.SQL("INSERT INTO {table_name} ({columns}) VALUES ({values})").format(
        table_name=sql.Identifier(data.table_name),
        columns=sql.SQL(", ").join(map(sql.Identifier, columns_list)),  # Join column names
        values=sql.SQL(", ").join(sql.Placeholder() * len(columns_list))  # Create placeholders for values
    )
    try:
        for row in data.data:
            cur.execute(query, row)  # Insert each row of data into the table

        # Commit the transaction
        sdb.commit()
        print(f"Inserted {len(data.data)} rows into {data.table_name}")
        status = f"Inserted {len(data.data)} rows into {data.table_name}"
    except pg.Error as e:
        status = f"Error executing query insert: {e}"
        print(f"Error executing query insert: {e}")
    finally:
        cur.close()
        sdb.close()
    return status
class upd_dat(BaseModel):
    t_name: str
    col_chk_val: conlist(str,min_length=2,max_length=2) # i want to restrict it's length
    col_upd_val: conlist(str,min_length=2,max_length=2)
async def update_opr(dat:upd_dat):
    Query_str ="""update {table_name} set {col_nam} = %s where {col2_nam} = %s""".format(table_name=dat.t_name,col2_nam = dat.col_chk_val[0],col_nam= dat.col_upd_val[0])
    # get connection
    try:
        sdb = pg.connect(host = "localhost", password = "Ruhi@5084", user = "postgres", dbname = "sample_database")
        cur = sdb.cursor()
    except pg.OperationalError as e:
        print("Connection error Update")
        print(e)
        sts = "Connection error Update"
    # execute now
    try:
        cur.execute(Query_str, (dat.col_chk_val[1],dat.col_upd_val[1]))
        sdb.commit()
        sts = "Updated Successfully"
    except Exception as e:
        print("Error update:")
        print(e)
        sts = "Error: \n" + e
    return sts

class del_dat(BaseModel):
    t_name: str
    col_name: str
    col_chk_val:str 

async def delete_from_table(dat:del_dat):
    try:
        # Establish connection
        sdb = pg.connect(host="localhost", password="Ruhi@5084", user="postgres", dbname="sample_database")
        cur = sdb.cursor()
        # Properly construct the query using sql.SQL and sql.Identifier
        Query_str_del = sql.SQL("DELETE FROM {} WHERE {} = %s").format(
            sql.Identifier(dat.t_name),
            sql.Identifier(dat.col_name)
        )
        # Execute the query
        cur.execute(Query_str_del, (dat.col_chk_val,))
        sdb.commit()
        status = "Deleted Successfully"
    except pg.OperationalError as e:
        print("Connection error delete")
        print(e)
        status = "Connection error delete"
    except Exception as e:
        print("error in delete:")
        print(e)
        status = "Error: \n" + str(e)
    finally:
        # Always close the cursor and connection
        if 'cur' in locals():
            cur.close()
        if 'sdb' in locals():
            sdb.close()
    return status
class TableNameRequest(BaseModel):
    t_name: str
async def read_op(table_name:str):
    Query_read = "Select * from {tab_na}".format(tab_na =table_name)
    try:
        sdb = pg.connect(host = "localhost", password = "Ruhi@5084", user = "postgres", dbname = "sample_database")
        cur = sdb.cursor()
    except pg.OperationalError as e:
        print("Connection error reading")
        print(e)
    try:
        cur.execute(Query_read)
        read = cur.fetchall()
    except Exception as e:
        print("Reading error:")
        print(e)
    return read
    


# @app.on_event("startup")
# async def startup():
#     # Initialize the database when the app starts up
#     initialization_message = initialize()
#     print(initialization_message)


@app.get("/")
def root():
    sts = initialize()
    return {"status ": sts}
# ? works fine with docs
# @app.post("/create_table")
# async def create_table(data: dict ):
#     print("Running create table")
#     return {"message": make_table(data['table_name'], data['col_def'])}
# @app.post("/cr_tab2")
# async def create_my_tab(table_name:str,col_def:dict):
#     print("Running create table2")
#     string_table_def = ""
#     for key,value in col_def.items():
#         string_temp = "{col_name} {type_and_def}".format(col_name = key,type_and_def = value)
#         if key == list(col_def)[-1]:
#             add = ""
#         else:
#             add = ","
#         string_table_def = string_table_def + string_temp + add
#     query_create_table = """create table if not exists {table_name} (
#     {columns}
#     )""".format(table_name= table_name,columns=string_table_def)
#     #get database handel
#     try:
#         sdb = pg.connect(host = "localhost", password = "Ruhi@5084", user = "postgres", dbname = "sample_database")
#         cur = sdb.cursor()
        
#     except pg.OperationalError as e:
#         print("Error connection while creating")
#         print(e)
#         res = "connection error" + e
#     try:
#         query = sql.SQL(query_create_table)
#         cur.execute(query)
#         sdb.commit()
#         res = "table created: " + table_name
#         print ("table created: " + table_name)
#     except Exception as e:
#         print("Error creating table")
#         print(e)
#         res = "Error: \n" + e
#     return {"status:": str(res)}
# ? works fine with docs end

import logging
import datetime as dt
# Set up logging configuration
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

@app.post("/create_table")
async def create_table(data: dict):
    logger.info("Running create table")
    # * use of await is necessary 
    # ? i don't know why
    res = await make_table(data['table_name'], data['col_def'])
    return {"status:": str(res)}

@app.post("/cr_tab2")
def create_my_tab(table_name: str, col_def: dict):
    logger.debug(col_def)
    logger.debug(type(col_def['col_def']))
    log_this = "Running create table2 at time" +str(dt.datetime.now())
    logger.info(log_this )
    string_table_def = ""
    for key, value in col_def['col_def'].items():
        string_temp = "{col_name} {type_and_def}".format(col_name=key, type_and_def=value)
        if key == list(col_def['col_def'].keys())[-1]:
            add = ""
        else:
            add = ","
        string_table_def = string_table_def + string_temp + add
        
    query_create_table = """create table if not exists {table_name} ({columns})""".format(
        table_name=table_name, columns=string_table_def)

    try:
        sdb = pg.connect(host="localhost", password="Ruhi@5084", user="postgres", dbname="sample_database")
        cur = sdb.cursor()
        logger.info("Database connected successfully")
    except pg.OperationalError as e:
        logger.error("Error connecting to database: %s", e)
        return {"status": f"Error connecting to database: {e}"}

    try:
        cur.execute(query_create_table)
        sdb.commit()
        logger.info(f"Table created: {table_name}")
        return {"status": f"Table created: {table_name}"}
    except Exception as e:
        logger.error("Error creating table: %s", e)
        return {"status": f"Error: {e}"}

@app.post("/insert_into_table")
async def insert_opr(data: Add_Dat):
    logger.info("Running insert into table")
    res = await insert_into_table(data)
    return {"status": str(res)}

@app.post("/update_opr")
async def Table_update(dat: upd_dat):
    logger.info("Running update")
    res = await update_opr(dat)
    return {"status": str(res)}
@app.post("/delete_opr")
async def delete_opr(dat: del_dat):
    logger.info("Running delete")
    res = await delete_from_table(dat)
    return {"status": str(res)}

@app.post("/read_from_table")
async def read_opr(request: TableNameRequest):
    logger.info("Running read")
    res = await read_op(request.t_name)
    temp_new = {"data": res}
    logger.info(type(temp_new))
    logger.info(type(res))
    return json.dumps(temp_new)
