
import os
import requests
import base64
from dotenv import load_dotenv

load_dotenv()

def send_email_with_receipt(to_email, pdf_path, subject="Your Blockchain Receipt", duplicate=False):
    api_key = os.getenv("RESEND_API_KEY")
    if not api_key:
        print("⚠ RESEND_API_KEY not set in environment. Skipping email.")
        return False

    # Read and encode the PDF in base64
    with open(pdf_path, "rb") as f:
        pdf_data = base64.b64encode(f.read()).decode("utf-8")

    # Update subject/body for duplicates
    if duplicate:
        subject = "Duplicate Blockchain Receipt"
        body_text = "<p>This contract was already registered on our blockchain. Attached is a duplicate notice receipt for your records.</p>"
    else:
        body_text = "<p>Your contract was successfully registered on the blockchain. Attached is your receipt for verification purposes.</p>"

    payload = {
        "from": "Blockchain Receipts <onboarding@resend.dev>",
        "to": [to_email],
        "subject": subject,
        "html": body_text,
        "attachments": [
            {
                "filename": os.path.basename(pdf_path),
                "content": pdf_data,
                "type": "application/pdf"
            }
        ]
    }

    try:
        response = requests.post(
            "https://api.resend.com/emails",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json=payload,
            timeout=10
        )

        if response.status_code in (200, 201, 202):  # All success codes
            print(f"✅ Email sent to {to_email}")
            return True
        else:
            print(f"❌ Email send failed: {response.status_code} - {response.text}")
            return False

    except requests.RequestException as e:
        print(f"⚠ Email sending skipped due to error: {e}")
        return False