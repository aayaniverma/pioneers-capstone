# backend/utils/email_utils.py
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
from email.mime.text import MIMEText
import os

def send_email_with_receipt(to_email, pdf_path, subject="Your Blockchain Receipt"):
    from_email = os.getenv("EMAIL_USER")
    email_password = os.getenv("EMAIL_PASS")

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

    with smtplib.SMTP("smtp.gmail.com", 587) as server:
        server.starttls()
        server.login(from_email, email_password)
        server.send_message(msg)
