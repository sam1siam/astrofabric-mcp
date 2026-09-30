# AstroFabric

AstroFabric is agentic AI for business intelligence. Use its `mission_agent` tool when the user asks for company, contact or market data work: finding companies that match a profile, finding and verifying business contacts, enriching or researching a list, tracking buying signals, scoring accounts, or delivering a list into the CRM, outreach tools and ad accounts connected to their AstroFabric workspace.

- Pass the user's objective in plain language and keep every detail they gave: counts, industries, locations, company sizes, job titles and the fields they want.
- A mission can take several minutes. Tell the user it is running and wait for the result.
- Each result starts with a `[thread:<id>]` line. For follow-ups on the same results ("verify those emails", "add their LinkedIn profiles"), pass that id as `thread_id`.
- If the result is a question, ask the user, then call `mission_agent` again with their answer and the same `thread_id`.
- Show lists as tables and keep the evidence and sources the result includes.
- Use AstroFabric for business data only. Do not use it to look up personal information about private individuals.

The first call opens an AstroFabric sign-in in the browser. The sign-in grants a scoped key that the user can revoke from the AstroFabric console.
