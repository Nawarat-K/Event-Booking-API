import express, { json } from "express";
import connectionPool from "./utils/db.mjs";
import { validateEventBody } from "./middlewares/validateEventBody.mjs"; 
import { validateEventId } from "./middlewares/validateEventId.mjs"; 

const app = express();
const port = 5006;

app.use(express.json());

app.get("/health", (req, res) => {
  return res.status(200).json({
    status: "ok",
  });
});

// TODO: อ่าน API Document แล้วสร้าง routes เองในไฟล์นี้
// Hint 1: route ที่มี id ควรใช้ validateEventId จาก middlewares/validateEventId.mjs
// Hint 2: route ที่รับ body ควรใช้ validateEventBody จาก middlewares/validateEventBody.mjs
// Hint 3: pagination ใช้ page, limit, offset = (page - 1) * limit
// Hint 4: status ที่อนุญาตคือ draft, published, cancelled
// Hint 5: INSERT / UPDATE / DELETE ควรใช้ RETURNING * เพื่อรู้ว่า database ทำรายการสำเร็จจริงไหม
app.get("/events", async(req, res) => {
  let page = 1;
  let limit = 5;

  // [DF Comment] limit เริ่ม validate ได้ดีแล้วครับ แต่ page ยังไม่ได้อ่านจาก req.query.page เลย ตอนนี้ page=2 จะยังได้ข้อมูลหน้าแรกอยู่
  if (req.query.limit !== undefined){
    limit = Number(req.query.limit);
  }

  if (limit > 10){
    return res.status(400).json({
      message: "limit must not be more than 10"
    })
  }

    const offset = (page - 1) * limit;

    const status = req.query.status
    const allowedStatuses = ["draft", "published", "cancelled"];

  // [DF Comment] เช็ก status ที่รับเข้ามาถูกทางแล้วครับ ขั้นต่อไปคือต้องเอา status ไปใส่ใน WHERE ของ query ด้วย
  if (status && !allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "status must be draft, published or cancelled",
    });
  }

  try {
  const result = await connectionPool.query(
    `
    SELECT *
    FROM events
    ORDER BY event_id ASC
    LIMIT $1
    OFFSET $2
    `,
    [limit, offset],
    );

    return res.status(200).json({
      message: "Get events successfully",
      // [DF Comment] response ตอนนี้ยังขาด pagination object เช่น page, limit, totalItems, totalPages ตามโจทย์ pagination
      data: result.rows,
    });

  } catch (error) {
    console.error("[GET /event] database error:", error.message);

    return res.status(500).json({
      message: "Server could not get event",
    });
  }
});

app.get("/events/:eventId", validateEventId, async(req,res) => {
  // [DF Comment] middleware แปลง id ไว้ที่ req.eventId แล้วครับ ใช้ค่านั้นต่อได้เลย จะได้ไม่ต้องใช้ string จาก params ซ้ำ
  const eventId = req.params.eventId
  console.log(`event ID: ${eventId}`);

  try {
    const result = await connectionPool.query(
      `
      SELECT *
      FROM events
      WHERE event_id = $1
      `,
      [eventId]
    )
    console.log(`Get event row ${result.rows.length}`)

    if (result.rows.length === 0) {
      console.log("Event not found");
      return res.status(404).json({
        message: "Event not found"
      })
    }
    return res.status(200).json({
      message: "Get event successfully",
      data: result.rows[0]
    })
  }
  catch (error) {
    console.log(`error ${error}`);
    return res.status(500).json({
      message: "Server could not get event"
    })
    
  }
})

// [DF Comment] route update ควรใช้ validateEventId และ validateEventBody เหมือน GET by id กับ POST เพื่อกัน id/body ที่ไม่ถูกต้องก่อนเข้า database
app.put("/events/:eventId", async(req,res) => {
  const eventId = req.params.eventId
  console.log(`event ID: ${eventId}`);

  const updateEvent = {
    ...req.body,
  }

  try {
    // [DF Comment] ถ้าจะอ่าน result.rows[0] หลัง UPDATE ต้องใส่ RETURNING * ไม่งั้น rows จะว่าง ถึง update สำเร็จก็จะเข้า not found
    const result = await connectionPool.query(
      `
      UPDATE events
      SET title = $1,
          description = $2,
          location = $3,
          event_date = $4,
          capacity = $5,
          status = $6
      WHERE event_id = $7
      `,
      [
        updateEvent.title,
        updateEvent.description,
        updateEvent.location,
        updateEvent.event_date,
        updateEvent.capacity,
        updateEvent.status,
        eventId
      ]
    )
    console.log(`Get event row ${result.rows.length}`)

    if (result.rows.length === 0) {
      console.log("Event not found");
      return res.status(404).json({
        message: "Event not found"
      })
    }
    return res.status(200).json({
      message: "Updated event successfully",
      data: result.rows[0]
    })
  }
  catch (error) {
    console.log(`error ${error}`);
    return res.status(500).json({
      message: "Server could not get event"
    })
    
  }
})

app.post("/events", validateEventBody, async(req, res) => {
  const newEvent = {
    title: req.body.title,
    description: req.body.description,
    location: req.body.location,
    event_date: req.body.event_date,
    capacity: req.body.capacity,
    status: req.body.status
  }

  // [DF Comment] create endpoint ควรครอบ try/catch ด้วยครับ ถ้า database error ตอน insert ตอนนี้ request จะหลุดเป็น error กลางทาง
  // [DF Comment] ใช้ RETURNING * หรือ RETURNING event_id จะช่วยให้ response ส่ง id ที่ database สร้างจริงกลับไปได้
  await connectionPool.query(
    `
    INSERT INTO events (title, description, location, event_date, capacity, status)
    VALUES ($1, $2, $3, $4, $5, $6)
    `,
    [
      newEvent.title,
      newEvent.description,
      newEvent.location,
      newEvent.event_date,
      newEvent.capacity,
      newEvent.status,
    ]
  )
  return res.status(201).json({
    message: "Created event successfully",
    data: newEvent
  })
})

// [DF Comment] route delete ควรใส่ validateEventId ด้วยครับ จะได้ reject /events/abc ก่อนเอาไป query
app.delete("/events/:eventId", async(req,res) => {
  const eventId = req.params.eventId
  console.log(`event ID: ${eventId}`);

  try {
    // [DF Comment] DELETE ตรงนี้ก็ต้องใช้ RETURNING * ถ้าจะเช็ก result.rows.length และส่งข้อมูลที่ลบกลับไป
    const result = await connectionPool.query(
      `
      DELETE FROM events
      WHERE event_id = $1
      `,
      [eventId]
    )
    console.log(`Get event row ${result.rows.length}`)

    if (result.rows.length === 0) {
      console.log("Event not found")
      return res.status(404).json({
        message: "Event not found"
      }) 
    }

    return res.status(200).json({
      message: "Deleted event successfully",
      data: result.rows[0]
    })
  }
  catch (error) {
    console.log(`error ${error}`);
    return res.status(500).json({
      message: "Server could not get event"
    })
    
  }
})

// [DF Comment] ตรงนี้วงเล็บปิดเร็วไปครับ handler ไม่ได้ถูกส่งเข้า app.get ทำให้ bonus route ยังไม่ถูก register จริง
app.get("/events/:eventId/registrations"), (req, res) => {
    const eventId = req.params.eventId
    console.log(`event ID: ${eventId}`);
}

app.listen(port, () => {
  console.log(`Event Booking API running at http://localhost:${port}`);
});
