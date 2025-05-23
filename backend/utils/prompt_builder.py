import re

def detect_transaction_type(raw_notes):
    notes = raw_notes.lower()

    # Define acquisition-related keywords
    acquisition_keywords = [
        r"\bacquisition\b", r"\bacquire\b", r"\bacquired\b", r"\bbuy(?:ing|out)?\b",
        r"\bpurchase\b", r"\bpurchasing\b", r"\btakeover\b", r"\bbought\b"
    ]

    # Define merger-related keywords
    merger_keywords = [
        r"\bmerger\b", r"\bmerging\b", r"\bcombine\b", r"\bconsolidation\b", r"\bmerge\b"
    ]

    # Check for acquisition indicators
    for pattern in acquisition_keywords:
        if re.search(pattern, notes):
            return "acquisition", "a potential acquisition transaction"

    # Check for merger indicators
    for pattern in merger_keywords:
        if re.search(pattern, notes):
            return "merger", "a potential merger transaction"

    # Default to generic M&A
    return "merger and acquisition (M&A)", "a potential merger and acquisition transaction"


def build_prompt(guideline_path, raw_notes):
    with open(guideline_path, 'r') as f:
        guidelines = f.read()

    transaction_type, transaction_phrase = detect_transaction_type(raw_notes)

    # Instructional context
    context = f"""
You are a legal assistant AI. Convert the following raw lawyer notes into a detailed, structured Non-Disclosure Agreement (NDA) for a {transaction_type} transaction.

Raw notes:
{raw_notes}

Instructions:
- Extract details: date, full names, jurisdictions, addresses, term duration, governing law, arbitration details, and any custom terms.
- Use [[Placeholder]] for missing items.
- Write in formal, legally appropriate language.
- Organize using numbered sections and bullet points.
- Include appropriate legal language for {transaction_type} NDAs.
- Do not include the raw notes or these instructions in the output.
"""

    # NDA Template
    template = f"""
NON-DISCLOSURE AGREEMENT

1. Effective Date  
This Agreement is effective as of [[Date]].

2. Parties  
This Agreement is entered into by:  
- Disclosing Party: 
    Name : [[Full_Name_Company_A]],
    Jurisdiction : [[Jurisdiction_A]]
    Address : [[Address_A]]  
- Receiving Party: 
    Name : [[Full_Name_Company_B]],
    Jurisdiction : [[Jurisdiction_B]]
    Address : [[Address_B]]

The parties intend to engage in confidential discussions regarding {transaction_phrase} in jurisdiction.

3. Definitions  
(Define Confidential Information and related terms.)

4. Obligations of Confidentiality  
(Detail how information must be protected, exceptions, etc.)

...

7. Term  
This Agreement remains in effect for [[Number_of_years]] years unless terminated earlier by written agreement.

13. Governing Law and Jurisdiction  
This Agreement shall be governed by the laws of [[Governing_Law]]. Any disputes shall be resolved in the courts of [[Governing_Law]].

14. Dispute Resolution  
Disputes will be resolved by binding arbitration administered by [[Arbitration_Organization]] in [[Arbitration_Location]].

Execution  
Signed by authorized representatives:

- [[Signatory_Name_A]], [[Signatory_Title_A]], for [[Full_Name_Company_A]]  
- [[Signatory_Name_B]], [[Signatory_Title_B]], for [[Full_Name_Company_B]]
"""

    return context + "\n\n" + template
