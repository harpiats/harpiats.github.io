---
title: Mailer
description: A guide in my new Starlight docs site.
---

The Harpia Framework provides a simple Mailer class to handle email sending using `Nodemailer`. It's just a lightweight wrapper to centralize the transport configuration and make sending emails easier.

The mailer is located at `app/services/mailer/index.ts` and uses the config defined in `app/config/mailer.ts`.

**Structure**
```typescript
import { mailerConfig } from "app/config/mailer";
import nodemailer from "nodemailer";

import type { SendMailTypes } from "app/types/mailer";

export default class Mailer {
  private static mailer = nodemailer.createTransport(mailerConfig);

  static async sendMail(options: SendMailTypes) {
    const info = await Mailer.mailer.sendMail(options);
    return info;
  }
}
```

## Examples

### Sending plain text emails

You can send an email like this:

```typescript
import Mailer from "app/services/mailer";

await Mailer.sendMail({
  from: '"Harpia" <noreply@example.com>',
  to: "user@example.com",
  subject: "Hello!",
  text: "This is a test email.",
});
```

### Sending HTML emails with templates

You can also render an HTML template and send it in your email. Here's a basic example:

```typescript
import harpia from "harpiats";
import { html } from "app/config/template-engine";

const app = harpia();
html.configure(app);

app.post("/send-email", async (req, res) => {
  const data = {}; // your dynamic data
  const content = await html.renderTemplate("app/services/mailer/templates/account-created", { data });

  await Mailer.sendMail({
    from: '"Harpia" <noreply@example.com>',
    to: "user@example.com",
    subject: "Account Created",
    html: content,
  });

  res.send("Email sent");
});
```

> ℹ️ For more details about how the template engine works, including how to organize and render templates, [check the template engine documentation](/core/template-engine).

##### Configuration

The mail configuration lives in app/config/mailer.ts, and it usually pulls values from environment variables:

```typescript
import type { MailerConfigInterface } from "app/types/mailer";

export const mailerConfig: MailerConfigInterface = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Boolean(process.env.SMTP_SECURE),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
};
```


That’s it. No fancy abstractions—just a basic and centralized way to send emails when you need to.
