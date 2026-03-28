"""Minimal local server for EchoWard custom voice mode.

This server does two jobs:
1. Serves the repo root as a static website.
2. Exchanges a Copilot Studio Direct Line secret for a short-lived token.

Usage (PowerShell):
    $env:COPILOT_DIRECT_LINE_SECRET="your-direct-line-secret"
    python backend/token_bridge.py

Then open:
    http://localhost:8000
"""

from __future__ import annotations

import json
import mimetypes
import os
from http import HTTPStatus
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen


HOST = os.environ.get("HOST", "127.0.0.1")
PORT = int(os.environ.get("PORT", "8000"))
DIRECT_LINE_SECRET = os.environ.get("COPILOT_DIRECT_LINE_SECRET", "")
DIRECT_LINE_BASE_URL = os.environ.get(
    "DIRECT_LINE_BASE_URL",
    "https://europe.directline.botframework.com",
)
DIRECT_LINE_TOKEN_URL = f"{DIRECT_LINE_BASE_URL}/v3/directline/tokens/generate"
REPO_ROOT = Path(__file__).resolve().parent.parent


class EchoWardHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=str(REPO_ROOT), **kwargs)

    def do_OPTIONS(self):
        self.send_response(HTTPStatus.NO_CONTENT)
        self._send_cors_headers()
        self.end_headers()

    def do_GET(self):
        if self.path == "/api/copilot-token":
            self._handle_copilot_token()
            return

        if self.path == "/api/health":
            self._send_json(
                HTTPStatus.OK,
                {
                    "ok": True,
                    "secretConfigured": bool(DIRECT_LINE_SECRET),
                    "repoRoot": str(REPO_ROOT),
                },
            )
            return

        super().do_GET()

    def do_POST(self):
        if self.path == "/api/copilot-token":
            self._handle_copilot_token()
            return

        self.send_error(HTTPStatus.NOT_FOUND, "Unknown endpoint")

    def end_headers(self):
        self._send_cors_headers()
        super().end_headers()

    def _send_cors_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def _handle_copilot_token(self):
        if not DIRECT_LINE_SECRET:
            self._send_json(
                HTTPStatus.INTERNAL_SERVER_ERROR,
                {
                    "error": (
                        "Missing COPILOT_DIRECT_LINE_SECRET. Set the environment variable "
                        "before starting backend/token_bridge.py."
                    )
                },
            )
            return

        try:
            token_payload = self._generate_direct_line_token()
        except HTTPError as error:
            message = error.read().decode("utf-8", errors="replace")
            self._send_json(
                HTTPStatus.BAD_GATEWAY,
                {
                    "error": f"Direct Line token request failed with HTTP {error.code}.",
                    "details": message,
                },
            )
            return
        except URLError as error:
            self._send_json(
                HTTPStatus.BAD_GATEWAY,
                {
                    "error": "Could not reach Direct Line to generate a token.",
                    "details": str(error.reason),
                },
            )
            return
        except Exception as error:  # pragma: no cover - defensive path
            self._send_json(
                HTTPStatus.INTERNAL_SERVER_ERROR,
                {"error": f"Unexpected token bridge error: {error}"},
            )
            return

        self._send_json(HTTPStatus.OK, token_payload)

    def _generate_direct_line_token(self):
        request = Request(
            DIRECT_LINE_TOKEN_URL,
            data=b"{}",
            headers={
                "Authorization": f"Bearer {DIRECT_LINE_SECRET}",
                "Content-Type": "application/json",
            },
            method="POST",
        )

        with urlopen(request, timeout=20) as response:
            body = response.read().decode("utf-8")
            return json.loads(body)

    def _send_json(self, status: HTTPStatus, payload: dict):
        body = json.dumps(payload).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def guess_type(self, path):
        if path.endswith(".js"):
            return "application/javascript"
        return mimetypes.guess_type(path)[0] or "application/octet-stream"


def main():
    server = ThreadingHTTPServer((HOST, PORT), EchoWardHandler)
    print(f"EchoWard token bridge running at http://{HOST}:{PORT}")
    print(f"Serving static files from {REPO_ROOT}")
    print(f"Using Direct Line base URL: {DIRECT_LINE_BASE_URL}")
    print("Health check: /api/health")
    server.serve_forever()


if __name__ == "__main__":
    main()
