# Skill Registry — comercial-survey

Generated: 2026-04-06
Project: comercial-survey

## Project Convention Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | References AGENTS.md |
| `AGENTS.md` | Next.js version warning — read `node_modules/next/dist/docs/` before writing any code |

## User-Level Skills

| Skill | Path | Triggers |
|-------|------|---------|
| `nextjs-15` | `C:\Users\Daryhen\.claude\skills\nextjs-15\SKILL.md` | Working with Next.js — routing, Server Actions, data fetching |
| `react-19` | `C:\Users\Daryhen\.claude\skills\react-19\SKILL.md` | Writing React components — no useMemo/useCallback needed |
| `tailwind-4` | `C:\Users\Daryhen\.claude\skills\tailwind-4\SKILL.md` | Styling with Tailwind — cn(), theme variables, no var() in className |
| `typescript` | `C:\Users\Daryhen\.claude\skills\typescript\SKILL.md` | Writing TypeScript code — types, interfaces, generics |
| `zustand-5` | `C:\Users\Daryhen\.claude\skills\zustand-5\SKILL.md` | Managing React state with Zustand |
| `zod-4` | `C:\Users\Daryhen\.claude\skills\zod-4\SKILL.md` | Using Zod for validation — breaking changes from v3 |
| `playwright` | `C:\Users\Daryhen\.claude\skills\playwright\SKILL.md` | Writing E2E tests — Page Objects, selectors, MCP workflow |
| `ai-sdk-5` | `C:\Users\Daryhen\.claude\skills\ai-sdk-5\SKILL.md` | Building AI chat features — breaking changes from v4 |
| `github-pr` | `C:\Users\Daryhen\.claude\skills\github-pr\SKILL.md` | Creating PRs, writing PR descriptions, using gh CLI |
| `skill-creator` | `C:\Users\Daryhen\.claude\skills\skill-creator\SKILL.md` | Creating new AI agent skills, documenting patterns for AI |
| `go-testing` | `C:\Users\Daryhen\.claude\skills\go-testing\SKILL.md` | Writing Go tests, using teatest, adding test coverage |
| `django-drf` | `C:\Users\Daryhen\.claude\skills\django-drf\SKILL.md` | Building REST APIs with Django — ViewSets, Serializers, Filters |
| `jira-task` | `C:\Users\Daryhen\.claude\skills\jira-task\SKILL.md` | Creating Jira tasks, tickets, or issues |
| `jira-epic` | `C:\Users\Daryhen\.claude\skills\jira-epic\SKILL.md` | Creating epics, large features, or multi-task initiatives |
| `prisma-migrate` | `C:\Users\Daryhen\.claude\skills\prisma-migrate\SKILL.md` | Prisma schema migrations, applying changes, seeding DB |
| `pytest` | `C:\Users\Daryhen\.claude\skills\pytest\SKILL.md` | Writing Python tests — fixtures, mocking, markers |

## SDD Skills

| Skill | Path | Triggers |
|-------|------|---------|
| `sdd-init` | `C:\Users\Daryhen\.claude\skills\sdd-init\SKILL.md` | Initialize SDD in a project |
| `sdd-explore` | `C:\Users\Daryhen\.claude\skills\sdd-explore\SKILL.md` | Explore and investigate before committing to a change |
| `sdd-propose` | `C:\Users\Daryhen\.claude\skills\sdd-propose\SKILL.md` | Create a change proposal |
| `sdd-spec` | `C:\Users\Daryhen\.claude\skills\sdd-spec\SKILL.md` | Write delta specifications |
| `sdd-design` | `C:\Users\Daryhen\.claude\skills\sdd-design\SKILL.md` | Create technical design document |
| `sdd-tasks` | `C:\Users\Daryhen\.claude\skills\sdd-tasks\SKILL.md` | Break down a change into implementation tasks |
| `sdd-apply` | `C:\Users\Daryhen\.claude\skills\sdd-apply\SKILL.md` | Implement tasks from the change |
| `sdd-verify` | `C:\Users\Daryhen\.claude\skills\sdd-verify\SKILL.md` | Validate implementation matches specs |
| `sdd-archive` | `C:\Users\Daryhen\.claude\skills\sdd-archive\SKILL.md` | Sync delta specs and archive a completed change |

## Project-Level Skills

None detected.

## Skill Loading Instructions (for sub-agents)

1. Search engram first: `mem_search(query: "skill-registry", project: "comercial-survey")`
2. Fallback: read `C:\Proyects\comercial-survey\.atl\skill-registry.md`
3. Match your task context to the triggers in the table above
4. Read the full SKILL.md for matching skills before writing any code

## Key Warnings (from AGENTS.md)

- Next.js 16.2.2 is installed — this is NOT the version your training data knows
- Read `node_modules/next/dist/docs/` before writing any Next.js code
- Breaking changes in APIs, conventions, and file structure are expected
- Heed all deprecation notices
