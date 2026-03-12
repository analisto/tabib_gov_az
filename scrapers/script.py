"""
Scraper for tabib.gov.az - Tibb Ərazi Bölmələri (Medical Territorial Divisions)
Data source: https://tabib.gov.az/fealiyyet/tibb-erazi-bolmeleri

Output:
  data/data.xlsx         - Main workbook with 2 sheets:
                           Sheet 1: hospitals     (region, city, hospital details)
                           Sheet 2: dependencies  (hospital → dependent facility mapping)
"""

import re
import sys
import requests

# Fix Windows console encoding
if sys.platform == "win32":
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
from bs4 import BeautifulSoup
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
from pathlib import Path

# ── Config ────────────────────────────────────────────────────────────────────

API_URL = (
    "https://tabib.gov.az/_next/data/gKsj-5e-IVxPNOgwNiJub/az/fealiyyet/"
    "tibb-erazi-bolmeleri.json"
)

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/145.0.0.0 Safari/537.36"
    ),
    "Accept": "*/*",
    "Accept-Language": "az,en;q=0.9",
    "x-nextjs-data": "1",
    "Referer": "https://tabib.gov.az/fealiyyet/tibb-erazi-bolmeleri",
}

OUTPUT_DIR = Path(__file__).parent.parent / "data"
OUTPUT_FILE = OUTPUT_DIR / "data.xlsx"

# ── Styles ────────────────────────────────────────────────────────────────────

HEADER_FILL   = PatternFill("solid", fgColor="1F4E79")   # dark blue
REGION_FILL   = PatternFill("solid", fgColor="2E75B6")   # medium blue
CITY_FILL     = PatternFill("solid", fgColor="BDD7EE")   # light blue
ALT_FILL      = PatternFill("solid", fgColor="F2F7FC")   # very light blue
WHITE_FILL    = PatternFill("solid", fgColor="FFFFFF")

HEADER_FONT   = Font(name="Calibri", bold=True, color="FFFFFF", size=11)
REGION_FONT   = Font(name="Calibri", bold=True, color="FFFFFF", size=10)
CITY_FONT     = Font(name="Calibri", bold=True, color="17375E", size=10)
BODY_FONT     = Font(name="Calibri", size=10)

THIN_BORDER = Border(
    left=Side(style="thin", color="B8CCE4"),
    right=Side(style="thin", color="B8CCE4"),
    top=Side(style="thin", color="B8CCE4"),
    bottom=Side(style="thin", color="B8CCE4"),
)

CENTER = Alignment(horizontal="center", vertical="center", wrap_text=True)
LEFT   = Alignment(horizontal="left",   vertical="center", wrap_text=True)


def style_cell(cell, font=None, fill=None, alignment=None, border=None):
    if font:      cell.font      = font
    if fill:      cell.fill      = fill
    if alignment: cell.alignment = alignment
    if border:    cell.border    = border


# ── Helpers ───────────────────────────────────────────────────────────────────

def strip_html(html: str) -> str:
    """Remove HTML tags and normalise whitespace."""
    if not html:
        return ""
    text = BeautifulSoup(html, "html.parser").get_text(separator=" ")
    text = re.sub(r"\s+", " ", text).strip()
    return text


def clean(value) -> str:
    """Return a clean string or empty string."""
    if value is None:
        return ""
    return str(value).strip()


# ── Fetch ─────────────────────────────────────────────────────────────────────

def fetch_data() -> list:
    print("Fetching data from tabib.gov.az …")
    resp = requests.get(API_URL, headers=HEADERS, timeout=30)
    resp.raise_for_status()
    payload = resp.json()
    regions = payload.get("pageProps", {}).get("tebCities", [])
    print(f"  → {len(regions)} regions found")
    return regions


# ── Parse ─────────────────────────────────────────────────────────────────────

def parse(regions: list) -> tuple[list[dict], list[dict]]:
    """
    Returns:
      hospitals   – flat list, one row per hospital
      deps        – flat list, one row per dependent facility
    """
    hospitals = []
    deps      = []

    for region in regions:
        region_id   = clean(region.get("id"))
        region_name = clean(region.get("name"))

        for city in region.get("cities", []):
            city_id   = clean(city.get("id"))
            city_name = clean(city.get("name"))

            for hosp in city.get("hospitals", []):
                hosp_id    = clean(hosp.get("id"))
                hosp_name  = clean(hosp.get("text"))
                hosp_desc  = strip_html(hosp.get("desc", ""))
                hosp_phone = clean(hosp.get("phone"))
                hosp_email = clean(hosp.get("email"))
                hosp_addr  = clean(hosp.get("address"))

                hospitals.append({
                    "Region ID":          region_id,
                    "Region":             region_name,
                    "City ID":            city_id,
                    "City":               city_name,
                    "Hospital ID":        hosp_id,
                    "Hospital Name":      hosp_name,
                    "Phone":              hosp_phone,
                    "Email":              hosp_email,
                    "Address":            hosp_addr,
                    "Description":        hosp_desc,
                    "Dependent Facilities Count": len(hosp.get("dependentHospital", [])),
                })

                for dep in hosp.get("dependentHospital", []):
                    deps.append({
                        "Region":        region_name,
                        "City":          city_name,
                        "Hospital ID":   hosp_id,
                        "Hospital Name": hosp_name,
                        "Facility ID":   clean(dep.get("id")),
                        "Facility Name": clean(dep.get("text")),
                    })

    return hospitals, deps


# ── Write Excel ───────────────────────────────────────────────────────────────

def auto_width(ws, min_width=10, max_width=60):
    for col in ws.columns:
        max_len = 0
        col_letter = get_column_letter(col[0].column)
        for cell in col:
            try:
                val = str(cell.value) if cell.value else ""
                # Cap description columns at 80 chars for width calc
                max_len = max(max_len, min(len(val), 80))
            except Exception:
                pass
        ws.column_dimensions[col_letter].width = max(min_width, min(max_len + 2, max_width))


def write_hospitals_sheet(wb: Workbook, hospitals: list[dict]):
    ws = wb.active
    ws.title = "Hospitals"
    ws.freeze_panes = "A2"

    cols = [
        "Region ID", "Region", "City ID", "City",
        "Hospital ID", "Hospital Name", "Phone", "Email",
        "Address", "Description", "Dependent Facilities Count",
    ]

    # Header row
    for c, col_name in enumerate(cols, start=1):
        cell = ws.cell(row=1, column=c, value=col_name)
        style_cell(cell, font=HEADER_FONT, fill=HEADER_FILL,
                   alignment=CENTER, border=THIN_BORDER)

    # Data rows
    prev_region = None
    for r, row in enumerate(hospitals, start=2):
        is_alt = r % 2 == 0
        fill = ALT_FILL if is_alt else WHITE_FILL

        for c, col_name in enumerate(cols, start=1):
            val = row[col_name]
            cell = ws.cell(row=r, column=c, value=val if val != "" else None)
            style_cell(cell, font=BODY_FONT, fill=fill,
                       alignment=LEFT, border=THIN_BORDER)

        # Highlight region name column with stronger colour when region changes
        if row["Region"] != prev_region:
            prev_region = row["Region"]

    # Set description column to wrap with reasonable height hint
    for r in range(2, len(hospitals) + 2):
        ws.row_dimensions[r].height = 30

    auto_width(ws)
    # Override description column width
    ws.column_dimensions[get_column_letter(cols.index("Description") + 1)].width = 55
    ws.column_dimensions[get_column_letter(cols.index("Address") + 1)].width = 35


def write_deps_sheet(wb: Workbook, deps: list[dict]):
    ws = wb.create_sheet("Dependent Facilities")
    ws.freeze_panes = "A2"

    cols = ["Region", "City", "Hospital ID", "Hospital Name",
            "Facility ID", "Facility Name"]

    # Header row
    for c, col_name in enumerate(cols, start=1):
        cell = ws.cell(row=1, column=c, value=col_name)
        style_cell(cell, font=HEADER_FONT, fill=HEADER_FILL,
                   alignment=CENTER, border=THIN_BORDER)

    # Data rows
    for r, row in enumerate(deps, start=2):
        fill = ALT_FILL if r % 2 == 0 else WHITE_FILL
        for c, col_name in enumerate(cols, start=1):
            val = row[col_name]
            cell = ws.cell(row=r, column=c, value=val if val != "" else None)
            style_cell(cell, font=BODY_FONT, fill=fill,
                       alignment=LEFT, border=THIN_BORDER)

    auto_width(ws)


def write_summary_sheet(wb: Workbook, hospitals: list[dict], deps: list[dict]):
    ws = wb.create_sheet("Summary")

    rows = [
        ("Metric", "Count"),
        ("Total Regions",              len({h["Region"] for h in hospitals})),
        ("Total Cities / Districts",   len({h["City"] for h in hospitals})),
        ("Total Hospitals",            len(hospitals)),
        ("Total Dependent Facilities", len(deps)),
        ("Hospitals with Phone",       sum(1 for h in hospitals if h["Phone"])),
        ("Hospitals with Email",       sum(1 for h in hospitals if h["Email"])),
        ("Hospitals with Address",     sum(1 for h in hospitals if h["Address"])),
        ("Hospitals with Description", sum(1 for h in hospitals if h["Description"])),
    ]

    for r, (label, value) in enumerate(rows, start=1):
        lc = ws.cell(row=r, column=1, value=label)
        vc = ws.cell(row=r, column=2, value=value)
        if r == 1:
            style_cell(lc, font=HEADER_FONT, fill=HEADER_FILL, alignment=CENTER, border=THIN_BORDER)
            style_cell(vc, font=HEADER_FONT, fill=HEADER_FILL, alignment=CENTER, border=THIN_BORDER)
        else:
            fill = ALT_FILL if r % 2 == 0 else WHITE_FILL
            style_cell(lc, font=BODY_FONT, fill=fill, alignment=LEFT,   border=THIN_BORDER)
            style_cell(vc, font=BODY_FONT, fill=fill, alignment=CENTER, border=THIN_BORDER)

    ws.column_dimensions["A"].width = 35
    ws.column_dimensions["B"].width = 15


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    regions = fetch_data()
    hospitals, deps = parse(regions)

    print(f"  → {len(hospitals)} hospitals parsed")
    print(f"  → {len(deps)} dependent facilities parsed")

    wb = Workbook()
    write_hospitals_sheet(wb, hospitals)
    write_deps_sheet(wb, deps)
    write_summary_sheet(wb, hospitals, deps)

    wb.save(OUTPUT_FILE)
    print(f"\nSaved → {OUTPUT_FILE.resolve()}")

    # Print summary to console
    regions_count = len({h["Region"] for h in hospitals})
    cities_count  = len({h["City"] for h in hospitals})
    print(f"\n{'─'*40}")
    print(f"  Regions:              {regions_count}")
    print(f"  Cities/Districts:     {cities_count}")
    print(f"  Hospitals:            {len(hospitals)}")
    print(f"  Dependent Facilities: {len(deps)}")
    print(f"{'─'*40}")


if __name__ == "__main__":
    main()
