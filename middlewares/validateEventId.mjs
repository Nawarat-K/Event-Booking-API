export function validateEventId(req, res, next) {
  // TODO: eventId มาจาก URL เป็น string ต้องแปลงเป็น number ก่อน
  // ตัวอย่าง URL: /events/1
  // [DF Comment] แปลง params เป็น number แล้วเช็ก positive integer ตรงนี้ทำได้ดีครับ
  const eventId = Number(req.params.eventId);

  // TODO: ถ้า eventId ไม่ใช่ positive integer ให้ return 400
  // message: "Event id must be a positive number"
  if (!Number.isInteger(eventId) || eventId <= 0) {
    return res.status(400).json({ 
      message: "Event id must be a positive number" 
    });
  }

  // TODO: ถ้าผ่าน validation ให้เก็บเลขที่แปลงแล้วไว้ที่ req.eventId
  // [DF Comment] เก็บ req.eventId ไว้ถูกแล้วครับ อย่าลืมให้ route ด้านนอกใช้ req.eventId ต่อแทน req.params.eventId
  req.eventId = eventId;

  next();
}
