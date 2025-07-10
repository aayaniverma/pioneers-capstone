# import os
# import json
# from docxtpl import DocxTemplate
# from tqdm import tqdm

# # Paths
# PREDICTIONS_PATH = "predictions.json"
# TEMPLATE_FOLDER = "templates"
# TEMPLATE_MERGER = os.path.join(TEMPLATE_FOLDER, "merger_template.docx")
# TEMPLATE_ACQUISITION = os.path.join(TEMPLATE_FOLDER, "acquisition_template.docx")
# OUTPUT_DIR = "generated_contracts"
# os.makedirs(OUTPUT_DIR, exist_ok=True)

# # Load predictions
# with open(PREDICTIONS_PATH, "r") as f:
#     predictions = json.load(f)

# # Utility to infer agreement type
# def infer_agreement_type(field_values):
#     combined_text = " ".join(field_values.values()).lower()
#     if "merger" in combined_text:
#         return "merger"
#     elif "acquisition" in combined_text or "acquire" in combined_text or "purchase" in combined_text:
#         return "acquisition"
#     return "acquisition"

# # Normalize Q&A keys like "What is the Date?" → "Date"
# def normalize_question(q):
#     return (
#         q.replace("What is the ", "")
#          .replace("?", "")
#          .strip()
#          .replace(" ", "_")
#     )

# # Process each prediction
# for doc_name, qna in tqdm(predictions.items(), desc="Generating contracts"):
#     context = {normalize_question(k): v.strip() for k, v in qna.items() if v.strip()}
#     agreement_type = infer_agreement_type(qna)
#     template_path = TEMPLATE_MERGER if agreement_type == "merger" else TEMPLATE_ACQUISITION

#     doc = DocxTemplate(template_path)
#     doc.render(context)
#     output_file = os.path.join(OUTPUT_DIR, f"{doc_name.replace('.docx', '')}_contract.docx")
#     doc.save(output_file)

# print(f"✅ All contracts generated at: {OUTPUT_DIR}")


import os
import json
from docxtpl import DocxTemplate
from jinja2 import Environment, Undefined
from tqdm import tqdm

# Custom Undefined class that preserves placeholders
class PreservePlaceholder(Undefined):
    def __str__(self):
        return f"{{{{ {self._undefined_name} }}}}"

# Jinja2 environment with PreservePlaceholder
jinja_env = Environment(undefined=PreservePlaceholder)

# Paths
#PREDICTIONS_PATH = "predictions.json"
TEMPLATE_FOLDER = "templates"
TEMPLATE_MERGER = os.path.join(TEMPLATE_FOLDER, "merger_template.docx")
TEMPLATE_ACQUISITION = os.path.join(TEMPLATE_FOLDER, "acquisition_template.docx")
OUTPUT_DIR = "/temp/tempcon"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Load predictions
#with open(PREDICTIONS_PATH, "r") as f:
  #  predictions = json.load(f)

# Normalize Q&A keys like "What is the Date?" → "Date"
def normalize_question(q):
    return (
        q.replace("What is the ", "")
         .replace("?", "")
         .strip()
         .replace(" ", "_")
    )

# Utility to infer agreement type
def infer_agreement_type(field_values):
    combined_text = " ".join(field_values.values()).lower()
    if "merger" in combined_text:
        return "merger"
    elif "acquisition" in combined_text or "acquire" in combined_text or "purchase" in combined_text:
        return "acquisition"
    return "acquisition"

# Process each prediction
def generate_contract(predictions: dict):
    for doc_name, qna in predictions.items():
        context = {normalize_question(k): v.strip() for k, v in qna.items() if v.strip()}
        agreement_type = infer_agreement_type(qna)
        template_path = TEMPLATE_MERGER if agreement_type == "merger" else TEMPLATE_ACQUISITION
        doc = DocxTemplate(template_path)
        doc.render(context, jinja_env=jinja_env)
        output_path = os.path.join(OUTPUT_DIR, f"{doc_name.replace('.docx', '')}_contract.docx")
        doc.save(output_path)
        return output_path 