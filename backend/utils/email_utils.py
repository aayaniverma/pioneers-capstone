import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(_file_), '..', '.env')
load_dotenv(dotenv_path)

def send_email_with_receipt(to_email, pdf_path, subject="Your Blockchain Receipt"):
    from_email = os.getenv("EMAIL_USER")
    email_password = os.getenv("EMAIL_PASS")

    if not from_email or not email_password:
        raise ValueError("EMAIL_USER or EMAIL_PASS not set in environment")

    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject

    body = "Attached is your blockchain receipt. This proves your contract was securely uploaded and recorded."
    msg.attach(MIMEText(body, 'plain'))

    with open(pdf_path, "rb") as f:
        part = MIMEApplication(f.read(), _subtype="pdf")
        part.add_header('Content-Disposition', 'attachment', filename=os.path.basename(pdf_path))
        msg.attach(part)

    try:
        with smtplib.SMTP("smtp-relay.brevo.com", 587) as server:
            server.starttls()
            server.login(from_email, email_password)
            server.send_message(msg)
    except Exception as e:
        print(f"❌ Email send failed: {e}")
        raise e
