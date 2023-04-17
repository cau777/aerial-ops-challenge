# File Structure
It follows the basic structure of the [tRPC docs](https://trpc.io/docs/nextjs/setup#recommended-file-structure),
as well as recommendations of [this article about a modular file structure](https://dev.to/vadorequest/a-2021-guide-about-structuring-your-next-js-project-in-a-flexible-and-efficient-way-472).
```
├── docs
├── src
│   ├── modules
│   │   ├── chatroom  # <-- each module can be a mojor feature or a page
│   │   │   ├── components
│   │   │   ├── utils
│   │   │   ├── hooks
│   │   │   └── [..]
│   │   └── [..]
│   ├── pages
│   │   ├── api
│   │   │   └── trpc
│   │   │       └── [trpc].ts  # <-- tRPC HTTP handler
│   │   └── [..]  # <-- other pages
│   ├── server
│   │   ├── models
│   │   │   ├── message.model.ts  # <-- zod and type definitions for Message database type
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
Even tough this system is more complicated and adds more folders, it has many advantages. Modules help group together 
code that is related to each other and make it easier to scale and add features. Also, it avoids a single massive
components folder, which is hard to manage.
For example, if we were to add a new system for communities, we would:
* add a new page in src/pages
* create a new router in src/server/routers
* implement new procedures and tests in src/server/community
* place components in src/modules/community/components.

We wouldn't need to touch anything related to the chatroom.