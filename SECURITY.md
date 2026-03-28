# Security Policy

## Supported Versions

This project is a hackathon submission and is provided as-is for educational and demonstration purposes.

| Version | Supported |
|---|---|
| main | Yes |

## Reporting a Vulnerability

If you discover a security vulnerability in EchoWard, please do **not** open a public GitHub issue.

Instead, contact the team directly through GitHub by opening a **private security advisory**.

Please include:
- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested remediation

We will acknowledge your report within 48 hours and aim to provide a fix or mitigation within 7 days.

## Security Design Notes

EchoWard is designed with the following security practices:

- **No persistent storage of voice data** — all voice processing is done in real-time only
- **No PII storage** — user profiles are session-scoped and not persisted
- **Azure Content Safety** — all external URLs and content are filtered before being presented to users
- **HITL approval** — high-risk transactions require explicit user confirmation before proceeding
- **Encrypted communication** — all agent-to-agent and agent-to-service calls use Azure's encrypted endpoints
