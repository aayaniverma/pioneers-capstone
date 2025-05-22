from utils.io_handler import read_docx, write_docx
from utils.prompt_builder import build_prompt
from utils.openai_client import generate_output
from utils.date_checker import ensure_date_in_prompt
from datetime import datetime
from contract_generator import generate_contract_from_structured_doc



input_path = "input_docs/sample_input.docx"
output_path = "output_docs/structured_output.docx"
guideline_path = "guidelines/nda_ma_guidelines.md"

raw_notes = read_docx(input_path)
prompt = build_prompt(guideline_path, raw_notes)
prompt = ensure_date_in_prompt(prompt)

structured_doc = generate_output(prompt)

# ✨ Replace placeholders with actual values
current_date = datetime.today().strftime("%B %d, %Y")
structured_doc = structured_doc.replace("[Effective Date]", current_date)
structured_doc = structured_doc.replace("[Date]", current_date)

write_docx(structured_doc, output_path)

print("Structured documentation generated successfully.")

generate_contract_from_structured_doc(
    structured_doc_path="output_docs/structured_output.docx",
    templates_dir="Contract_template", 
    output_contract_path="output_contracts/final_contract.docx"
)
