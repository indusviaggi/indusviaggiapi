todo:
amadeus
tests
backup

npm install aws-sdk multer multer-s3

```bash
    $ npm install
    $ npm run dev
```

# Deploying to Vercel
- This is a backend-only API project (no public directory).
- In the Vercel web dashboard, set the Output Directory to . (root) or leave it blank.
- No static frontend is generated.
- The API entry point is index.ts and is configured in vercel.json.
