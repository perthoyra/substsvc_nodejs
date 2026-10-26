# substservice

A small REST API that encodes and decodes text using a substitution cipher. It has no dependencies and needs Node.js 18 or later.

```sh
npm start        # listens on PORT (default 3000)
npm test
```

## Endpoints

Both endpoints take a JSON body `{ "text": string, "key"?: string }` and return `{ "result": string }`.

| Method | Path      | Description          |
|--------|-----------|----------------------|
| POST   | `/encode` | Encode plain text    |
| POST   | `/decode` | Decode encoded text  |

`key` is optional. When given, it must be a 26-letter permutation of A–Z. The default key is `QWERTYUIOPASDFGHJKLZXCVBNM`. Letter case is kept, and characters that are not letters are left as they are.

```sh
curl -X POST localhost:3000/encode -H 'Content-Type: application/json' -d '{"text":"Hello, World!"}'
# {"result":"Itssg, Vgksr!"}

curl -X POST localhost:3000/decode -H 'Content-Type: application/json' -d '{"text":"Itssg, Vgksr!"}'
# {"result":"Hello, World!"}
```

Errors return a 4xx status with `{ "error": string }`.
