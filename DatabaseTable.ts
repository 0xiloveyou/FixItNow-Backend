/*


                    +----------------+
                    |     Users      |
                    +----------------+
                    id (PK)
                    name
                    email (Unique)
                    password
                    phone
                    profileImage
                    role
                    status
                    createdAt
                    updatedAt
                           |
            +--------------+--------------+
            |                             |
            |1                            |1
            |                             |
            ▼                             ▼
+--------------------------+      +------------------+
| TechnicianProfiles       |      |     Reviews      |
+--------------------------+      +------------------+
id (PK)                    |      id (PK)
userId (FK -> Users.id)----+      bookingId (FK)
bio                               customerId (FK -> Users.id)
experience                        technicianId (FK -> Users.id)
location                          rating
hourlyRate                        comment
verified                          createdAt
createdAt
updatedAt
        |
        |1
        |
        +------------------------+
        |                        |
        ▼                        ▼
+------------------+     +----------------------+
|    Services      |     |    Availability      |
+------------------+     +----------------------+
id (PK)                  id (PK)
technicianId (FK)         technicianId (FK)
categoryId (FK)           date
title                     startTime
description               endTime
price                     status
duration                  createdAt
createdAt                 updatedAt
updatedAt
        |
        |
        ▼
+----------------+
|   Categories   |
+----------------+
id (PK)
name (Unique)
icon
description
createdAt
updatedAt

Users (Customer)
       |
       |1
       |
       +--------------------------------+
                                        |
                                        ▼
                              +------------------+
                              |    Bookings      |
                              +------------------+
                              id (PK)
                              customerId (FK)
                              technicianId (FK)
                              serviceId (FK)
                              slotId (FK -> Availability.id)
                              address
                              note
                              totalPrice
                              status
                              createdAt
                              updatedAt
                                     |
                                     |1
                                     |
                                     ▼
                             +----------------+
                             |    Payments    |
                             +----------------+
                             id (PK)
                             bookingId (FK)
                             providerTransactionId
                             provider
                             paymentMethod
                             amount
                             currency
                             status
                             paidAt
                             createdAt
                             updatedAt





| Table                            | Relation    |
| -------------------------------- | ----------- |
| User → TechnicianProfile         | One to One  |
| TechnicianProfile → Service      | One to Many |
| TechnicianProfile → Availability | One to Many |
| Category → Service               | One to Many |
| Customer (User) → Booking        | One to Many |
| Technician (User) → Booking      | One to Many |
| Service → Booking                | One to Many |
| Availability → Booking           | One to One  |
| Booking → Payment                | One to One  |
| Booking → Review                 | One to One  |
| Customer (User) → Review         | One to Many |
| Technician (User) → Review       | One to Many |




Draft : 

 
                                   +----------------+
                                   |     Users      |
                                   +----------------+
                                   PK  id
                                       name
                                       email (Unique)
                                       password
                                       phone
                                       profileImage
                                       role
                                       status
                                       createdAt
                                       updatedAt
                                          │
                  ┌───────────────────────┼────────────────────────┐
                  │1                      │1                       │1
                  │                       │                        │
                  ▼                       ▼                        ▼
        +----------------------+   +------------------+   +----------------------+
        | TechnicianProfiles   |   |    Bookings      |   |      Reviews         |
        +----------------------+   +------------------+   +----------------------+
        PK id                     PK id                  PK id
        FK userId (Unique)        FK customerId          FK bookingId (Unique)
           bio                    FK technicianId        FK customerId
           experience             FK serviceId           FK technicianId
           location               FK slotId             rating
           hourlyRate             address               comment
           verified               note                  createdAt
           createdAt              totalPrice
           updatedAt              status
                 │                createdAt
           ┌─────┴─────┐          updatedAt
           │1          │1               │
           │           │                │1
           ▼           ▼                ▼
 +----------------+   +----------------------+    +------------------+
 |    Services    |   |    Availability      |    |     Payments     |
 +----------------+   +----------------------+    +------------------+
 PK id                PK id                     PK id
 FK technicianId      FK technicianId          FK bookingId (Unique)
 FK categoryId        date                     providerTransactionId
    title             startTime                provider
    description       endTime                  paymentMethod
    price             status                   amount
    duration          createdAt                currency
    createdAt         updatedAt                status
    updatedAt                                   paidAt
          │                                      createdAt
          │                                      updatedAt
          │
          ▼
 +----------------+
 |   Categories   |
 +----------------+
 PK id
    name (Unique)
    icon
    description
    createdAt
    updatedAt



| Parent                            | Child | Relation |
| --------------------------------- | ----- | -------- |
| Users → TechnicianProfile         | 1 : 1 |          |
| Users (Technician) → Services     | 1 : N |          |
| Users (Technician) → Availability | 1 : N |          |
| Categories → Services             | 1 : N |          |
| Users (Customer) → Bookings       | 1 : N |          |
| Users (Technician) → Bookings     | 1 : N |          |
| Services → Bookings               | 1 : N |          |
| Availability → Bookings           | 1 : 1 |          |
| Bookings → Payments               | 1 : 1 |          |
| Bookings → Reviews                | 1 : 1 |          |
| Users (Customer) → Reviews        | 1 : N |          |
| Users (Technician) → Reviews      | 1 : N |          |



                                            ┌──────────────────────────┐
                                            │          USERS           │
                                            ├──────────────────────────┤
                                            │ PK  id (UUID)            │
                                            │ name                     │
                                            │ email (Unique)           │
                                            │ password                 │
                                            │ phone                    │
                                            │ profileImage             │
                                            │ role                     │
                                            │ status                   │
                                            │ createdAt                │
                                            │ updatedAt                │
                                            └─────────────┬────────────┘
                                                          │
                         ┌────────────────────────────────┼────────────────────────────────┐
                         │                                │                                │
                     1 : 1│                            1 : N│                            1 : N│
                         ▼                                ▼                                ▼
        ┌─────────────────────────────┐      ┌─────────────────────────────┐    ┌─────────────────────────────┐
        │    TECHNICIAN_PROFILES      │      │          BOOKINGS           │    │          REVIEWS           │
        ├─────────────────────────────┤      ├─────────────────────────────┤    ├─────────────────────────────┤
        │ PK id                       │      │ PK id                       │    │ PK id                       │
        │ FK userId (Unique)          │      │ FK customerId → Users.id    │    │ FK bookingId (Unique)       │
        │ bio                         │      │ FK technicianId → Users.id  │    │ FK customerId → Users.id    │
        │ experience                  │      │ FK serviceId → Services.id  │    │ FK technicianId → Users.id  │
        │ location                    │      │ FK slotId → Availability.id │    │ rating                      │
        │ hourlyRate                  │      │ address                     │    │ comment                     │
        │ verified                    │      │ note                        │    │ createdAt                   │
        │ createdAt                   │      │ totalPrice                  │    │ updatedAt                   │
        │ updatedAt                   │      │ status                      │    └─────────────┬──────────────┘
        └──────────────┬──────────────┘      │ createdAt                   │                  │
                       │                     │ updatedAt                   │              1 : 1│
          ┌────────────┴────────────┐        └─────────────┬──────────────┘                  ▼
          │                         │                      │                     ┌─────────────────────────────┐
      1 : N│                     1 : N│                 1 : 1│                  │          PAYMENTS          │
          ▼                         ▼                      ▼                     ├─────────────────────────────┤
┌──────────────────────┐   ┌────────────────────────┐   ┌────────────────────┐ │ PK id                       │
│      SERVICES        │   │     AVAILABILITY       │   │                    │ │ FK bookingId (Unique)       │
├──────────────────────┤   ├────────────────────────┤   │                    │ │ transactionId               │
│ PK id                │   │ PK id                 │   │                    │ │ provider                    │
│ FK technicianId      │   │ FK technicianId       │   │                    │ │ paymentMethod               │
│ FK categoryId        │   │ date                  │   │                    │ │ amount                      │
│ title                │   │ startTime             │   │                    │ │ currency                    │
│ description          │   │ endTime               │   │                    │ │ status                      │
│ price                │   │ status                │   │                    │ │ paidAt                      │
│ duration             │   │ createdAt             │   │                    │ │ createdAt                   │
│ createdAt            │   │ updatedAt             │   │                    │ │ updatedAt                   │
│ updatedAt            │   └────────────────────────┘   │                    └─────────────────────────────┘
└─────────────┬────────┘                                │
              │                                         │
          N : 1│                                        │
              ▼                                         │
      ┌────────────────────────┐                        │
      │      CATEGORIES        │                        │
      ├────────────────────────┤                        │
      │ PK id                  │                        │
      │ name (Unique)          │                        │
      │ icon                   │                        │
      │ description            │                        │
      │ createdAt              │                        │
      │ updatedAt              │                        │
      └────────────────────────┘

prisma/
│── schema.prisma
│── enums.prisma
│── user.prisma
│── technicianProfile.prisma
│── category.prisma
│── service.prisma
│── availability.prisma
│── booking.prisma
│── payment.prisma
│── review.prisma




*/