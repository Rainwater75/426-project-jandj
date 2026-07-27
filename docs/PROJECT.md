## docs/PROJECT.md

### Domain

The state of Massachusetts very recently passed the Tenant Opportunity to Purchase Act (TOPA). When a landlord decides to sell a multi-family rental building, the tenants living there are given the first opportunity to buy it before it can be sold to an outside private developer or investor. Furthermore, Tenants are allowed to pass their "right of first refusal" (RFR) to a local housing authority, a land trust, or an affordable housing non-profit (the assignee). The assignee then buys the building and keeps the current tenants in place.

While this is certainly beneficial for tenants, it's very difficult to approach the process of passing RFR to an assignee.

TOPA laws operate on incredibly tight legal deadlines. In most jurisdictions, when a landlord announces an intent to sell, tenants usually have a narrow window (often just 30 to 45 days) to legally form a tenant association, vote, and file an official "Statement of Interest."

If they decide to assign their rights, the assignee has a limited timeframe (frequently 60 to 90 days) to match the outside buyer's appraisal, secure funding, and close the deal. Real estate transactions involving non-profits or public funds rarely move that fast, and missing a deadline by even one day forfeits the tenants' rights entirely.

To exercise or assign TOPA rights, a solid majority of households in the building must actively cooperate. Getting dozens—or hundreds—of neighbors to agree on a single path forward is a massive community-organizing challenge.

TOPA matching is a web application that allows Tenants of Massachusetts to quickly exercise their TOPA rights. Using it they can organize a tenant association, communicate, vote, and file a statement of interest, while also helping match the TA to appropriate assignees. This application could help tenants overcome the logistic challenges of asserting their TOPA rights and more easily preserve their place of residence.

### Scalability

The specific load problem that TOPA matching faces is caused by the fact that it is event driven. The moment a landlord issues a Notice of Intent to Sell, all the residents (potentially hundreds) will try to log on, join the specific building’s portal, vote, and upload a large amount of important documents. This means that the maximum traffic and processing spikes occur at unpredictable times. A single server might not have the capacity to handle the sheer volume of requests, especially when it is likely that the system will frequently be archiving data files with large footprints like PDFs and images. Additionally backend processing like posterization and OCR might also be necessary.

Outside of the tenant association formation, the actual matching service would not require much computational bandwidth. Other than filtering based on geolocation, it’s likely that assignees won’t have any formal “qualifications” that can be used to determine if a potential match exists. Since assignees will evaluate on a case-by-case basis, our application mostly needs to enumerate a list of assignees based on location, then facilitate direct communication via email.

If a service node goes down during the 30 to 45 day filing window, data corruption could occur. This would cause a scenario where documents or vote tallies would be out of sync or lost, which could lead to a need to restart the process. Therefore it's imperative that the system be designed to be highly fault tolerant.

### Computing for the Common Good framing

“C4CG is about integrating values into your work, research, and education. ...It’s about education and research, the two pillars of any college that are going to make lives better not only for the citizens of Massachusetts, but also for the world" Haas says there are three prongs to C4CG: education; research to improve computer technology, making it better and safer for all; and research to apply that technology or technologies in general to do some good in the world.

In the context of C4CG, the TOPA matching project hits mostly on the third tenant of C4CG: "doing some good in the world". We're seeking to create a tool to aid citizens of Massachusetts who're under threat of being displaced by movements in the real estate economy, a population who typically are not well represented in government. When functional, this tool that aids tenants in asserting TOPA rights and helps connect them with an assignee, in turn helping them get that representation and protect their employment, connections to their community, and standard of living. If this tool becomes unresponsive, tenants would be forced to pursue TOPA through slower channels and may even lose progress, which could even severely impede their process.
