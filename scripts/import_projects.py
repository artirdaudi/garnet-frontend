#!/usr/bin/env python3
"""Import dated local project folders into the Garnet API and Cloudinary."""

import argparse
from datetime import date
import getpass
import json
import os
from pathlib import Path
import re
import ssl
import sys
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen
from uuid import uuid4


ROOT = Path(__file__).resolve().parents[1]
PHOTOS = ROOT / "photos" / "projects"
STATE = ROOT / "scripts" / ".project-import-state.json"
API = os.environ.get("GARNET_API_URL", "https://api.garnetstudio.mk").rstrip("/")
try:
    import certifi
    TLS = ssl.create_default_context(cafile=certifi.where())
except ImportError:
    system_bundle = Path("/etc/ssl/cert.pem")
    TLS = ssl.create_default_context(cafile=str(system_bundle) if system_bundle.exists() else None)
TITLES = {
    "June 2, 2022": "Zyrë moderne",
    "September 16, 2022": "Restorant modern",
    "September 28, 2022": "Dhomë dite moderne",
    "November 24, 2022": "Dhomë gjumi moderne",
    "30 November, 2022": "Zyrë noteriale",
    "June 9, 2023": "Dhomë dite bashkëkohore",
    "August 17, 2024": "Butik modern",
    "August 17, 2024 - 3": "Vilë malore",
    "January 15, 2025": "Kuzhinë dhe dhomë dite",
    "August 17, 2025 -2": "Shtëpi moderne",
}
MONTHS = {name: number for number, name in enumerate(
    ("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"), 1
)}


def folder_date(name: str) -> date:
    clean = re.sub(r"\s*-\s*\d+$", "", name)
    match = re.fullmatch(r"(?:(\w+) (\d{1,2})|(\d{1,2}) (\w+)), (\d{4})", clean)
    if not match:
        raise ValueError(f"Unknown folder date: {name}")
    month = match.group(1) or match.group(4)
    return date(int(match.group(5)), MONTHS[month], int(match.group(2) or match.group(3)))


def photo_key(path: Path):
    match = re.search(r"-(\d+)$", path.stem)
    return (path.stem[:match.start()] if match else path.stem, int(match.group(1)) if match else 0)


def folders():
    found = [path for path in PHOTOS.iterdir() if path.is_dir()]
    unknown = {path.name for path in found} - TITLES.keys()
    missing = TITLES.keys() - {path.name for path in found}
    if unknown or missing:
        raise ValueError(f"Folder set changed. Unknown: {sorted(unknown)}; missing: {sorted(missing)}")
    for folder in sorted(found, key=lambda path: (folder_date(path.name), path.name)):
        photos = sorted((path for path in folder.iterdir() if path.is_file() and path.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}), key=photo_key)
        if not photos:
            raise ValueError(f"No images in {folder.name}")
        yield folder, TITLES[folder.name], photos


def request_json(url: str, *, method="GET", token=None, payload=None):
    headers = {"Accept": "application/json"}
    if token:
        headers["Authorization"] = f"Bearer {token}"
    body = None
    if payload is not None:
        body = json.dumps(payload).encode("utf-8")
        headers["Content-Type"] = "application/json"
    try:
        with urlopen(Request(url, data=body, headers=headers, method=method), timeout=60, context=TLS) as response:
            return json.load(response)
    except HTTPError as exc:
        raise RuntimeError(f"HTTP {exc.code}: {method} {url.split('?')[0]}") from exc
    except URLError as exc:
        raise RuntimeError(f"Connection failed: {url.split('?')[0]} ({exc.reason})") from exc


def upload_cloudinary(photo: Path, signed: dict):
    boundary = uuid4().hex
    parts = []
    for key in ("api_key", "timestamp", "folder", "signature"):
        value = str(signed[key]).encode("utf-8")
        parts.extend((f"--{boundary}\r\nContent-Disposition: form-data; name=\"{key}\"\r\n\r\n".encode(), value, b"\r\n"))
    content_type = {".png": "image/png", ".webp": "image/webp"}.get(photo.suffix.lower(), "image/jpeg")
    parts.extend((
        f"--{boundary}\r\nContent-Disposition: form-data; name=\"file\"; filename=\"{photo.name.replace(chr(34), '')}\"\r\nContent-Type: {content_type}\r\n\r\n".encode("utf-8"),
        photo.read_bytes(), b"\r\n", f"--{boundary}--\r\n".encode(),
    ))
    try:
        with urlopen(Request(signed["upload_url"], data=b"".join(parts), headers={"Content-Type": f"multipart/form-data; boundary={boundary}"}, method="POST"), timeout=120, context=TLS) as response:
            return json.load(response)
    except HTTPError as exc:
        raise RuntimeError(f"Cloudinary upload failed (HTTP {exc.code}) for {photo.name}") from exc
    except URLError as exc:
        raise RuntimeError(f"Cloudinary connection failed for {photo.name} ({exc.reason})") from exc


def all_projects(token: str):
    rows = []
    page = 1
    while True:
        result = request_json(f"{API}/api/v1/admin/projects?page={page}&page_size=100", token=token)
        rows.extend(result["items"])
        if len(rows) >= result["total"]:
            return rows
        page += 1


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--apply", action="store_true", help="Create projects and upload images. Without this flag, print the plan only.")
    args = parser.parse_args()
    plan = list(folders())
    for index, (folder, title, photos) in enumerate(plan, 1):
        print(f"{index:02d}. {folder.name} -> {title} ({len(photos)} photos)")
    if not args.apply:
        print("\nPreview only. Run with --apply to import.")
        return

    username = input("Admin username [admin]: ").strip() or "admin"
    password = getpass.getpass("Admin password: ")
    token = request_json(f"{API}/auth/login", method="POST", payload={"username": username, "password": password})["access_token"]
    state = json.loads(STATE.read_text()) if STATE.exists() else {}
    existing = {row["title"] for row in all_projects(token)}

    for folder, title, photos in plan:
        project_id = state.get(folder.name)
        if project_id is None:
            if title in existing:
                raise RuntimeError(f"Project '{title}' already exists. No duplicate created; resolve it before resuming.")
            project = request_json(f"{API}/api/v1/admin/projects", method="POST", token=token, payload={"title": title})
            project_id = project["id"]
            state[folder.name] = project_id
            STATE.write_text(json.dumps(state, ensure_ascii=False, indent=2) + "\n")
            existing.add(title)
            print(f"Created: {title} (#{project_id})", flush=True)
        else:
            project = request_json(f"{API}/api/v1/admin/projects/{project_id}", token=token)
            if project.get("title") != title:
                raise RuntimeError(f"Saved project #{project_id} does not match '{title}'; stopped to protect existing data.")

        saved = request_json(f"{API}/api/v1/admin/projects/{project_id}/images", token=token)
        if len(saved) > len(photos):
            raise RuntimeError(f"Project #{project_id} has more images than its folder; stopped to avoid duplicates.")
        for index, photo in enumerate(photos[len(saved):], len(saved)):
            signed = request_json(f"{API}/api/v1/admin/media/sign-upload", method="POST", token=token)
            uploaded = upload_cloudinary(photo, signed)
            request_json(f"{API}/api/v1/admin/projects/{project_id}/images", method="POST", token=token, payload={**uploaded, "display_order": index})
            print(f"  {index + 1}/{len(photos)} {photo.name}", flush=True)
        print(f"Complete: {title} (#{project_id})", flush=True)

    print("All project folders imported. Location, area and description were left empty.")


if __name__ == "__main__":
    try:
        main()
    except (ValueError, RuntimeError, KeyError) as exc:
        print(f"Import stopped: {exc}", file=sys.stderr)
        sys.exit(1)
