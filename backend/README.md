# Backend

This folder contains the local backend pieces used by EchoWard.

## Files

| File | Purpose |
|---|---|
| `risk_scorer.py` | Core scam risk scoring logic used as a local reference implementation |
| `token_bridge.py` | Local static server plus Direct Line token bridge for custom voice mode |

## Risk Scorer

Run the sample scorer locally with:

```bash
python backend/risk_scorer.py
```

## Voice Mode Token Bridge

The custom `Voice mode` in [`index.html`](../index.html) expects a backend endpoint at `/api/copilot-token`.
`token_bridge.py` provides that endpoint and also serves the site at `http://localhost:8000`.

### Run it locally

PowerShell:

```powershell
$env:COPILOT_DIRECT_LINE_SECRET="your-direct-line-secret"
python backend/token_bridge.py
```

Then open:

```text
http://localhost:8000
```

Optional health check:

```text
http://localhost:8000/api/health
```

If your bot uses a regional Direct Line endpoint, you can override it:

```powershell
$env:DIRECT_LINE_BASE_URL="https://europe.directline.botframework.com"
```

### Why this exists

The browser should not hold the Copilot Studio Direct Line secret. The token bridge keeps the secret on the server side and returns only a short-lived token to the page.
