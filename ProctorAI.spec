# -*- mode: python ; coding: utf-8 -*-


a = Analysis(
    ['main.py'],
    pathex=[],
    binaries=[],
    datas=[('yolov8n.pt', '.'), ('computer_vision', 'computer_vision')],
    hiddenimports=['cv2', 'cv2.cv2', 'mediapipe', 'mediapipe.solutions', 'mediapipe.tasks', 'mediapipe.tasks.vision', 'numpy', 'numpy.core', 'numpy.linalg', 'ultralytics', 'ultralytics.nn.tasks', 'computer_vision.behavior_analysis.attention_score', 'computer_vision.behavior_analysis.suspicious_score'],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)

exe = EXE(
    pyz,
    a.scripts,
    [],
    exclude_binaries=True,
    name='ProctorAI',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=False,
    disable_windowed_traceback=False,
    argv_emulation=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)
coll = COLLECT(
    exe,
    a.binaries,
    a.datas,
    strip=False,
    upx=True,
    upx_exclude=[],
    name='ProctorAI',
)
