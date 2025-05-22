from datetime import datetime

def ensure_date_in_prompt(prompt):
    current_date = datetime.today().strftime("%B %d, %Y")
    
    # If "Effective Date" placeholder is still present, replace it
    if "[Effective Date]" in prompt:
        prompt = prompt.replace("[Effective Date]", current_date)
    
    # Optionally append date info if no mention at all
    if "effective date" not in prompt.lower():
        prompt += f"\n\nDate: {current_date}"
    
    return prompt
