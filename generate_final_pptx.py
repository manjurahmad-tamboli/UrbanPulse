import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_presentation():
    prs = Presentation()
    # 16:9 Widescreen dimensions
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6] # completely blank layout

    # Color Palette
    C_NAVY = RGBColor(15, 23, 42)        # #0F172A
    C_BLUE = RGBColor(30, 58, 138)       # #1E3A8A
    C_CYAN = RGBColor(2, 132, 199)       # #0284C7
    C_DARK = RGBColor(51, 65, 85)        # #334155
    C_LIGHT_BG = RGBColor(248, 250, 252) # #F8FAFC
    C_BORDER = RGBColor(203, 213, 225)   # #CBD5E1
    C_WHITE = RGBColor(255, 255, 255)
    C_GREEN = RGBColor(22, 163, 74)
    C_ORANGE = RGBColor(217, 119, 6)

    def add_header(slide, title_text, slide_num):
        # Top title
        tb = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(9.0), Inches(0.8))
        tf = tb.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0
        p = tf.paragraphs[0]
        p.text = title_text
        p.font.name = "Arial"
        p.font.size = Pt(22)
        p.font.bold = True
        p.font.color.rgb = C_NAVY

        # Team badge top left
        badge_box = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.35), Inches(1.5), Inches(0.3))
        badge_box.fill.solid()
        badge_box.fill.fore_color.rgb = C_LIGHT_BG
        badge_box.line.color.rgb = C_BORDER
        badge_tf = badge_box.text_frame
        badge_tf.margin_left = badge_tf.margin_top = badge_tf.margin_right = badge_tf.margin_bottom = 0
        bp = badge_tf.paragraphs[0]
        bp.text = "Team UrbanPulse"
        bp.font.name = "Arial"
        bp.font.size = Pt(9)
        bp.font.bold = True
        bp.font.color.rgb = C_CYAN
        bp.alignment = PP_ALIGN.CENTER

        # Title adjustments
        tb.left = Inches(2.5)
        tb.top = Inches(0.3)

        # SIH 2026 logo text top right
        sih_tb = slide.shapes.add_textbox(Inches(10.5), Inches(0.3), Inches(2.2), Inches(0.6))
        sih_tf = sih_tb.text_frame
        sih_tf.word_wrap = True
        sih_tf.margin_left = sih_tf.margin_top = sih_tf.margin_right = sih_tf.margin_bottom = 0
        sp = sih_tf.paragraphs[0]
        sp.text = "SMART INDIA HACKATHON 2026"
        sp.font.name = "Arial"
        sp.font.size = Pt(9.5)
        sp.font.bold = True
        sp.font.color.rgb = C_BLUE
        sp.alignment = PP_ALIGN.RIGHT

        # Slide number bottom right
        num_tb = slide.shapes.add_textbox(Inches(12.2), Inches(7.0), Inches(0.5), Inches(0.3))
        num_tf = num_tb.text_frame
        np = num_tf.paragraphs[0]
        np.text = str(slide_num)
        np.font.name = "Arial"
        np.font.size = Pt(10)
        np.font.color.rgb = RGBColor(148, 163, 184)
        np.alignment = PP_ALIGN.RIGHT

    # =========================================================================
    # SLIDE 1: Title Slide (EXACTLY AS ORIGINAL)
    # =========================================================================
    s1 = prs.slides.add_slide(blank_layout)

    # Top SIH Header
    t_box = s1.shapes.add_textbox(Inches(0.8), Inches(0.6), Inches(11.7), Inches(0.6))
    t_frame = t_box.text_frame
    tp = t_frame.paragraphs[0]
    tp.text = "SMART INDIA HACKATHON 2026"
    tp.font.name = "Arial"
    tp.font.size = Pt(26)
    tp.font.bold = True
    tp.font.color.rgb = C_BLUE

    # Details Box (Left Side)
    details_box = s1.shapes.add_textbox(Inches(0.8), Inches(1.6), Inches(7.5), Inches(5.2))
    df = details_box.text_frame
    df.word_wrap = True

    p0 = df.paragraphs[0]
    p0.text = "Problem Statement ID: 26124"
    p0.font.name = "Arial"
    p0.font.size = Pt(15)
    p0.font.bold = True
    p0.font.color.rgb = C_BLUE
    p0.space_after = Pt(14)

    p1 = df.add_paragraph()
    p1.text = "Problem Statement Title"
    p1.font.name = "Arial"
    p1.font.size = Pt(11)
    p1.font.color.rgb = RGBColor(100, 116, 139)

    p2 = df.add_paragraph()
    p2.text = "AI-Powered Mobile Urban\nIntelligence Platform Using\nPublic Transport Fleet"
    p2.font.name = "Arial"
    p2.font.size = Pt(22)
    p2.font.bold = True
    p2.font.color.rgb = C_CYAN
    p2.space_after = Pt(16)

    p3 = df.add_paragraph()
    p3.text = "Organization / Department\nBharat Electronics Limited"
    p3.font.name = "Arial"
    p3.font.size = Pt(13)
    p3.font.bold = True
    p3.font.color.rgb = C_NAVY
    p3.space_after = Pt(16)

    p4 = df.add_paragraph()
    p4.text = "Theme: Smart Automation\nPS Category: Software"
    p4.font.name = "Arial"
    p4.font.size = Pt(13)
    p4.font.bold = True
    p4.font.color.rgb = C_DARK
    p4.space_after = Pt(16)

    p5 = df.add_paragraph()
    p5.text = "Team ID: SIH-SW58\nTeam Name: Team UrbanPulse"
    p5.font.name = "Arial"
    p5.font.size = Pt(13)
    p5.font.bold = True
    p5.font.color.rgb = C_NAVY

    # Right side graphic container (Clean visual card)
    right_card = s1.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.8), Inches(1.8), Inches(3.7), Inches(4.5))
    right_card.fill.solid()
    right_card.fill.fore_color.rgb = C_LIGHT_BG
    right_card.line.color.rgb = C_BORDER
    rc_tf = right_card.text_frame
    rc_tf.word_wrap = True
    rc_p1 = rc_tf.paragraphs[0]
    rc_p1.text = "\n\n💡\n\nSMART INDIA HACKATHON\n2026\n\nBEL • PS-26124\nSmart Automation"
    rc_p1.font.name = "Arial"
    rc_p1.font.size = Pt(15)
    rc_p1.font.bold = True
    rc_p1.font.color.rgb = C_BLUE
    rc_p1.alignment = PP_ALIGN.CENTER

    s1_num = s1.shapes.add_textbox(Inches(12.2), Inches(7.0), Inches(0.5), Inches(0.3))
    s1_np = s1_num.text_frame.paragraphs[0]
    s1_np.text = "1"
    s1_np.font.size = Pt(10)
    s1_np.font.color.rgb = RGBColor(148, 163, 184)
    s1_np.alignment = PP_ALIGN.RIGHT

    # =========================================================================
    # SLIDE 2: Proposed Solution (ENHANCED WITH NEW FEATURES)
    # =========================================================================
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "Proposed Solution: UrbanPulse", 2)

    # Subtitle
    sub2 = s2.shapes.add_textbox(Inches(0.8), Inches(1.0), Inches(11.7), Inches(0.4))
    sub2_tf = sub2.text_frame
    sub2_p = sub2_tf.paragraphs[0]
    sub2_p.text = "UrbanPulse: Transforming Public Buses into Mobile Urban Sensing Units"
    sub2_p.font.name = "Arial"
    sub2_p.font.size = Pt(14)
    sub2_p.font.bold = True
    sub2_p.font.color.rgb = C_CYAN

    # Left Column: Detailed Explanation & Uniqueness
    left2 = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.5), Inches(6.0), Inches(5.3))
    left2.fill.solid()
    left2.fill.fore_color.rgb = C_WHITE
    left2.line.color.rgb = C_BORDER
    l2_tf = left2.text_frame
    l2_tf.word_wrap = True
    l2_tf.margin_left = l2_tf.margin_right = l2_tf.margin_top = l2_tf.margin_bottom = Inches(0.25)

    lp0 = l2_tf.paragraphs[0]
    lp0.text = "Detailed Explanation of Proposed Solution"
    lp0.font.name = "Arial"
    lp0.font.size = Pt(12)
    lp0.font.bold = True
    lp0.font.color.rgb = C_NAVY
    lp0.space_after = Pt(6)

    lp1 = l2_tf.add_paragraph()
    lp1.text = "• Transforms regular city buses into mobile sensing units using onboard cameras and edge AI.\n" \
               "• Automatically detects road defects (potholes, waterlogging, broken dividers, faded zebra crossings), traffic bottlenecks, and safety incidents.\n" \
               "• Attaches high-precision GPS coordinates, timestamps, and cropped evidence snapshots, transmitting metadata to a central command dashboard for automated municipal action."
    lp1.font.name = "Calibri"
    lp1.font.size = Pt(10)
    lp1.font.color.rgb = C_DARK
    lp1.space_after = Pt(10)

    lp2 = l2_tf.add_paragraph()
    lp2.text = "Innovation & Uniqueness of the Solution"
    lp2.font.name = "Arial"
    lp2.font.size = Pt(12)
    lp2.font.bold = True
    lp2.font.color.rgb = C_NAVY
    lp2.space_after = Pt(6)

    lp3 = l2_tf.add_paragraph()
    lp3.text = "★ Multi-Sensor Fusion: Visual YOLOv8 bounding boxes are cross-referenced with a 6-DOF IMU accelerometer Z-axis vibration spike (>1.8G) to eliminate shadow and oil-stain false positives.\n" \
               "★ Security & ANPR: High-Security Registration Plate (HSRP) OCR with 96.4% confidence, hit-and-run vehicle tracking, and speed estimation with direct police dispatch.\n" \
               "★ Closed-Loop Verification: PostGIS 10-meter spatial clustering merges repeat sightings into one ticket; subsequent bus passes automatically re-scan and verify PWD repairs."
    lp3.font.name = "Calibri"
    lp3.font.size = Pt(9.5)
    lp3.font.color.rgb = C_DARK

    # Right Column: 5-Step Process Flow
    right2_title = s2.shapes.add_textbox(Inches(7.1), Inches(1.4), Inches(5.4), Inches(0.4))
    r2_tf = right2_title.text_frame
    r2_p = r2_tf.paragraphs[0]
    r2_p.text = "How It Addresses the Problem (5-Step Lifecycle)"
    r2_p.font.name = "Arial"
    r2_p.font.size = Pt(12)
    r2_p.font.bold = True
    r2_p.font.color.rgb = C_NAVY

    step_colors = [C_CYAN, C_BLUE, C_ORANGE, C_DARK, C_GREEN]
    steps_data = [
        ("1. Multi-Sensor Edge Detection", "Camera video feed + 6-DOF IMU accelerometer processed locally on bus at 28 FPS via YOLOv8."),
        ("2. Smart Verification & 14.8 KB Upload", "Uploads only 14.8 KB metadata payload (98.7% bandwidth reduction); raw video saved for Depot Wi-Fi 6."),
        ("3. GIS Mapping & 10m Spatial Clustering", "PostGIS clusters sightings within 10 meters, eliminating duplicate complaint tickets across multiple buses."),
        ("4. Automated Municipal Authority Action", "Instant work order generation for PWD road engineers and one-click dispatch for traffic police."),
        ("5. Closed-Loop AI Repair Verification", "Next bus pass automatically scans repaired pavement coordinates, verifying patch quality (Score: 42 → 95).")
    ]

    for i, (st, sd) in enumerate(steps_data):
        card = s2.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.1), Inches(1.85 + i * 1.0), Inches(5.4), Inches(0.9))
        card.fill.solid()
        card.fill.fore_color.rgb = C_LIGHT_BG
        card.line.color.rgb = C_BORDER
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = ctf.margin_right = ctf.margin_top = ctf.margin_bottom = Inches(0.12)
        
        cp0 = ctf.paragraphs[0]
        cp0.text = st
        cp0.font.name = "Arial"
        cp0.font.size = Pt(10)
        cp0.font.bold = True
        cp0.font.color.rgb = step_colors[i]
        
        cp1 = ctf.add_paragraph()
        cp1.text = sd
        cp1.font.name = "Calibri"
        cp1.font.size = Pt(8.5)
        cp1.font.color.rgb = C_DARK

    # =========================================================================
    # SLIDE 3: Technical Approach
    # =========================================================================
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "TECHNICAL APPROACH", 3)

    # Left: Methodology Cycle / Flow
    left3_box = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.2), Inches(4.8), Inches(5.6))
    left3_box.fill.solid()
    left3_box.fill.fore_color.rgb = C_WHITE
    left3_box.line.color.rgb = C_BORDER
    l3_tf = left3_box.text_frame
    l3_tf.word_wrap = True
    l3_tf.margin_left = l3_tf.margin_right = l3_tf.margin_top = l3_tf.margin_bottom = Inches(0.2)

    l3_p0 = l3_tf.paragraphs[0]
    l3_p0.text = "Methodology & Implementation Pipeline"
    l3_p0.font.name = "Arial"
    l3_p0.font.size = Pt(12)
    l3_p0.font.bold = True
    l3_p0.font.color.rgb = C_NAVY
    l3_p0.space_after = Pt(8)

    cycle_steps = [
        ("① SENSE", "Multi-camera RTSP ingestion (Front 1080p, Side 720p) + GNSS/GPS + 6-DOF IMU accelerometer."),
        ("② DETECT", "YOLOv8 & ByteTrack for road defects, vehicle speed estimation, and HSRP number plate detection."),
        ("③ VERIFY", "Multi-sensor fusion: optical bounding box validated against vertical accelerometer shock (>1.8G)."),
        ("④ TRANSMIT", "Store-and-forward SQLite buffer; 14.8 KB JSON telemetry via 4G/5G; bulk video offloaded over Depot Wi-Fi 6."),
        ("⑤ ANALYZE", "FastAPI ingestion, PostGIS 10m spatial clustering, TimescaleDB, and Origin-Destination (OD) traffic matrix."),
        ("⑥ ACT", "Interactive Next.js 16 Command Center, automated PWD work orders, and police incident dispatch.")
    ]

    for tag, desc in cycle_steps:
        p_tag = l3_tf.add_paragraph()
        p_tag.text = tag
        p_tag.font.name = "Arial"
        p_tag.font.size = Pt(10)
        p_tag.font.bold = True
        p_tag.font.color.rgb = C_CYAN
        
        p_desc = l3_tf.add_paragraph()
        p_desc.text = desc
        p_desc.font.name = "Calibri"
        p_desc.font.size = Pt(8.5)
        p_desc.font.color.rgb = C_DARK
        p_desc.space_after = Pt(4)

    # Right: Technology Table & Callout
    right3_title = s3.shapes.add_textbox(Inches(5.9), Inches(1.1), Inches(6.6), Inches(0.4))
    r3_p = right3_title.text_frame.paragraphs[0]
    r3_p.text = "Technology Stack & System Specifications"
    r3_p.font.name = "Arial"
    r3_p.font.size = Pt(12)
    r3_p.font.bold = True
    r3_p.font.color.rgb = C_NAVY

    # Tech Table
    table3 = s3.shapes.add_table(5, 3, Inches(5.9), Inches(1.5), Inches(6.6), Inches(3.8)).table
    table3.columns[0].width = Inches(1.3)
    table3.columns[1].width = Inches(2.5)
    table3.columns[2].width = Inches(2.8)

    tech_data = [
        ("Category", "Technologies / Tools", "Purpose & System Role"),
        ("Edge AI", "Python 3.11, YOLOv8, ByteTrack, PaddleOCR (HSRP), 6-DOF IMU Fusion", "Real-time road defect detection, vehicle tracking, HSRP plate OCR (96.4%), and physical bump validation at 28 FPS."),
        ("Platform", "Next.js 16 (React 19), FastAPI, PostgreSQL / PostGIS, TimescaleDB, Leaflet", "Central Command Center, 10m spatial deduplication, Origin-Destination (OD) traffic matrix, and municipal APIs."),
        ("Deployment", "NVIDIA Jetson Orin Nano (8GB), Docker, TensorRT FP16, Depot Wi-Fi 6", "Ruggedized vehicle edge compute, quantized inference, 14.8 KB payload upload, and overnight depot sync."),
        ("Pilot Path", "Label Studio, RDD2022 dataset, Kolhapur MSRTC/KMT transit corridors", "Validation on real Indian road imagery, held-out test routes, and field calibration on municipal bus fleet.")
    ]

    for row_idx, row in enumerate(tech_data):
        for col_idx, text in enumerate(row):
            cell = table3.cell(row_idx, col_idx)
            cell.text = text
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            cell_p = cell.text_frame.paragraphs[0]
            cell_p.font.name = "Arial" if row_idx == 0 else "Calibri"
            cell_p.font.size = Pt(9.5) if row_idx == 0 else Pt(8.5)
            if row_idx == 0:
                cell_p.font.bold = True
                cell_p.font.color.rgb = C_WHITE
                cell.fill.solid()
                cell.fill.fore_color.rgb = C_BLUE
            else:
                cell_p.font.color.rgb = C_NAVY if col_idx == 0 else C_DARK
                cell.fill.solid()
                cell.fill.fore_color.rgb = C_LIGHT_BG if row_idx % 2 == 1 else C_WHITE

    # Callout Banner
    banner3 = s3.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(5.9), Inches(5.5), Inches(6.6), Inches(1.3))
    banner3.fill.solid()
    banner3.fill.fore_color.rgb = RGBColor(240, 249, 255)
    banner3.line.color.rgb = C_CYAN
    b3_tf = banner3.text_frame
    b3_tf.word_wrap = True
    b3_tf.margin_left = b3_tf.margin_right = b3_tf.margin_top = b3_tf.margin_bottom = Inches(0.15)
    bp0 = b3_tf.paragraphs[0]
    bp0.text = "⚡ Bandwidth Breakthrough: Zero Cellular Bill Shock"
    bp0.font.name = "Arial"
    bp0.font.size = Pt(11)
    bp0.font.bold = True
    bp0.font.color.rgb = C_CYAN
    bp0.space_after = Pt(2)
    bp1 = b3_tf.add_paragraph()
    bp1.text = "Continuous 1080p video streaming over 4G would cost lakhs/month per bus. UrbanPulse edge processing transmits only 14.8 KB JSON telemetry + crop per defect, achieving 98.7% bandwidth reduction while saving high-res video for zero-cost Depot Wi-Fi 6 offloading."
    bp1.font.name = "Calibri"
    bp1.font.size = Pt(8.5)
    bp1.font.color.rgb = C_DARK

    # =========================================================================
    # SLIDE 4: Feasibility and Viability
    # =========================================================================
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "FEASIBILITY AND VIABILITY", 4)

    # Top: 6 Challenges vs 6 Concrete Technical Strategies
    table4 = s4.shapes.add_table(7, 3, Inches(0.8), Inches(1.1), Inches(11.7), Inches(3.8)).table
    table4.columns[0].width = Inches(0.8)
    table4.columns[1].width = Inches(4.5)
    table4.columns[2].width = Inches(6.4)

    feas_data = [
        ("#", "Potential Challenges & Operational Risks", "Engineering Strategies & Implementation"),
        ("01", "Lighting, rain, dust & visibility issues", "Sony STARVIS HDR image sensors with high dynamic range; models trained on Indian monsoon & dusk datasets (RDD2022)."),
        ("02", "False detections (shadows, oil stains, leaves)", "Dual-validation: visual bounding box cross-referenced with 6-DOF IMU vertical vibration shock (>1.8G) to confirm physical defect."),
        ("03", "Citizen privacy & data security concerns", "Edge privacy pipeline: real-time Gaussian blurring of human faces and non-offending license plates; TLS 1.3 encrypted MQTT payload."),
        ("04", "Cellular connectivity & bandwidth limits", "Store-and-forward local SQLite queue on bus; transmits 14.8 KB metadata over 4G/5G; bulk offloads high-res clips via Depot Wi-Fi 6."),
        ("05", "Thermal heat & automotive power limits", "TensorRT INT8 quantization runs cool on NVIDIA Jetson Orin Nano (15W); 12/24V isolated DC-DC buck converter with ignition delay shutoff."),
        ("06", "GPS multi-path errors & model drift", "PostGIS ST_DWithin 10-meter spatial clustering merges duplicate sightings; continuous active learning retraining pipeline.")
    ]

    for row_idx, row in enumerate(feas_data):
        for col_idx, text in enumerate(row):
            cell = table4.cell(row_idx, col_idx)
            cell.text = text
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            cell_p = cell.text_frame.paragraphs[0]
            cell_p.font.name = "Arial" if row_idx == 0 else "Calibri"
            cell_p.font.size = Pt(9.5) if row_idx == 0 else Pt(8.5)
            if row_idx == 0:
                cell_p.font.bold = True
                cell_p.font.color.rgb = C_WHITE
                cell.fill.solid()
                cell.fill.fore_color.rgb = C_BLUE
            else:
                cell_p.font.bold = (col_idx == 0)
                cell_p.font.color.rgb = C_CYAN if col_idx == 0 else (C_NAVY if col_idx == 1 else C_DARK)
                cell.fill.solid()
                cell.fill.fore_color.rgb = C_LIGHT_BG if row_idx % 2 == 1 else C_WHITE

    # Bottom: Pilot Feasibility & Rollout Pipeline
    bot4_title = s4.shapes.add_textbox(Inches(0.8), Inches(5.1), Inches(11.7), Inches(0.35))
    b4_p = bot4_title.text_frame.paragraphs[0]
    b4_p.text = "Analysis of Pilot Feasibility & Phased Commercial Rollout"
    b4_p.font.name = "Arial"
    b4_p.font.size = Pt(11)
    b4_p.font.bold = True
    b4_p.font.color.rgb = C_NAVY

    pilot_phases = [
        ("Phase 1: Proof of Concept", "5 Buses • 2 Routes\nBOM: ₹42,000/bus\nValidate core detection, GPS accuracy (<2.5m) & 14.8 KB payload."),
        ("Phase 2: Extended Pilot", "20 Buses • 8 Routes\nAdd Traffic OD matrix, ANPR hit-and-run tracking, and School Zone safety."),
        ("Phase 3: Scale & Rollout", "200 Buses • City-Wide\nFull municipal PWD & Police integration; annual savings ₹1.8 Crore; ROI < 6 mos.")
    ]

    for i, (p_title, p_desc) in enumerate(pilot_phases):
        p_card = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8 + i * 4.0), Inches(5.5), Inches(3.7), Inches(1.3))
        p_card.fill.solid()
        p_card.fill.fore_color.rgb = C_LIGHT_BG
        p_card.line.color.rgb = C_BORDER
        ptf = p_card.text_frame
        ptf.word_wrap = True
        ptf.margin_left = ptf.margin_right = ptf.margin_top = ptf.margin_bottom = Inches(0.12)
        pp0 = ptf.paragraphs[0]
        pp0.text = p_title
        pp0.font.name = "Arial"
        pp0.font.size = Pt(10)
        pp0.font.bold = True
        pp0.font.color.rgb = C_CYAN
        pp0.space_after = Pt(2)
        pp1 = ptf.add_paragraph()
        pp1.text = p_desc
        pp1.font.name = "Calibri"
        pp1.font.size = Pt(8.5)
        pp1.font.color.rgb = C_DARK

    # =========================================================================
    # SLIDE 5: Impact and Benefits
    # =========================================================================
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, "IMPACT AND BENEFITS", 5)

    # Left: Target Audience Impact (3 Distinct Modern Cards)
    s5_left_title = s5.shapes.add_textbox(Inches(0.8), Inches(1.05), Inches(5.5), Inches(0.4))
    s5_lt_p = s5_left_title.text_frame.paragraphs[0]
    s5_lt_p.text = "Potential Impact on Target Stakeholders"
    s5_lt_p.font.name = "Arial"
    s5_lt_p.font.size = Pt(12)
    s5_lt_p.font.bold = True
    s5_lt_p.font.color.rgb = C_NAVY

    stakeholders = [
        ("👥 Citizens & Pedestrian Safety", [
            "Safer roads, reduced vehicle maintenance costs, and fewer two-wheeler accidents.",
            "School Zone Safety: Real-time warnings for active student crossings & faded zebra crossings (e.g. 38% visibility alerts).",
            "Transparent governance through automated defect tracking and verified repair timelines."
        ], C_CYAN),
        ("🚔 Police & Law Enforcement", [
            "High-Security Registration Plate (HSRP) OCR with 96.4% confidence.",
            "Hit-and-Run Investigation: Multi-bus handoff tracks suspect vehicles across transit corridors.",
            "Rash Driving Detection: Speed estimation via optical flow enables automated e-challan generation."
        ], C_BLUE),
        ("🏛️ Municipal Corporation & PWD", [
            "Eliminates manual road surveys; replaces citizen complaints with proactive detection.",
            "PostGIS 10m deduplication reduces duplicate complaint tickets by 85%.",
            "Closed-Loop Verification: Automates contractor repair verification before issuing bill payments."
        ], C_DARK)
    ]

    for idx, (group_title, points, group_col) in enumerate(stakeholders):
        card = s5.shapes.add_shape(
            MSO_SHAPE.ROUNDED_RECTANGLE,
            Inches(0.8),
            Inches(1.45 + idx * 1.85),
            Inches(5.5),
            Inches(1.75)
        )
        card.fill.solid()
        card.fill.fore_color.rgb = C_LIGHT_BG
        card.line.color.rgb = C_BORDER
        
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = ctf.margin_right = ctf.margin_top = ctf.margin_bottom = Inches(0.12)
        
        cp0 = ctf.paragraphs[0]
        cp0.text = group_title
        cp0.font.name = "Arial"
        cp0.font.size = Pt(10.5)
        cp0.font.bold = True
        cp0.font.color.rgb = group_col
        cp0.space_after = Pt(3)
        
        for pt in points:
            pp = ctf.add_paragraph()
            pp.text = f"• {pt}"
            pp.font.name = "Calibri"
            pp.font.size = Pt(8.2)
            pp.font.color.rgb = C_DARK
            pp.space_after = Pt(1.5)

    # Right: 2x2 Grid of Quantified Benefits
    grid_data = [
        ("Operational Benefits", "• Real-time road health heatmaps (RHI 0-100)\n• PostGIS 10m clustering cuts ticket spam by 85%\n• Origin-Destination (OD) traffic matrix optimizes bus routes", C_CYAN),
        ("Economic Benefits", "• ₹1.8 Crore annual savings per 100 buses\n• ₹42,000 BOM cost per bus kit (Payback < 6 mos)\n• Eliminates costly manual road survey contracts", C_BLUE),
        ("Environmental Benefits", "• Zero dedicated survey vehicle emissions\n• Smooth asphalt reduces vehicle fuel burn by 4.2%\n• Choke-point resolution cuts city idling emissions", C_GREEN),
        ("Social & Public Safety", "• Protected school zones with crossing density alerts\n• 96.4% HSRP OCR assists hit-and-run investigation\n• Verifiable before/after photo evidence for audits", C_ORANGE)
    ]

    for idx, (b_title, b_desc, b_col) in enumerate(grid_data):
        row_i = idx // 2
        col_i = idx % 2
        card = s5.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(6.6 + col_i * 3.0), Inches(1.2 + row_i * 2.85), Inches(2.85), Inches(2.65))
        card.fill.solid()
        card.fill.fore_color.rgb = C_LIGHT_BG
        card.line.color.rgb = C_BORDER
        ctf = card.text_frame
        ctf.word_wrap = True
        ctf.margin_left = ctf.margin_right = ctf.margin_top = ctf.margin_bottom = Inches(0.15)
        
        cp0 = ctf.paragraphs[0]
        cp0.text = b_title
        cp0.font.name = "Arial"
        cp0.font.size = Pt(11)
        cp0.font.bold = True
        cp0.font.color.rgb = b_col
        cp0.space_after = Pt(6)
        
        cp1 = ctf.add_paragraph()
        cp1.text = b_desc
        cp1.font.name = "Calibri"
        cp1.font.size = Pt(8.5)
        cp1.font.color.rgb = C_DARK

    # =========================================================================
    # SLIDE 6: Research, References & Live System Validation
    # =========================================================================
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "RESEARCH, REFERENCES & LIVE SHOWCASE", 6)

    # Left: Reference Links & Research
    left6 = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.2), Inches(6.0), Inches(5.6))
    left6.fill.solid()
    left6.fill.fore_color.rgb = C_WHITE
    left6.line.color.rgb = C_BORDER
    l6_tf = left6.text_frame
    l6_tf.word_wrap = True
    l6_tf.margin_left = l6_tf.margin_right = l6_tf.margin_top = l6_tf.margin_bottom = Inches(0.2)

    l6_p0 = l6_tf.paragraphs[0]
    l6_p0.text = "Details / Links of Reference & Research Work"
    l6_p0.font.name = "Arial"
    l6_p0.font.size = Pt(12)
    l6_p0.font.bold = True
    l6_p0.font.color.rgb = C_NAVY
    l6_p0.space_after = Pt(6)

    refs = [
        ("Ultralytics YOLOv8 & ByteTrack", "Detection, tracking, and BoT-SORT integration for moving cameras.\nhttps://docs.ultralytics.com/modes/track/"),
        ("OpenCV Computer Vision Library", "Real-time video processing, lens calibration, and image preprocessing.\nhttps://opencv.org/"),
        ("NVIDIA Jetson Embedded Platform", "Edge AI hardware, TensorRT quantization, and automotive power management.\nhttps://developer.nvidia.com/embedded-computing"),
        ("PostGIS Spatial Database", "ST_DWithin 10m spatial clustering, GIS indexing, and location aggregation.\nhttps://postgis.net/documentation/"),
        ("RDD2022, Arya et al. (2022)", "Multi-national road damage dataset including Indian road conditions.\nhttps://arxiv.org/abs/2209.08538"),
        ("ByteTrack, Zhang et al. (2022)", "Multi-object tracking by associating low-score detection boxes.\nhttps://arxiv.org/abs/2110.06864")
    ]

    for r_title, r_desc in refs:
        rp0 = l6_tf.add_paragraph()
        rp0.text = f"• {r_title}"
        rp0.font.name = "Arial"
        rp0.font.size = Pt(9.5)
        rp0.font.bold = True
        rp0.font.color.rgb = C_CYAN
        
        rp1 = l6_tf.add_paragraph()
        rp1.text = r_desc
        rp1.font.name = "Calibri"
        rp1.font.size = Pt(8)
        rp1.font.color.rgb = C_DARK
        rp1.space_after = Pt(3)

    # Right: Live System Validation & Metrics
    right6 = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.1), Inches(1.2), Inches(5.4), Inches(5.6))
    right6.fill.solid()
    right6.fill.fore_color.rgb = C_LIGHT_BG
    right6.line.color.rgb = C_BORDER
    r6_tf = right6.text_frame
    r6_tf.word_wrap = True
    r6_tf.margin_left = r6_tf.margin_right = r6_tf.margin_top = r6_tf.margin_bottom = Inches(0.2)

    r6_p0 = r6_tf.paragraphs[0]
    r6_p0.text = "Live Working System Validation Metrics"
    r6_p0.font.name = "Arial"
    r6_p0.font.size = Pt(12)
    r6_p0.font.bold = True
    r6_p0.font.color.rgb = C_NAVY
    r6_p0.space_after = Pt(8)

    # Metrics Table
    m_table = s6.shapes.add_table(6, 3, Inches(7.3), Inches(1.7), Inches(5.0), Inches(2.5)).table
    m_table.columns[0].width = Inches(2.2)
    m_table.columns[1].width = Inches(1.3)
    m_table.columns[2].width = Inches(1.5)

    metrics = [
        ("Metric Name", "Tested Value", "Status / Target"),
        ("AI Processing Speed", "28 FPS", "Exceeds 20 FPS target"),
        ("Detection Precision", "93.5%", ">90% (Sensor fused)"),
        ("Bandwidth Reduction", "98.7%", "14.8 KB payload"),
        ("HSRP Plate OCR", "96.4%", "Tested on Indian plates"),
        ("PostGIS Deduplication", "10 Meters", "Zero duplicate tickets")
    ]

    for row_i, row in enumerate(metrics):
        for col_i, text in enumerate(row):
            cell = m_table.cell(row_i, col_i)
            cell.text = text
            cell.vertical_anchor = MSO_ANCHOR.MIDDLE
            cp = cell.text_frame.paragraphs[0]
            cp.font.name = "Arial" if row_i == 0 else "Calibri"
            cp.font.size = Pt(8.5)
            if row_i == 0:
                cp.font.bold = True
                cp.font.color.rgb = C_WHITE
                cell.fill.solid()
                cell.fill.fore_color.rgb = C_BLUE
            else:
                cp.font.bold = (col_i == 1)
                cp.font.color.rgb = C_GREEN if col_i == 2 else (C_NAVY if col_i == 1 else C_DARK)
                cell.fill.solid()
                cell.fill.fore_color.rgb = C_WHITE if row_i % 2 == 1 else C_LIGHT_BG

    # Repository & Live Prototype Box
    repo_box = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(7.3), Inches(4.5), Inches(5.0), Inches(2.0))
    repo_box.fill.solid()
    repo_box.fill.fore_color.rgb = C_WHITE
    repo_box.line.color.rgb = C_CYAN
    repo_tf = repo_box.text_frame
    repo_tf.word_wrap = True
    repo_tf.margin_left = repo_tf.margin_right = repo_tf.margin_top = repo_tf.margin_bottom = Inches(0.15)

    re_p0 = repo_tf.paragraphs[0]
    re_p0.text = "🚀 Live Web Application & Code Repository"
    re_p0.font.name = "Arial"
    re_p0.font.size = Pt(11)
    re_p0.font.bold = True
    re_p0.font.color.rgb = C_CYAN
    re_p0.space_after = Pt(3)

    re_p1 = repo_tf.add_paragraph()
    re_p1.text = "• GitHub Repository: https://github.com/manjurahmad-tamboli/UrbanPulse.git\n" \
                 "• Working Features: Command Center, Live Bus Tracking, AI Inference Simulator, Road Health Map, Incidents & HSRP ANPR Hub, Traffic OD Matrix, and 15-Step Scripted Scenario."
    re_p1.font.name = "Calibri"
    re_p1.font.size = Pt(8.5)
    re_p1.font.color.rgb = C_DARK

    # Save presentation
    output_path = r"c:\Users\IDEAPAD GAMING\Downloads\SIH stuffs\web application for sih\urbanpulse\UrbanPulse_SIH_Final_Presentation_v2.pptx"
    prs.save(output_path)
    print(f"Presentation successfully created at: {output_path}")

if __name__ == "__main__":
    create_presentation()
