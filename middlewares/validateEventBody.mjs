const allowedStatuses = ["draft", "published", "cancelled"];

export function validateEventBody(req, res, next) {
  const event = req.body;

  // TODO 1: เช็ก title ว่าต้องส่งมา
  // message: "กรุณาส่งข้อมูล title เข้ามาด้วย"
  if (!event.title){
    return res.status(400).json({
      message: "กรุณาส่งข้อมูล title เข้ามาด้วย"
    })
  }

  // TODO 2: เช็ก description ว่าต้องส่งมา
  // message: "กรุณาส่งข้อมูล description เข้ามาด้วย"
    if (!event.description){
    return res.status(400).json({
      message: "กรุณาส่งข้อมูล description เข้ามาด้วย"
    })
  }

  // TODO 3: เช็ก location ว่าต้องส่งมา
  // message: "กรุณาส่งข้อมูล location เข้ามาด้วย"
    if (!event.location){
    return res.status(400).json({
      message: "กรุณาส่งข้อมูล location เข้ามาด้วย"
    })
  }

  // TODO 4: เช็ก event_date ว่าต้องส่งมา
  // message: "กรุณาส่งข้อมูล event_date เข้ามาด้วย"
    if (!event.event_date){
    return res.status(400).json({
      message: "กรุณาส่งข้อมูล event_date เข้ามาด้วย"
    })
  }

  // TODO 5: เช็ก capacity ว่าต้องเป็น integer และมากกว่า 0
  // message: "capacity ต้องเป็นจำนวนเต็ม และต้องมากกว่า 0"
 if (event.capacity <= 0 ||  !Number.isInteger(event.capacity)){
    return res.status(400).json({
      message: "capacity ต้องเป็นจำนวนเต็ม และต้องมากกว่า 0"
    })
  }


  if (errors.length > 0) {
    return res.status(400).json({
      message: "Invalid request body",
      errors: errors,
    });
  }

  // TODO 6: เช็ก status ว่าต้องเป็น draft, published หรือ cancelled เท่านั้น
  // hint: allowedStatuses.includes(event.status)
  // message: "status ต้องเป็น draft, published หรือ cancelled เท่านั้น"
  if (!allowedStatuses.includes(event.status)) {
  return res.status(400).json({ 
    message: "status ต้องเป็น draft, published หรือ cancelled เท่านั้น" 
  });
}

  next();
}
