"""
generate_charts.py
Produces business-insight charts for the tabib.gov.az healthcare network dataset.
Output: charts/ directory (6 PNG files)
"""

import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding="utf-8")

from pathlib import Path
import pandas as pd
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
from matplotlib.ticker import MaxNLocator
import warnings
warnings.filterwarnings("ignore")

# ── Paths ─────────────────────────────────────────────────────────────────────
ROOT       = Path(__file__).parent.parent
DATA_FILE  = ROOT / "data" / "data.xlsx"
CHARTS_DIR = ROOT / "charts"
CHARTS_DIR.mkdir(exist_ok=True)

# ── Brand palette ─────────────────────────────────────────────────────────────
C_DARK_BLUE   = "#1A3A5C"
C_MID_BLUE    = "#2E75B6"
C_LIGHT_BLUE  = "#AEC6E8"
C_ACCENT      = "#E8532A"   # highlight / alert
C_GOLD        = "#F2A900"   # secondary accent
C_GREY        = "#6C757D"
C_BG          = "#F7F9FC"
C_GRID        = "#DEE2E6"

FONT_TITLE    = dict(fontsize=15, fontweight="bold", color=C_DARK_BLUE, pad=14)
FONT_LABEL    = dict(fontsize=11, color=C_DARK_BLUE)
FONT_TICK     = dict(labelsize=10, colors=C_DARK_BLUE)
FONT_ANNOT    = dict(fontsize=9,  color=C_DARK_BLUE)
FONT_CAPTION  = dict(fontsize=8,  color=C_GREY, style="italic")


def fig_setup(w=13, h=7):
    fig, ax = plt.subplots(figsize=(w, h), facecolor=C_BG)
    ax.set_facecolor(C_BG)
    return fig, ax


def grid(ax, axis="x"):
    ax.grid(axis=axis, color=C_GRID, linewidth=0.8, zorder=0)
    ax.set_axisbelow(True)


def spine_clean(ax, keep=("bottom", "left")):
    for s in ["top", "right", "bottom", "left"]:
        ax.spines[s].set_visible(s in keep)
        if s in keep:
            ax.spines[s].set_color(C_GRID)


def save(fig, name, caption=""):
    if caption:
        fig.text(0.5, 0.01, caption, ha="center", **FONT_CAPTION)
    path = CHARTS_DIR / name
    fig.savefig(path, dpi=150, bbox_inches="tight", facecolor=C_BG)
    plt.close(fig)
    print(f"  Saved: {path.name}")


def short_region(name: str) -> str:
    """Strip the boilerplate suffix from region names."""
    return (name
            .replace(" tibbi ərazi bölməsi", "")
            .replace(" tibbi erazi bolmesi", "")
            .strip())


# ── Load data ─────────────────────────────────────────────────────────────────
print("Loading data …")
hosp_df = pd.read_excel(DATA_FILE, sheet_name="Hospitals")
deps_df  = pd.read_excel(DATA_FILE, sheet_name="Dependent Facilities")

hosp_df["Region Short"]  = hosp_df["Region"].apply(short_region)
hosp_df["Dep Count"]     = hosp_df["Dependent Facilities Count"].fillna(0).astype(int)

# ── Aggregations ──────────────────────────────────────────────────────────────
reg = (
    hosp_df.groupby("Region Short")
    .agg(
        Hospitals    = ("Hospital ID",  "count"),
        Deps         = ("Dep Count",    "sum"),
        Cities       = ("City",         "nunique"),
    )
    .reset_index()
)
reg["Avg Deps per Hospital"] = (reg["Deps"] / reg["Hospitals"]).round(1)
reg["Network Score"]         = reg["Deps"] / reg["Deps"].sum() * 100   # % share


# ═══════════════════════════════════════════════════════════════════════════════
# CHART 1 — Hospital Count by Region
# ═══════════════════════════════════════════════════════════════════════════════
print("\nGenerating charts …")

def chart_01_hospital_count():
    df = reg.sort_values("Hospitals", ascending=True)
    colors = [C_ACCENT if h == df["Hospitals"].max() else C_MID_BLUE for h in df["Hospitals"]]

    fig, ax = fig_setup(13, 7)
    bars = ax.barh(df["Region Short"], df["Hospitals"], color=colors, height=0.65, zorder=3)

    for bar, val in zip(bars, df["Hospitals"]):
        ax.text(bar.get_width() + 0.2, bar.get_y() + bar.get_height() / 2,
                str(val), va="center", **FONT_ANNOT)

    ax.set_xlabel("Number of Hospitals", **FONT_LABEL)
    ax.set_title("Hospital Count by Region", **FONT_TITLE)
    ax.xaxis.set_major_locator(MaxNLocator(integer=True))
    grid(ax, "x"); spine_clean(ax)
    ax.tick_params(**FONT_TICK)
    ax.set_xlim(0, df["Hospitals"].max() + 4)

    note = mpatches.Patch(color=C_ACCENT, label="Highest count")
    ax.legend(handles=[note], loc="lower right", fontsize=9)

    save(fig, "01_hospital_count_by_region.png",
         "Source: TABIB — Tibb Ərazi Bölmələri registry, March 2026")

chart_01_hospital_count()


# ═══════════════════════════════════════════════════════════════════════════════
# CHART 2 — Total Dependent Facilities by Region
# ═══════════════════════════════════════════════════════════════════════════════
def chart_02_dependent_facilities():
    df = reg.sort_values("Deps", ascending=True)
    colors = [C_ACCENT if d == df["Deps"].max() else C_MID_BLUE for d in df["Deps"]]

    fig, ax = fig_setup(13, 7)
    bars = ax.barh(df["Region Short"], df["Deps"], color=colors, height=0.65, zorder=3)

    for bar, val in zip(bars, df["Deps"]):
        ax.text(bar.get_width() + 2, bar.get_y() + bar.get_height() / 2,
                str(val), va="center", **FONT_ANNOT)

    ax.set_xlabel("Number of Dependent Facilities (Clinics, PHCs, Outpatient Units)", **FONT_LABEL)
    ax.set_title("Total Healthcare Network Size by Region\n(Dependent Facilities per Region)", **FONT_TITLE)
    grid(ax, "x"); spine_clean(ax)
    ax.tick_params(**FONT_TICK)
    ax.set_xlim(0, df["Deps"].max() + 40)

    note = mpatches.Patch(color=C_ACCENT, label="Largest network")
    ax.legend(handles=[note], loc="lower right", fontsize=9)

    save(fig, "02_dependent_facilities_by_region.png",
         "Source: TABIB — Tibb Ərazi Bölmələri registry, March 2026")

chart_02_dependent_facilities()


# ═══════════════════════════════════════════════════════════════════════════════
# CHART 3 — Avg Dependent Facilities per Hospital (Network Density)
# ═══════════════════════════════════════════════════════════════════════════════
def chart_03_avg_deps_per_hospital():
    df = reg.sort_values("Avg Deps per Hospital", ascending=True)
    THRESHOLD = reg["Avg Deps per Hospital"].mean()

    colors = []
    for v in df["Avg Deps per Hospital"]:
        if v >= THRESHOLD * 1.3:
            colors.append(C_ACCENT)
        elif v <= THRESHOLD * 0.5:
            colors.append(C_GOLD)
        else:
            colors.append(C_MID_BLUE)

    fig, ax = fig_setup(13, 7)
    bars = ax.barh(df["Region Short"], df["Avg Deps per Hospital"],
                   color=colors, height=0.65, zorder=3)

    for bar, val in zip(bars, df["Avg Deps per Hospital"]):
        ax.text(bar.get_width() + 0.3, bar.get_y() + bar.get_height() / 2,
                f"{val:.1f}", va="center", **FONT_ANNOT)

    ax.axvline(THRESHOLD, color=C_DARK_BLUE, linestyle="--", linewidth=1.4,
               label=f"National avg: {THRESHOLD:.1f}")

    ax.set_xlabel("Average Number of Dependent Facilities per Hospital", **FONT_LABEL)
    ax.set_title("Hospital Network Density by Region\n(Avg. Dependent Facilities per Hospital)", **FONT_TITLE)
    grid(ax, "x"); spine_clean(ax)
    ax.tick_params(**FONT_TICK)
    ax.set_xlim(0, df["Avg Deps per Hospital"].max() + 10)

    high  = mpatches.Patch(color=C_ACCENT, label="High density (30%+ above avg)")
    low   = mpatches.Patch(color=C_GOLD,   label="Low density (50%+ below avg)")
    avg_l = plt.Line2D([0], [0], color=C_DARK_BLUE, linestyle="--", label=f"National avg: {THRESHOLD:.1f}")
    ax.legend(handles=[high, low, avg_l], loc="lower right", fontsize=9)

    save(fig, "03_avg_deps_per_hospital.png",
         "Source: TABIB — Tibb Ərazi Bölmələri registry, March 2026")

chart_03_avg_deps_per_hospital()


# ═══════════════════════════════════════════════════════════════════════════════
# CHART 4 — Top 15 Hospitals by Dependent Facility Count
# ═══════════════════════════════════════════════════════════════════════════════
def chart_04_top_hospitals():
    df = (hosp_df[["Hospital Name", "Region Short", "Dep Count"]]
          .sort_values("Dep Count", ascending=False)
          .head(15)
          .sort_values("Dep Count", ascending=True))

    # Color by region
    regions_list = df["Region Short"].unique().tolist()
    palette = [C_DARK_BLUE, C_MID_BLUE, C_LIGHT_BLUE, C_ACCENT, C_GOLD,
               "#5B9BD5", "#70AD47", "#FF7F50", "#9B59B6", "#1ABC9C"]
    region_color = {r: palette[i % len(palette)] for i, r in enumerate(regions_list)}
    colors = [region_color[r] for r in df["Region Short"]]

    # Shorten hospital names
    df["Short Name"] = df["Hospital Name"].apply(
        lambda x: x if len(x) <= 42 else x[:40] + "…"
    )

    fig, ax = fig_setup(14, 8)
    bars = ax.barh(df["Short Name"], df["Dep Count"], color=colors, height=0.65, zorder=3)

    for bar, val in zip(bars, df["Dep Count"]):
        ax.text(bar.get_width() + 0.8, bar.get_y() + bar.get_height() / 2,
                str(val), va="center", **FONT_ANNOT)

    ax.set_xlabel("Number of Dependent Facilities", **FONT_LABEL)
    ax.set_title("Top 15 Hospitals by Network Size\n(Number of Dependent Clinics & Facilities Managed)", **FONT_TITLE)
    grid(ax, "x"); spine_clean(ax)
    ax.tick_params(**FONT_TICK)
    ax.set_xlim(0, df["Dep Count"].max() + 18)

    legend_patches = [mpatches.Patch(color=region_color[r], label=r) for r in regions_list]
    ax.legend(handles=legend_patches, loc="lower right", fontsize=8, title="Region", title_fontsize=9)

    save(fig, "04_top15_hospitals_by_network.png",
         "Source: TABIB — Tibb Ərazi Bölmələri registry, March 2026")

chart_04_top_hospitals()


# ═══════════════════════════════════════════════════════════════════════════════
# CHART 5 — Baku vs Regions: Hospitals, Deps, Cities (Grouped Bar)
# ═══════════════════════════════════════════════════════════════════════════════
def chart_05_baku_vs_regions():
    baku_row   = reg[reg["Region Short"] == "Bakı"].iloc[0]
    others_sum = reg[reg["Region Short"] != "Bakı"].sum(numeric_only=True)

    categories = ["Hospitals", "Dependent Facilities", "Cities / Districts"]
    baku_vals  = [baku_row["Hospitals"],  baku_row["Deps"],  baku_row["Cities"]]
    other_vals = [others_sum["Hospitals"], others_sum["Deps"], others_sum["Cities"]]

    x = range(len(categories))
    w = 0.36

    fig, ax = fig_setup(11, 7)
    b1 = ax.bar([i - w/2 for i in x], baku_vals,  width=w, label="Baku",            color=C_ACCENT,   zorder=3)
    b2 = ax.bar([i + w/2 for i in x], other_vals, width=w, label="All Other Regions", color=C_MID_BLUE, zorder=3)

    for bar in list(b1) + list(b2):
        ax.text(bar.get_x() + bar.get_width() / 2,
                bar.get_height() + max(other_vals) * 0.01,
                str(int(bar.get_height())),
                ha="center", **FONT_ANNOT)

    ax.set_xticks(list(x))
    ax.set_xticklabels(categories, fontsize=11)
    ax.set_ylabel("Count", **FONT_LABEL)
    ax.set_title("Baku vs All Other Regions\nHealthcare Infrastructure Comparison", **FONT_TITLE)
    ax.legend(fontsize=10, loc="upper right")
    grid(ax, "y"); spine_clean(ax)
    ax.tick_params(**FONT_TICK)

    save(fig, "05_baku_vs_regions.png",
         "Source: TABIB — Tibb Ərazi Bölmələri registry, March 2026")

chart_05_baku_vs_regions()


# ═══════════════════════════════════════════════════════════════════════════════
# CHART 6 — Stacked Bar: Hospitals vs Network Size by Region
# ═══════════════════════════════════════════════════════════════════════════════
def chart_06_stacked_coverage():
    df = reg.sort_values("Deps", ascending=True)

    fig, ax = fig_setup(14, 8)

    ax.barh(df["Region Short"], df["Deps"],
            color=C_MID_BLUE, height=0.65, label="Dependent Facilities", zorder=3)

    # Overlay: hospitals as dots on a secondary axis
    ax2 = ax.twiny()
    ax2.scatter(df["Hospitals"], df["Region Short"],
                color=C_ACCENT, s=120, zorder=5, label="Hospitals (right axis)")
    ax2.set_xlabel("Number of Hospitals", color=C_ACCENT, fontsize=11)
    ax2.tick_params(axis="x", labelcolor=C_ACCENT, labelsize=10)
    ax2.spines["top"].set_color(C_ACCENT)

    ax.set_xlabel("Total Dependent Facilities (Clinics, PHCs, Outpatient Units)", **FONT_LABEL)
    ax.set_title("Regional Healthcare Footprint\nHospitals vs Total Network of Dependent Facilities", **FONT_TITLE)
    grid(ax, "x"); spine_clean(ax)
    ax.tick_params(**FONT_TICK)

    dep_patch = mpatches.Patch(color=C_MID_BLUE,  label="Dependent Facilities")
    hosp_dot  = plt.Line2D([0], [0], marker="o", color="w",
                           markerfacecolor=C_ACCENT, markersize=9, label="Hospitals")
    ax.legend(handles=[dep_patch, hosp_dot], loc="lower right", fontsize=9)

    save(fig, "06_regional_footprint.png",
         "Source: TABIB — Tibb Ərazi Bölmələri registry, March 2026")

chart_06_stacked_coverage()


print(f"\nAll 6 charts saved to: {CHARTS_DIR.resolve()}")
