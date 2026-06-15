# Quiz optimization system

## Setting up

### Running supabase local environment (optional)

if you want to opt out from creating a project on supabase, follow this

**Prerequisites**
- [supabase cli](https://supabase.com/docs/guides/local-development/cli/getting-started)
- docker (with [wsl2 backend](https://docs.docker.com/desktop/features/wsl) on windows)

```bash
supabase start # start supabase stack locally
```

### Running dev server

```bash
git clone https://github.com/libresoul/quiz-optimization-system.git
cp .env.example .env.local # set your envs here
bun dev # or npm run dev
```

