# Week 01 Reflection

**1. Include a link to one of your Pull Requests (PRs) at GitHub. (It should be merged and closed at this point.)**

GitHub Pull Request Link: https://github.com/DaoLordLectrik/cse341-books/pull/5

**2. Include a link to one of your Issues at GitHub. (It should be closed at this point.)**

GitHub Issue Link: https://github.com/DaoLordLectrik/cse341-books/issues/4

**3. Which issue took more or less time than expected? Why?**

Answer: One task that took longer than expected was connecting linking mongodb to launch locally. It failed to start locally after following all instruction outlined. This error was returned when `npm run dev` was run;  
`Database connection failed: querySrv ECONNREFUSED _mongodb._tcp.books-cluster.uefcyra.mongodb.net`

I found that Node was sending its DNS queries to my machine, where nothing answered them so every lookup got ECONNREFUSED

The solution was to tell node to use public DNS servers instead. src/db/connect.js now calls dns.setServers(...) only when a DNS_SERVERS variable is set and my local .env sets DNS_SERVERS=8.8.8.8,1.1.1.1. Because the setting lives in .env, it applies only on my computer and render which has working DNS and no such variable is unaffected

**4. Include a link to your walk-though video. (It must include your name, show your web service working at Render, explain the way your `Get Single Book` controller works, and discuss status codes.):**

Video link: https://www.loom.com/share/278e5b1eb3994ad8a1c514cdbb9cf54f

**5.a. Include a GitHub link to a file that shows how your app uses sensitive data, such as the MongoDB connection string.**

GitHub link: https://github.com/DaoLordLectrik/cse341-books/blob/main/src/db/connect.js is where the connection string is read. Open it on GitHub first to confirm it’s on main

**5.b. How did you store sensitive data? Why is that approach important?**

Answer: Sensitive data were stored in .env file. Since the repo will be hosted publicly, sensitive data was to be stored locally so those data does not leak for malicious use

**6.a. Include a GitHub link to a file that shows one other implementation decision you made.**

GitHub link: https://github.com/DaoLordLectrik/cse341-books/blob/main/src/router.js

**6.b. What decision does this file show, and why did you make that choice?**

Answer: This file maps incoming requests to the functions that handle them. It matches each web address to the function that handles it and the other files do the actual work

**7. What is one specific habit or process you will work on for next week?**

Answer: I will effectively use the pull request feature to better track updates especially whiles working with a team