---
name: question-resolve
description: >
  Mark an open question in the team's discussion log as resolved. Use whenever
  the user wants to close out an open question — e.g. "mark Q-042 resolved",
  "we figured out Q-007", "close Q-015", "we have an answer for Q-003", or
  invokes "/question-resolve". Works both when resolution comes from a new
  discussion entry and when it's a standalone answer with no new log entry.
---

# Question Resolve

Close out an open question in `discussions/QUESTIONS.md`, recording what was
decided, why, and which discussion (if any) contains the full context.

## Workflow

1. **Find the question.** Read `discussions/QUESTIONS.md` and locate the entry
   by Q-ID. If the ID doesn't exist, say so clearly. If it's already
   `Status: resolved`, tell the user and show the existing resolution — don't
   overwrite it.

2. **Get the resolution.** Ask the user (or extract from context if they already
   provided it):
   - **Answer:** what was decided — one sentence.
   - **Why:** the rationale or constraint that drove it — 1–2 sentences. This is
     the part that matters months later; don't skip it.
   - **Source discussion (optional):** a discussion slug if the answer came out of
     a logged discussion. The user can name it, or you can check whether they just
     ran `/discussion-log` and a fresh entry exists. If no discussion entry
     captures it, the resolution is standalone.

3. **Update `QUESTIONS.md`.** Edit the question's entry in place:
   - Change `Status: open` → `Status: resolved`
   - Replace `Resolution: —` with:
     ```
     - **Resolved:** YYYY-MM-DD | [<slug>](log/<slug>.md)
     - **Answer:** <answer sentence>. <why sentence(s)>.
     ```
     If standalone (no discussion entry), use `Resolved: YYYY-MM-DD | standalone`
     instead of a link.

4. **Update the source discussion entry (if applicable).** If the resolution came
   from a specific discussion entry, open `discussions/log/<slug>.md` and add a
   note in its "Open questions / follow-ups" section next to the relevant item:
   `- Q-042: <question text> *(resolved — see QUESTIONS.md)*`

5. **Report back.** Show:
   - The question text and its ID
   - The answer recorded
   - Which files were touched
   - Whether any related questions in QUESTIONS.md share the same areas and are
     still open (a nudge — don't resolve them automatically)

## Examples

**Example 1 — resolution from a new discussion**
User: "Mark Q-001 resolved — we decided to use zero-rated VAT for EU digital goods.
We discussed it in the entry we just logged, 2026-07-01-eu-vat-strategy."
Action: update Q-001 in QUESTIONS.md (resolved, linked to 2026-07-01-eu-vat-strategy),
update that discussion entry to note the question is resolved. Report both files touched.

**Example 2 — standalone resolution**
User: "Close Q-007 — we're not doing offline sync this quarter, pushed to Q3."
Action: update Q-007 (resolved, standalone), record the answer + reason (deprioritized
for Q3). No discussion entry to update. Report QUESTIONS.md touched.

**Example 3 — question not found**
User: "Resolve Q-099"
Action: Q-099 doesn't exist in QUESTIONS.md. Respond: "Q-099 wasn't found in
discussions/QUESTIONS.md. Check the ID — open questions are listed there."

**Example 4 — already resolved**
User: "Mark Q-002 resolved"
Action: Q-002 is already resolved. Respond: "Q-002 is already resolved (2026-06-24):
<existing answer>. No changes made."
