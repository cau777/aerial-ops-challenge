[![Testing](https://github.com/cau777/aerial-ops-challenge/actions/workflows/testing.yml/badge.svg)](https://github.com/cau777/aerial-ops-challenge/actions/workflows/testing.yml)

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
- [X] A jest tests with a badge on the README to indicate status

## Application design
#### File structure
It's structured in a modular way. More details [here](https://github.com/cau777/aerial-ops-challenge/blob/main/docs/file-structure.md).

#### Why each procedure is implemented in a different file
For each procedure (like msg.add), there's a file containing its handler and type definitions, and one containing tests.
You might notice that handler functions have no dependencies on global objects, like database connections or env
variables. Instead, these dependencies are supplied as parameters. This dependency injection principle greatly facilitates testing.

#### How new messages are handled
The most popular approach to handling incoming data is to use a technology that allows for persistent connections
(like WebSockets or ServerSentEvents). They tend to minimize data transfer between the client and the server. However,
I decided to use the default refetch behaviour of react-query, as bringing a new communication protocol would add too much
complexity (we already have HTTP and tRPC).

#### How image upload works
When the client sends a request to the server, it can specify an 'image' object with information about the image
it will attach to the message. Currently, the only field in this object is the image extension but we may add more metadata in the future, like
dimensions or location. So, if the client wants to upload an image, the server responds with a pre-signed S3 url (with
privilege to upload a file with the exact name the server generated for a limited time). The client then sends a request to that url
with the file's bytes (no dependency on S3 SDK).

#### Test coverage
Currently, tests cover the basic behaviour of the 3 server procedures. They rely on a local MongoDb instance and
a separate S3 storage bucket. It would be beneficial to implement some tests for the client and some E2E tests.

#### Icons
Icons are provided as functional components from [heroicons](https://heroicons.com/).

## The tech stack
- tRPC for client-api communication
- Typescript for type-checking
- Zod for schema validation
- NextJS for routes
- MongoDB to store messages
- AWS S3 to store images
- Jest for tests
- pnpm for dependency management
- Tailwind for styles

## Possible improvements
* The app is vulnerable to Denial Of Service attacks because there's nothing preventing a malicious client from sending
millions of request per second. This would overload the server and quickly exhaust external API resources. A solution
is to implement rate limiting, but that's more challenging in a non-authenticated environment.
* Even if the Chatroom is not authenticated, it would be nice if user could choose a username to identify each
other in the global Chatroom.
* We could implement a AWS Lambda function that triggers after an image is uploaded and handles compression and 
conversion (preferably to webp).
* A better way to handle incoming messages. Right now, new messages are displayed immediately after they arrive.
This can somewhat disorienting for the user if they are browsing older messages. 
* Option for a dark theme.