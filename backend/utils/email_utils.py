import os
import requests
import base64
from dotenv import load_dotenv

load_dotenv()

def send_email_with_receipt(to_email, pdf_path, subject="Your Blockchain Receipt"):
    api_key = os.getenv("RESEND_API_KEY")
    if not api_key:
        raise ValueError("RESEND_API_KEY not set in environment")

    # Read and encode the PDF in base64
    with open(pdf_path, "rb") as f:
        pdf_data = base64.b64encode(f.read()).decode("utf-8")

    # Prepare the email payload
    payload = {
        "from": "Blockchain Receipts <onboarding@resend.dev>",
        "to": [to_email],
        "subject": subject,
        "html": "<p>Attached is your blockchain receipt. This proves your contract was securely uploaded and recorded.</p>",
        "attachments": [
            {
                "filename": os.path.basename(pdf_path),
                "content": pdf_data,
                "type": "application/pdf"
            }
        ]
    }

    # Send the email
    response = requests.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        },
        json=payload
    )

    # Check response
    if response.status_code == 200:
        print("✅ Email sent successfully.")
    else:
        print(f"❌ Resend failed: {response.status_code} - {response.text}")
        raise Exception("Failed to send email via Resend")
