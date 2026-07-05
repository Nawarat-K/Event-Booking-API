import * as pg from "pg";

const { Pool } = pg;

// แก้ข้อมูล connection ให้ตรงกับ database ในเครื่อง
const connectionPool = new Pool({
  user: "postgres",
  password: "Passw@rd1234",
  host: "localhost",
  port: 5432,
  database: "eventBookingAPI",
});

export default connectionPool;
