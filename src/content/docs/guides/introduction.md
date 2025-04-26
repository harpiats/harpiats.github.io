---
title: Introduction
description: A guide in my new Starlight docs site.
---

Harpia is an opinionated framework designed specifically for the Bun runtime environment. It provides a modern, full-featured solution for building robust and scalable web applications with simplicity and high performance in mind.

At the heart of the framework lies the Harpia Core, an independent, non-opinionated foundation that can be used separately for custom applications. The full Harpia framework builds on top of this core, offering a rich toolset for productivity and rapid development.

One of Harpia’s key design principles is modular architecture. Instead of grouping files by type (like having a global controllers/ or services/ folder), Harpia organizes your application by feature. Each functionality or domain entity lives inside its own module, under the modules/ directory. A typical module includes its own route, controllers, services, repositories, validations, and tests — making it self-contained, easy to navigate, and simple to scale.

Read more [about the modules](/guides/modules).

> Pronunciation note: Harpia is pronounced /ˈhɑː.pi.ə/ (HAR-pee-uh), inspired by the Brazilian harpy eagle — one of the largest and most powerful birds of prey in the world.

## Core Features

The Harpia Core provides essential features for building web applications:
- **Routing and Middlewares:** Define routes and plug in middleware functions to handle requests and responses.
- **Session, Cache, and Cookie Management:** Manage user sessions, cache data, and interact with cookies.
- **Custom Template Engine:** Render dynamic pages using the built-in template engine.
- **Method Override and CORS:** Support for overriding HTTP methods and configuring CORS policies.
- **Shield:** Similar to Helmet, this feature helps protect your app by setting secure HTTP headers.
- **File Uploads:** Handle file uploads with ease.
- **Test Client:** Built-in testing utilities similar to Supertest.
- **Metrics Collection and Analysis:** Monitor requests, errors, response times, and more.

## Full Framework Features

When using the complete Harpia Framework, you also gain access to:
- **Scaffold:** Quickly generate standard code and components.
- **Model Observers:** React to lifecycle events in your models.
- **Mailer:** Send emails with integrated support.
- **Tasks and Cronjobs:** Easily schedule and manage recurring tasks.