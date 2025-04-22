---
title: Tasks and Jobs
description: A guide in my new Starlight docs site.
---

Harpia allows you to run background tasks and schedule recurring jobs using the `cron` library. These tasks live in the `app/tasks` directory and can be created quickly using the scaffold command:

```bash
bun g
```

## Creating and Registering a Task

Each task is defined in its own file as a CronJob instance. Here's an example of a task that runs every minute:

**app/tasks/FirstTask.ts**
```typescript
import { CronJob } from "cron";

function Task() {
  console.log("Task executed at:", new Date().toISOString());
}

export const FirstTask = new CronJob(
  "* * * * *", // every minute
  Task,
  null,
  false, // don't start automatically
  "UTC"
);
```

To register and start your tasks, use the TaskManager class defined in `app/tasks/index.ts`:

```typescript
import type { CronJob } from "cron";
import { FirstTask } from "./FirstTask";

class TaskManager {
  private jobs: CronJob[];

  constructor() {
    this.jobs = [FirstTask];
  }

  public run() {
    for (const job of this.jobs) {
      job.start();
    }
  }
}

export const Tasks = new TaskManager();
```

## Enabling the Task Runner

Tasks won’t run by default. You need to explicitly enable them in your application’s entry point. In `start/server.ts`, uncomment the line that runs the task manager:

```typescript
import harpia from "harpiats";
import routes from "./routes";

import { monitor } from "app/middlewares/monitor";
import { shield } from "app/middlewares/shield";
import { Observer } from "app/observers";
// import { Tasks } from "app/tasks";

const port = Number(process.env.PORT) || 3000;

export const app = harpia();

app.cors();
app.setNotFound((req, res) => res.status(404).json({ message: "Not Found" }));
app.use(shield());
app.use(monitor);
app.routes(routes);

app.listen(
  {
    port,
    development: true,
    reusePort: false,
    hostname: "localhost",
  },
  () => {
    console.log("Server is running at http://localhost:3000/");

    // Start scheduled tasks
    // Tasks.run();

    // Observer
    Observer.run();
  },
);
```

Now, whenever your application starts, your registered tasks will also be scheduled and executed accordingly.