# Aerial Ops Challenge
This is a simple non-authenticated chat room, built to meet the following requirements.
- [X] Anyone can enter a message into the single (global) room
- [X] You can optionally upload an image; if you do it is attached to the message and always displayed
- [X] Anyone can delete any message by clicking the delete icon; hovering your mouse over a message will make a delete icon appear
- [X] Messages are displayed with their timestamp
- [X] Messages can be sorted by either their creation time or the message, ascending or descending
- [X] Cursor-based pagination
- [X] ADD and DELETE procedures have optimistic updates
- [X] Good loading and error experience

## The tech stack
- tRPC for client-api communication
- Typescript for type-checking
- Zod for schema validation
- NextJS for routes
- MongoDB to store the messages
- AWS S3 to store the images
- Jest for tests
- pnpm for dependency management
- Tailwind for CSS

## Application design
#### File structure
It follows the basic structure of the [tRPC docs](https://trpc.io/docs/nextjs/setup#recommended-file-structure),
as well as recommendations of [this article about a modular file structure](https://dev.to/vadorequest/a-2021-guide-about-structuring-your-next-js-project-in-a-flexible-and-efficient-way-472)
```
├── src
│   ├── modules
│   │   ├── chatroom
│   │   │   ├── components
│   │   │   ├── utils
│   │   │   ├── hooks
│   │   │   └── [..]
│   │   └── [..]
│   ├── pages
│   │   ├── _app.tsx  # <-- withTRPC() and other HOCs
│   │   ├── api
│   │   │   └── trpc
│   │   │       └── [trpc].ts  # <-- tRPC HTTP handler
│   │   └── [..]
│   ├── server
│   │   ├── models
│   │   │   ├── message.model.ts  # <-- Zod and type definitions for Message database type
│   │   │   └── [..]
│   │   ├── msg
│   │   │   ├── add.ts  # <-- handler function for msg.route
│   │   │   ├── add.test.ts  # <-- tests for add.ts
│   │   │   └── [..]
│   │   ├── routers
│   │   │   ├── _app.ts  # <-- main app router
│   │   │   ├── msg.ts  # <-- messages sub router
│   │   │   └── [..]
│   │   ├── utils
│   │   │   ├── db.ts  # <-- MongoDB client
│   │   │   └── [..]
│   │   └── trpc.ts      # <-- procedure helpers
│   └── globals.css  # <-- Tailwind setup and a FEW global styles
```
Even tough this system is more complicated and adds more folders, it's easier to scale and add some features.
For example, if we were to add a system for communities, we would add a new page in src/pages, create a new router
in src/server/routers, place our new routes in src/server/community, and place components in src/modules/community/components.
We wouldn't need to touch anything related to the chatroom.

#### How new messages are handled
In regular intervals, the client queries the server for new messages. If the user is searching older messages, it doesn't
show them immediately as doing so would disorient the user.
websocket 
#### How image upload works
When the client sends a request to the server, it can specify an 'image' field with information about the image
it will upload. Currently, the only field is the image extension
#### Test coverage
Tests cover the basic behaviour of the 3 procedures.
Some E2E tests are necessary
rate limiter
dependency injection
## Missing features
* Usernames
* Dark theme