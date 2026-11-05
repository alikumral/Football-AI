# Football AI — Coach Data Entry

Free pilot deployment using:

- GitHub Pages for the static web application
- Supabase Free for authentication and PostgreSQL storage
- PostgreSQL Row Level Security (RLS) for team isolation

Coaches only need the published URL, email, and password. They do not install Node.js, npm, VS Code, or any other software.

## 1. Create the Supabase project

1. Open [Supabase Dashboard](https://supabase.com/dashboard) and create a Free project.
2. Open **SQL Editor**.
3. Copy and run the complete contents of [`supabase/setup.sql`](supabase/setup.sql).
4. Confirm that these tables exist in **Table Editor**:
   - `teams`
   - `team_members`
   - `players`
   - `drafts`

Do not disable the RLS policies created by the script.

## 2. Create the coach account

1. In Supabase open **Authentication → Users**.
2. Choose **Add user** and create the coach's email/password account.
3. Open [`supabase/add-coach.sql`](supabase/add-coach.sql).
4. Change these three values near the top:

```sql
coach_email := 'coach@example.com';
coach_name := 'Coach Name';
requested_team_name := 'Team Name';
```

5. Run the edited script in **SQL Editor**.

Run `add-coach.sql` again for additional coaches. Use the same team name to give them access to the same roster.

## 3. Connect the website to Supabase

1. In Supabase open **Project Settings → API Keys**.
2. Copy the project URL and the **publishable** key.
3. Edit [`frontend/public/config.js`](frontend/public/config.js):

```js
window.APP_CONFIG = {
  supabaseUrl: 'https://YOUR_PROJECT_REF.supabase.co',
  supabasePublishableKey: 'YOUR_PUBLISHABLE_KEY',
};
```

The publishable key is expected to be visible in browser code. Never put a Supabase secret key or `service_role` key in this repository.

## 4. Publish with GitHub Pages

Create a **public** GitHub repository and push this project to its `main` branch. Public repositories can use GitHub Pages on GitHub Free. Then:

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, select **GitHub Actions**.
4. Open the **Actions** tab and wait for `Deploy Football AI to GitHub Pages` to finish.
5. The deployed URL will look like:

```text
https://YOUR_GITHUB_USERNAME.github.io/YOUR_REPOSITORY/
```

Every push to `main` automatically publishes the latest version.

## 5. Send to the coach

Send only:

- the GitHub Pages URL
- the email created in Supabase Auth
- the password created for that account

The coach opens the link, signs in, and enters players. Data is written to the Supabase `players` and `drafts` tables.

## Local preview (optional, developer only)

After configuring Supabase:

Use VS Code's Live Server extension on `frontend/public/index.html`, or run any static HTTP server against `frontend/public`.

Open `http://localhost:8080`. Opening `index.html` directly as a local file is not recommended.

## Security model

- Signed-out visitors have no database permissions.
- Authenticated users can only access records belonging to their assigned team.
- Team IDs are resolved inside PostgreSQL, not trusted from browser input.
- Player submission and draft removal happen in one database function.
- The browser never receives a secret/service key.

This architecture is appropriate for a small free pilot. Supabase Free projects may pause after inactivity and do not include production-grade backups.
