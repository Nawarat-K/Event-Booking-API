# Event Booking API Practical Exam

## Scenario

บริษัทกำลังทำระบบ Event Booking API ให้ทีม marketing ใช้จัดกิจกรรมและให้ user ลงทะเบียนร่วมงาน

งานของคุณคือสร้าง REST API ด้วย Node.js, Express และ PostgreSQL จาก database ที่เตรียมไว้

## Setup

1. Run SQL:

```text
db/event-booking-api.sql
```

2. Check database connection:

```text
utils/db.mjs
```

3. Install and run:

```bash
npm install
npm run dev
```

Base URL:

```text
http://localhost:5006
```

## API Document

Open:

```text
../../docs/Event Booking API Practical Exam Requirements.xlsx
```

## Postman

Import:

```text
postman/Event_Booking_API_Practical_Exam.postman_collection.json
```

## Required Work

Complete these files:

```text
app.mjs
middlewares/validateEventId.mjs
middlewares/validateEventBody.mjs
```

Required endpoints:

```http
GET /events?page=1&limit=5
GET /events/:eventId
POST /events
PUT /events/:eventId
DELETE /events/:eventId
```

Bonus endpoint:

```http
GET /events/:eventId/registrations
```

## Rules

- Use PostgreSQL parameter placeholders: `$1`, `$2`, `$3`
- Do not build SQL by string concatenation with user input
- Use `try/catch` around database queries
- Use middleware for `eventId` and body validation
- Return the status code and response body from the API document
- Keep response messages exactly the same where possible

## Suggested Order

1. Make `/health` pass
2. Complete `validateEventId`
3. Complete `GET /events/:eventId`
4. Complete `GET /events` pagination
5. Complete `validateEventBody`
6. Complete `POST /events`
7. Complete `PUT /events/:eventId`
8. Complete `DELETE /events/:eventId`
9. Bonus: `GET /events/:eventId/registrations`
