on line 27 of liaison-service/src/index.js, MOCK_ASSIGNEES was initially ai generated but has since been replaced by human code. In previous commits you will see a comment "//ai generated btw" showing that mock assignees was created by AI. Here is an attempt to reconstruct the ai prompt below:

can you make a few mock assignees of the form id, name, focusArea, contactEmail, maxAcquisitionBudget, and activeStatus in the boston area for a TOPA asignee mathcing algorithm

JSON
[
  {
    "id": "asgn_bnclt_01",
    "name": "Boston Neighborhood Community Land Trust",
    "focusArea": "Dorchester, Roxbury, Mattapan (Small Multi-Family 2-4 Units & Permanently Affordable CLT Models)",
    "contactEmail": "acquisitions@bnclt.org",
    "maxAcquisitionBudget": 3500000,
    "activeStatus": true
  },
  {
    "id": "asgn_ebcdc_02",
    "name": "East Boston Community Development Corporation",
    "focusArea": "East Boston & Winthrop (Mid-Size Multi-Family 5-30 Units, Mixed-Income Rentals)",
    "contactEmail": "housing-acquisitions@ebcdc.com",
    "maxAcquisitionBudget": 12000000,
    "activeStatus": true
  },
  {
    "id": "asgn_fcdc_03",
    "name": "Fenway Community Development Corp",
    "focusArea": "Fenway, Mission Hill, South End (High-Density Multi-Family & Senior Preservation)",
    "contactEmail": "realestate@fenwaycdc.org",
    "maxAcquisitionBudget": 18500000,
    "activeStatus": true
  },
  {
    "id": "asgn_cclt_04",
    "name": "Chinatown Community Land Trust",
    "focusArea": "Chinatown, Downtown Boston (Historic Row Houses & Limited-Equity Cooperatives)",
    "contactEmail": "info@chinatownclt.org",
    "maxAcquisitionBudget": 5000000,
    "activeStatus": true
  },
  {
    "id": "asgn_uehc_05",
    "name": "Urban Edge Housing Corporation",
    "focusArea": "Jamaica Plain, Roxbury (Large-Scale Multi-Family 20+ Units & Mixed-Use Properties)",
    "contactEmail": "development@urbanedge.org",
    "maxAcquisitionBudget": 25000000,
    "activeStatus": false
  }
]
TypeScript Data Type Interface
TypeScript
export interface TOPAAssignee {
  id: string;
  name: string;
  focusArea: string;
  contactEmail: string;
  maxAcquisitionBudget: number; // In USD
  activeStatus: boolean;
}
Next steps for your TOPA matching algorithm:

Write a TypeScript matching function for budget and focus area

Generate mock property listings for matching