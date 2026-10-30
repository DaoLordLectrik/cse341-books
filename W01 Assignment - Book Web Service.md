# W01 Assignment: Books Web Service

<https://github.com/DaoLordLectrik/cse341-books>

## Pull Request

<https://github.com/DaoLordLectrik/cse341-books/issues?q=is%3Aissue>

## Issues 1-3: check that they closed

Merging a pull request that says Closes \#N should close the issue automatically. Open https://github.com/DaoLordLectrik/cse341-books/issues?q=is%3Aissue and look for three closed issues, each linked to its merged pull request (you will see "Closed by \#X" on the issue).

If one is still open, the usual causes are:

- The pull request description did not include Closes \#N. The closing keyword has to be in the description or a commit message, and it has to be spelled correctly.

- The pull request was merged into a branch other than main.

To fix it, close the issue manually and add a comment linking the merged pull request

## Issue 4: close it by hand

It has no pull request, so nothing closes it automatically. After you have tested the live URL:

1. Add a comment with your deployed URL and a short note of what you tested (the /books, /books/b1 and not-found requests and their results).

2. Click **Close issue**.

## Check the final state

- The Issues page shows four closed issues and none open.

- The Pull requests page shows three merged pull requests.

- Your local repo is on main, clean, with git branch listing only main.

## Walk-through Video

<https://www.loom.com/share/278e5b1eb3994ad8a1c514cdbb9cf54f>

## Time-spent reflection

One task that took longer than expected was connecting linking mongodb to launch locally. It failed to start locally after following all instruction outlined. This error was returned when **npm run dev** was run;  
*Database connection failed: querySrv ECONNREFUSED \_mongodb.\_tcp.books-cluster.uefcyra.mongodb.net*

I found that Node was sending its DNS queries to my machine, where nothing answered them so every lookup got *ECONNREFUSED*

The solution was to tell node to use public DNS servers instead. *src/db/connect.js* now calls dns.setServers(...) only when a DNS_SERVERS variable is set and my local .env sets *DNS_SERVERS=8.8.8.8,1.1.1.1*. Because the setting lives in .env, it applies only on my computer and render which has working DNS and no such variable is unaffected