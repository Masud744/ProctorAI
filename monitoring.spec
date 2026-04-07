# -*- mode: python ; coding: utf-8 -*-

block_cipher = None

a = Analysis(
    ['main.py'],
    pathex=['.'],
    binaries=[],
    datas=[
        ('yolov8n.pt', '.'),
        ('computer_vision/behavior_analysis/attention_score.py', 'computer_vision/behavior_analysis'),
        ('computer_vision/behavior_analysis/suspicious_score.py', 'computer_vision/behavior_analysis'),
    ],
    hiddenimports=[
        'cv2',
        'mediapipe',
        'ultralytics',
        'tkinter',
        'requests',
        'numpy',
        'collections',
        'threading',
        'computer_vision.behavior_analysis.attention_score',
        'computer_vision.behavior_analysis.suspicious_score',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[
        'backend',
        'matplotlib',
        'scipy',
        'pandas',
    ],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='AI_Exam_Monitor',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
)

coll = COLLECT(
    exe,
    a.binaries,
    a.zipfiles,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='AI_Exam_Monitor',
)