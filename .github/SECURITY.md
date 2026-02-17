# Security Policy

## Supported versions

| Version | Supported |
|---------|-----------|
| latest  | Yes       |

## Reporting a vulnerability

If you discover a security vulnerability in this project, **please report it responsibly**.

**Do not open a public GitHub issue for security vulnerabilities.**

Instead, please email **security@deepgram.com** with:

- A description of the vulnerability
- Steps to reproduce or a proof of concept
- The potential impact

We will acknowledge receipt within 48 hours and aim to provide a fix or mitigation within 7 days of confirmation.

## Scope

This package runs client-side in the browser. Security concerns include but are not limited to:

- XSS through rendered markdown content
- Injection through configuration values
- Data leakage through the chat interface
- Supply chain risks in dependencies
