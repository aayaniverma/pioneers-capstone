def build_prompt(guideline_path, raw_notes):
    with open(guideline_path, 'r') as f:
        guidelines = f.read()

    prompt = f"""
You are a highly skilled legal assistant AI tasked with transforming raw lawyer notes into a detailed, professional, and legally robust Non-Disclosure Agreement (NDA) specific to a Merger & Acquisition (M&A) transaction.

Your output should be a clear, structured, and formal NDA document of about 4 to 5 pages in length, elaborating on all relevant sections with precise legal language suitable for corporate M&A deals.

---

# NON-DISCLOSURE AGREEMENT (NDA)

### This Agreement is made effective as of **[Effective Date]**

---

## 1. Parties

This Non-Disclosure Agreement (“Agreement”) is made and entered into by and between:

- **Disclosing Party:**  
  Name: **[Disclosing Party Full Legal Name]**  
  Jurisdiction: **[State/Country]**  
  Address: **[Full Business Address]**

- **Receiving Party:**  
  Name: **[Receiving Party Full Legal Name]**  
  Jurisdiction: **[State/Country]**  
  Address: **[Full Business Address]**

The parties agree to enter into this Agreement for the purpose of facilitating confidential discussions regarding a potential merger and acquisition transaction.

---

## 2. Definitions

- **Confidential Information:** For purposes of this Agreement, “Confidential Information” means any and all data, materials, products, technology, computer programs, specifications, manuals, business plans, software, marketing plans, financial information, forecasts, projections, and any other information disclosed by the Disclosing Party to the Receiving Party, whether orally, in writing, or by inspection of tangible objects, that is designated as confidential or that reasonably should be understood to be confidential.

- **Representatives:** Includes directors, officers, employees, agents, affiliates, contractors, or advisors of the Receiving Party who have a legitimate need to know the Confidential Information.

---

## 3. Purpose

The purpose of this Agreement is to govern the use and protection of Confidential Information disclosed in connection with the potential merger and acquisition transaction between the parties.

---

## 4. Obligations of Receiving Party

4.1 **Confidentiality**  
The Receiving Party agrees to maintain all Confidential Information in strict confidence and shall not disclose such information to any third party except as expressly permitted in this Agreement.

4.2 **Use Restrictions**  
The Receiving Party shall use the Confidential Information solely for the evaluation and negotiation of the proposed transaction and for no other purpose without prior written consent of the Disclosing Party.

4.3 **Care and Protection**  
The Receiving Party shall exercise at least the same degree of care in protecting the confidentiality of the Confidential Information as it uses with its own similar confidential information, but in no event less than reasonable care.

4.4 **Limitation on Copying**  
The Receiving Party shall not copy, reproduce, or otherwise duplicate Confidential Information except as required for the permitted use under this Agreement.

---

## 5. Permitted Disclosures

5.1 The Receiving Party may disclose Confidential Information to its Representatives who need to know such information for the purposes of this Agreement, provided that the Receiving Party ensures such Representatives are bound by confidentiality obligations no less restrictive than those contained herein.

5.2 The Receiving Party may disclose Confidential Information if required by law, regulation, or court order, provided that the Receiving Party gives the Disclosing Party prompt written notice to enable it to seek a protective order or other appropriate remedy.

---

## 6. Exclusions from Confidential Information

Confidential Information shall not include information that:

- Was known to the Receiving Party prior to disclosure without restriction;
- Is or becomes publicly available other than through a breach of this Agreement;
- Is independently developed by the Receiving Party without use of the Confidential Information; or
- Is disclosed with prior written consent of the Disclosing Party.

---

## 7. Term

This Agreement shall commence on the Effective Date and shall remain in effect for **[Term Duration, e.g., three (3) years]**, unless earlier terminated by mutual written agreement of the parties.

---

## 8. Return or Destruction of Materials

Upon termination of this Agreement or upon the Disclosing Party's written request, the Receiving Party shall promptly return or destroy all materials containing Confidential Information, including any copies or extracts, and certify in writing to the Disclosing Party that it has complied with these obligations.

---

## 9. Representations and Warranties

Each party represents and warrants to the other that it has the full power and authority to enter into this Agreement and that the execution and delivery of this Agreement have been duly authorized.

---

## 10. No License

Nothing in this Agreement shall be construed as granting any rights by license or otherwise, expressly or by implication, to the Receiving Party under any patents, trademarks, copyrights, or other intellectual property rights of the Disclosing Party.

---

## 11. Remedies

The Receiving Party acknowledges that any unauthorized use or disclosure of the Confidential Information may cause irreparable harm to the Disclosing Party, for which monetary damages may be insufficient. The Disclosing Party shall be entitled to seek injunctive relief, specific performance, or any other remedies available at law or in equity.

---

## 12. Indemnification

The Receiving Party agrees to indemnify, defend, and hold harmless the Disclosing Party from and against any losses, damages, liabilities, or expenses arising from any breach of this Agreement.

---

## 13. Governing Law and Jurisdiction

This Agreement shall be governed by and construed in accordance with the laws of **[Governing Jurisdiction]**. Any disputes arising out of or in connection with this Agreement shall be submitted to the exclusive jurisdiction of the courts located in **[Governing Jurisdiction]**.

---

## 14. Miscellaneous

14.1 **Entire Agreement:** This Agreement constitutes the entire understanding between the parties relating to the subject matter hereof and supersedes all prior agreements.

14.2 **Amendments:** No amendment or modification of this Agreement shall be effective unless in writing and signed by both parties.

14.3 **Assignment:** Neither party may assign this Agreement without the prior written consent of the other party.

14.4 **Severability:** If any provision of this Agreement is held to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.

14.5 **Waiver:** No failure or delay by either party to exercise any right shall constitute a waiver.

14.6 **Notices:** All notices shall be in writing and delivered via certified mail, courier, or email to the addresses specified herein.

14.7 **Counterparts:** This Agreement may be executed in counterparts, each of which shall be deemed an original.

---

### Lawyer's Notes:  
--- START ---  
{raw_notes}  
--- END ---

---

### Instructions for Document Generation:

- Extract **all important details** from the Lawyer’s Notes, such as Effective Date, Parties’ full names, jurisdictions, addresses, term duration, governing law, and any specific terms.
- If any critical detail is **missing** from the notes, insert a placeholder like **[Insert Effective Date]**, **[Insert Disclosing Party Full Legal Name]**, etc.
- Elaborate each section with formal and precise legal language to expand the document length to approximately 4–5 pages.
- Use bullet points, numbered lists, and formal phrasing to enhance clarity and professionalism.
- Include typical examples, clarifications, and legal nuances common in M&A NDAs.
- Maintain consistency in style and terminology throughout the document.
- Do **not** add a signature or execution block.

Generate the full NDA document strictly following this template and instructions.

"""
    return prompt
