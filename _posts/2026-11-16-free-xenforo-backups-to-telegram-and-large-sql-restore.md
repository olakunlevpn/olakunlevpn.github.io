---
layout: post
title:  "Free XenForo backups to Telegram and the missing restore button"
date:   2026-11-16 12:00:00 +0100
tags: XenForo PHP DevOps Backups DisasterRecovery
---

Most forum admins discover their backups don't work when their server is already on fire.

You set up a forum. It grows. Discussions pile up, attachments multiply, and your database dump hits four gigabytes. At that point, off-site storage starts costing real money. Paying $20 to $50 a month for S3 or Backblaze adds up fast on a passion project. So people start cutting corners. They dump the database to the local disk and tell themselves they'll copy it off tomorrow. Then an SSD dies or a host terminates the instance, and five years of community history disappears.

I wanted an off-site backup pipeline that costs zero dollars, runs on autopilot, and doesn't fall over when the database grows. So I built three open-source tools for XenForo 2.3+ that handle the whole disaster recovery loop: automated encrypted backups, Tor hidden service protection, and a browser tool that restores multi-gigabyte dumps when everything else is down.

### 1. Telegram as Free Off-Site Cloud Storage

Telegram channels give you unlimited cloud storage and there's no monthly bill. The catch is getting big files across without blowing up your server.

If you try to upload a three-gigabyte database dump through standard PHP scripts, two walls stop you cold. First, PHP runs out of RAM trying to buffer the file. Second, Telegram's public bot API rejects anything over 50 MB.

[Olakunlevpn Telegram Free Cloud Backup](https://github.com/olakunlevpn/olakunlevpn-telegram-free-cloud-backup) gets around both limits using streaming pipes. It splits database dumps and file archives into 45 MB parts directly on disk, so PHP doesn't run out of memory. Each chunk gets encrypted on your server with client-side AES-256-CBC and PBKDF2 key derivation before it leaves your machine. Telegram only ever sees encrypted binary blobs. Without your passphrase, nobody can read your user hashes or private messages.

If you're running the official open-source local Bot API server on your box, the add-on switches to raw sockets and uploads 2 GB archives in single shots.

It also works both ways. You don't have to log into XenForo Admin CP to run a backup. Send `/backup database` to your bot from your phone while waiting in line for coffee, and the add-on queues the job, runs the dump, and posts the parts back to your private channel. When backups expire, automated cron tasks prune old messages from Telegram so your channel stays organized.

- GitHub: [olakunlevpn-telegram-free-cloud-backup](https://github.com/olakunlevpn/olakunlevpn-telegram-free-cloud-backup)
- XenForo Resource: [Download Resource 11018](https://xenforo.com/community/resources/olakunlevpn-telegram-free-cloud-backup.11018/)

### 2. Protecting Tor Hidden Service Keys

Forums running onion mirrors have another failure point that standard backups don't touch: the Tor private keys.

Your `.onion` domain isn't an entry in a DNS registrar. It's a cryptographic hash of your public key. The private keys live in `/var/lib/tor/hidden_service/`, owned by root or the tor daemon. Because web applications run under unprivileged users like `www-data`, normal XenForo backup tools can't touch that directory.

If your VPS goes down and you lose those keys, your `.onion` address is dead permanently. You can't contact Tor support to get it back. Your links break, your members lose access, and whatever reputation you built vanishes overnight.

[Olakunlevpn Telegram Backup - Tor Extension](https://github.com/olakunlevpn/olakunlevpn-telegram-backup-tor-extension) is a companion add-on that bridges this gap. It talks to your sudoers helper, packages the hidden service directory into an encrypted tarball, and streams it to your Telegram vault so you don't lose your domain.

When the upload finishes, the bot sends you a message with the shell commands you'll need to restore file ownership:

```bash
systemctl stop tor
tar -xzvf tor_backup_keys.tar.gz -C /
chown -R debian-tor:debian-tor /var/lib/tor/hidden_service/
chmod 700 /var/lib/tor/hidden_service/
chmod 600 /var/lib/tor/hidden_service/*
systemctl start tor
```

If disaster strikes, you spin up a fresh box, run those six lines, and you're back online.

- GitHub: [olakunlevpn-telegram-backup-tor-extension](https://github.com/olakunlevpn/olakunlevpn-telegram-backup-tor-extension)
- XenForo Resource: [Download Resource 11019](https://xenforo.com/community/resources/olakunlevpn-telegram-backup-tor-extension.11019/)

### 3. The Restore Problem and Large SQL Importer

Here's the awkward truth about backups: creating them is only half the battle. Restoring them during a crisis is where things fall apart.

Imagine your database crashes. All tables are gone. You can't log into XenForo Admin CP because XenForo can't boot without its database. You open phpMyAdmin, upload your two-gigabyte `.sql` dump, and hit 504 Gateway Timeout after sixty seconds.

Even worse, if your backup came from Telegram, you're looking at ten split `.enc` chunks on your hard drive. Unless you're comfortable stitching binary files and running OpenSSL decryption in a terminal, you're stuck while your forum shows a database error to visitors.

[XenForo Large SQL Importer](https://github.com/olakunlevpn/xenforo-large-sql-importer) is a standalone companion script that lives at `install/large-sql-importer.php`. It doesn't need XenForo running, and it doesn't need an existing database schema.

First, there's a browser-based Chunk Merger and Decryptor. Upload your `.part01` and `.enc` files through the web interface, type your encryption passphrase, and the script stitches the pieces and decrypts the dump right on your server.

Second, it imports giant SQL files without timing out. The parser streams the file in 4 MB buffers, executing statements line by line so execution limits won't kill the process. Memory stays under 16 MB. It reads compressed `.sql.gz` files on the fly without making you decompress tens of gigabytes to disk first. If your connection drops halfway through, it writes byte progress to a JSON state file so you can hit resume and pick up where it stopped.

Third, there's a built-in database configuration tool. If you had to set up a new MySQL user or change database passwords during a migration, you can test the connection and save credentials straight into `src/config.php` without fighting text editor permissions.

Once the forum is back up and verified, delete the script from your `install/` directory so nobody else can touch what's left behind.

- GitHub: [xenforo-large-sql-importer](https://github.com/olakunlevpn/xenforo-large-sql-importer)
- Standalone PHP script: [large-sql-importer](https://github.com/olakunlevpn/large-sql-importer)

### Running the Whole Pipeline

A reliable disaster recovery setup shouldn't require a five-figure infrastructure budget or three hours of panic when a hard drive fails.

Set up the Telegram backup add-on, paste your bot token and chat ID, set an AES-256 passphrase, and let the cron handle daily dumps. If you run an onion service, install the Tor companion so your keys won't disappear on a server crash. And keep a copy of `large-sql-importer.php` in your toolkit.

When something breaks, you won't need to scramble. Download your chunks from Telegram, merge them in the browser, stream them back into MySQL, and get your forum back on its feet.
