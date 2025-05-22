import re
from datetime import datetime

def extract_entities(text):
    """
    Extract key contract entities from text.
    Returns a dictionary of extracted data.
    """

    data = {}

    # Extract party names (simple heuristic: look for "between X and Y" or "by and between X and Y")
    party_pattern = re.compile(
        r"(?:between|by and between)\s+(.*?)\s+and\s+(.*?)(?:,|\n|$)", re.IGNORECASE)
    parties = party_pattern.search(text)
    if parties:
        data["party_1"] = parties.group(1).strip()
        data["party_2"] = parties.group(2).strip()
    else:
        # fallback
        data["party_1"] = "Party A"
        data["party_2"] = "Party B"

    # Extract effective date (look for "effective date is" or "dated" patterns)
    date_pattern = re.compile(
        r"(effective date\s*(?:is)?|dated)\s*[:\-]?\s*([A-Za-z0-9,\s]+)", re.IGNORECASE)
    date_match = date_pattern.search(text)
    if date_match:
        raw_date = date_match.group(2).strip()
        try:
            # Try parsing date (very naive)
            parsed_date = datetime.strptime(raw_date, "%B %d, %Y")
            data["effective_date"] = parsed_date.strftime("%Y-%m-%d")
        except Exception:
            data["effective_date"] = raw_date  # keep raw if parsing fails
    else:
        data["effective_date"] = "N/A"

    # Extract term/duration (look for "term of" or "duration" followed by a number and units)
    term_pattern = re.compile(
        r"(term of|duration of)\s+(\d+)\s+(year|years|month|months)", re.IGNORECASE)
    term_match = term_pattern.search(text)
    if term_match:
        data["term_length"] = f"{term_match.group(2)} {term_match.group(3)}"
    else:
        data["term_length"] = "N/A"

    # Extract governing law (look for "governed by the laws of X")
    law_pattern = re.compile(
        r"governed by the laws of ([A-Za-z\s]+)", re.IGNORECASE)
    law_match = law_pattern.search(text)
    if law_match:
        data["governing_law"] = law_match.group(1).strip()
    else:
        data["governing_law"] = "N/A"

    # Example: extract contract amount (look for "$" followed by numbers)
    amount_pattern = re.compile(r"\$\s?([\d,]+(?:\.\d{2})?)")
    amount_match = amount_pattern.search(text)
    if amount_match:
        data["contract_amount"] = amount_match.group(1)
    else:
        data["contract_amount"] = "N/A"

    return data


def find_additional_info(text, data):
    """
    Extract or compose any additional notes or info from the text.
    This can be customized per your use case.
    """
    disclaimers = []
    disclaimer_pattern = re.compile(r"(disclaimer:.*)", re.IGNORECASE)
    matches = disclaimer_pattern.findall(text)
    if matches:
        disclaimers = matches
    else:
        disclaimers = ["No disclaimers found."]

    return "\n".join(disclaimers)
