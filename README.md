# 426-project-jandj
### Team name: jandj

### Team Roster

| Email                | GitHub Username |
| :------------------- | :-------------- |
| jkaros@umass.edu.com | sh34v3          |
| jjpark@umass.edu     | rainwater75     |

### Domain Review

The state of Massachusetts very recently passed the Tenant Opportunity to Purchase Act (TOPA). When a landlord decides to sell a multi-family rental building, the tenants living there are given the first opportunity to buy it before it can be sold to an outside private developer or investor. Furthermore Tenants are allowed to pass their "right of first refusal" (RFR) to a local housing authority, a land trust, or an affordable housing non-profit (the assignee). The asignee then buys the building and keeps the current tenants in place.

While this is certainly beneficial for tenants, it's very difficult to approach the process of passing RFR to an assignee.

TOPA laws operate on incredibly tight legal deadlines. In most jurisdictions, when a landlord announces an intent to sell, tenants usually have a narrow window (often just 30 to 45 days) to legally form a tenant association, vote, and file an official "Statement of Interest."

If they decide to assign their rights, the assignee has a limited timeframe (frequently 60 to 90 days) to match the outside buyer's appraisal, secure funding, and close the deal. Real estate transactions involving non-profits or public funds rarely move that fast, and missing a deadline by even one day forfeits the tenants' rights entirely.

To exercise or assign TOPA rights, a solid majority of households in the building must actively cooperate. Getting dozens—or hundreds—of neighbors to agree on a single path forward is a massive community-organizing challenge.

JandJ proposes a web application that allows Tenants to quickly organize their tenant association, communicate, vote, and file a statement of interest, while also helping match a group of tenants appropriate asignees. This application could help tenants overcome the logistic challenges of asserting their TOPA rights and more easily preserve their place of residence.

### Scalability

Because the process of TOPA matching involves many separate users making requests in a very concentrated amount of time, there is a high likelihood of traffic spikes. The moment a landlord issues a Notice of Intent to Sell, all the residents (potentially hundreds) will try to log on, join the specific building’s portal, upload and download documents, etc. A single server might not have the capacity to handle the sheer volume of requests and memory that each need to be scanned and processed. Additionally the server will need to run a matching algorithm involving all this data which will further increase the load. Lastly, the server cannot afford to fail with these tight deadlines as a restriction. 


### [C4CG](https://www.umass.edu/gateway/article/computing-common-good)

> “C4CG is about integrating values into your work, research, and education. ...It’s about education and research, the two pillars of any college that are going to make lives better not only for the citizens of Massachusetts, but also for the world"
> Haas says there are three prongs to C4CG: education; research to improve computer technology, making it better and safer for all; and research to apply that technology or technologies in general to do some good in the world.

In the context our C4CG, the TOPA matching project hits mostly on the third tenant of C4CG: "doing some good in the world". We're seeking to create a tool to aid citizens of Massachusets who're under threat of being displaced by movements in the real estate economy, [a population who typically are not well represented in government](https://nlihc.org/resource/study-finds-renters-are-highly-underrepresented-all-levels-government). A tool that aids tenants in asserting TOPA rights and connecting them with an assignee helps them get that representation and protect their employment, connections to their community, and standard of living.
