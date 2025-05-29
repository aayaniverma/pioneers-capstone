from docx import Document

def extract_text_from_docx(docx_path):
    # docx_path should be a path string, not a file object
    doc = Document(docx_path)
    return "\n".join(para.text for para in doc.paragraphs)

def verify_contract_guidelines(context):
    errors = []

    # 1. Mandatory Party Information
    if not context.get("Full_Name_Company_A") or not context.get("Full_Name_Company_B"):
        errors.append("Missing full legal names for one or both companies.")
    if not context.get("Address_A") or not context.get("Address_B"):
        errors.append("Missing address for one or both companies.")
    if not context.get("Jurisdiction_A") or not context.get("Jurisdiction_B"):
        errors.append("Missing jurisdiction for one or both companies.")

    # 2. Contract Metadata
    if not context.get("Date"):
        errors.append("Missing effective date.")
    if context.get("Governing_Law") and not any(state in context["Governing_Law"] for state in ["Karnataka", "Maharashtra", "Delhi"]):
        errors.append("Governing law must be Karnataka, Maharashtra, or Delhi.")
    if not context.get("Closing_Date"):
        errors.append("Missing closing date.")

    # 3. Merger or Acquisition Specifics
    if not context.get("Share_Exchange_Ratio") and not context.get("Cash_Per_Share"):
        errors.append("Either Share Exchange Ratio or Cash Per Share must be specified.")

    if context.get("Share_Exchange_Ratio"):
        try:
            ratio = int(context["Share_Exchange_Ratio"])
            if not (1 <= ratio <= 100):
                errors.append("Share Exchange Ratio must be between 1 and 100.")
        except ValueError:
            errors.append("Invalid Share Exchange Ratio format.")

    if context.get("Cash_Per_Share"):
        try:
            cash = float(context["Cash_Per_Share"].replace(",", ""))
            if cash <= 1.0:
                errors.append("Cash Per Share must be greater than $1.00.")
        except ValueError:
            errors.append("Invalid Cash Per Share format.")

    # 4. Survival Clauses
    if context.get("Warranty_Survival_Years"):
        try:
            survival = int(context["Warranty_Survival_Years"])
            if survival < 1:
                errors.append("Warranty survival period must be at least 1 year.")
        except ValueError:
            errors.append("Invalid warranty survival format.")
    else:
        errors.append("Missing warranty survival period.")

    # 5. Dispute Resolution
    if context.get("Arbitration_Organization"):
        allowed_orgs = ["ICC", "SIAC", "LCIA"]
        if not any(org.lower() in context["Arbitration_Organization"].lower() for org in allowed_orgs):
            errors.append("Arbitration organization must be ICC, SIAC, or LCIA.")
    else:
        errors.append("Missing arbitration organization.")

    if not context.get("Arbitration_Location"):
        errors.append("Missing arbitration location.")

    # 6. Signatory Requirements
    if not context.get("Signatory_Name_A") or not context.get("Signatory_Name_B"):
        errors.append("Missing signatory names.")
    if not context.get("Signatory_Title_A") or not context.get("Signatory_Title_B"):
        errors.append("Missing signatory titles.")

    allowed_titles = ["CEO", "CFO", "Director", "Authorized Signatory"]
    for title_key in ["Signatory_Title_A", "Signatory_Title_B"]:
        if context.get(title_key) and not any(role.lower() in context[title_key].lower() for role in allowed_titles):
            errors.append(f"Invalid title for {title_key}. Must be one of: {', '.join(allowed_titles)}.")

    return errors if errors else ["✅ Contract passed all guideline checks."]


# --- Main script ---

# Use your full absolute path here:
output_contracts = "/Users/riyamathur/Desktop/pioneers-capstone/backend/output_contracts/generated_contract.docx"

# Extract raw contract text from docx file path
contract_text = extract_text_from_docx(output_contracts)

# Your function to parse structured context from contract text
def extract_context_from_text(text):
    # Replace with your actual extraction logic
    return {
        "Full_Name_Company_A": "Company Alpha Pvt. Ltd.",
        "Full_Name_Company_B": "Company Beta Inc.",
        "Address_A": "Bangalore",
        "Address_B": "Mumbai",
        "Jurisdiction_A": "India",
        "Jurisdiction_B": "India",
        "Date": "2025-05-21",
        "Governing_Law": "Karnataka",
        "Closing_Date": "2025-06-30",
        "Share_Exchange_Ratio": "10",
        "Cash_Per_Share": "",
        "Warranty_Survival_Years": "2",
        "Arbitration_Organization": "ICC",
        "Arbitration_Location": "Delhi",
        "Signatory_Name_A": "Riya Mathur",
        "Signatory_Title_A": "CEO",
        "Signatory_Name_B": "John Doe",
        "Signatory_Title_B": "CFO"
    }

# Extract structured context from raw contract text
context = extract_context_from_text(contract_text)

# Run contract guideline verification
verification_results = verify_contract_guidelines(context)

# Print verification results
for result in verification_results:
    print(result)
