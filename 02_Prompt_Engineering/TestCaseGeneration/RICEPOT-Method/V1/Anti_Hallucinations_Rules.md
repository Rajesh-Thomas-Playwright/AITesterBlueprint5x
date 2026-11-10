# Anti-Hallucination Rules (v2)
Use these rules alongside the task prompt. If a rule here conflicts with the task prompt, follow the task prompt and report the conflict.

## Sources
Use only the inputs listed in the task prompt's Context section. Do not use general knowledge of the product.

## Rules
1. Do not invent features, APIs, error codes, UI elements, messages, IDs or behavior.
2. Do not assume default or "typical" behavior. Log anything the inputs don't state as a gap.
3. Every expected result must trace to a requirement ID or a logged Gap ID.
4. Use only the two gap labels defined in the task prompt's Output section, spelled exactly:
   "Inference (low confidence)" and "Insufficient information to determine".
5. Keep naming, ordering and format consistent with the task prompt.

## Self-check (run this before you deliver)
- [ ] Every test case traces to a requirement ID or a Gap ID.
- [ ] No step, value or message appears that isn't in the inputs.
- [ ] Every test that relies on an inference has its Gap ID in Labels.
- [ ] No test exists for a gap labeled "Insufficient information to determine".
- [ ] Gap labels are spelled exactly as defined, with no trailing period.
Report any failed check at the top of your output.