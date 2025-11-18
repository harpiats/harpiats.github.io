---
title: Environment Variables
description: A guide in my new Starlight docs site.
---

The `.env` file contains environment-specific configurations. Below is an example of the required environment variables:

```txt
# Application
APP_ID=
MONITOR_SECRET=
ENV=development
PORT=3000
MODE=fullstack

# Database
# DB_PROVIDER=<YOUR_DB_USER>
# DB_USER=<YOUR_DB_USER>
# DB_PASS=<YOUR_DB_PASS>
# DB_PORT=<YOUR_DB_PORT>
# DB_NAME=<YOUR_DB_NAME>
# DB_HOST=<YOUR_DB_HOST>
# DB_URL=${DB_PROVIDER}://${DB_USER}:${DB_PASS}@${DB_HOST}:${DB_PORT}/${DB_NAME}

# Database SQLite
DB_URL="file:./dev.db"

# Redis
REDIS_HOST=localhost
REDIS_USER=
REDIS_PASS=
REDIS_PORT=6379

# Mailer
SMTP_HOST=<YOUR_SMTP_HOST>
SMTP_PORT=<YOUR_SMTP_PORT>
SMTP_USER=<YOUR_SMTP_USER>
SMTP_PASSWORD=<YOUR_SMTP_PASSWORD>
SMTP_SECURE=<IF_SHOULD_USE_SSL>

# Amazon S3
S3_KEY=<YOUR_S3_KEY>
S3_SECRET=<YOUR_S3_SECRET>
S3_BUCKET=<YOUR_S3_BUCKET>
S3_REGION=<YOUR_S3_REGION>
S3_ENDPOINT=https://s3.${S3_REGION}.amazonaws.com
S3_BUCKET_PATH=https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/
```