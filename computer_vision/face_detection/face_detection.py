import cv2
import mediapipe as mp

mp_face_detection = mp.solutions.face_detection
mp_drawing = mp.solutions.drawing_utils

face_detection = mp_face_detection.FaceDetection(
    model_selection=0,
    min_detection_confidence=0.5
)

cap = cv2.VideoCapture(0)

while True:
    ret, frame = cap.read()
    if not ret:
        print("Camera not opened")
        break

    rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
    results = face_detection.process(rgb_frame)

    face_count = 0

    if results.detections:
        for detection in results.detections:
            bboxC = detection.location_data.relative_bounding_box
            h, w, c = frame.shape
            bbox = int(bboxC.xmin * w), int(bboxC.ymin * h), \
                   int(bboxC.width * w), int(bboxC.height * h)

            cv2.rectangle(frame, bbox, (0, 255, 0), 2)
            face_count += 1

    cv2.putText(frame, f'Faces: {face_count}', (20, 50),
                cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 0, 255), 2)

    cv2.imshow("Face Detection", frame)

    if cv2.waitKey(1) & 0xFF == 27:
        break

cap.release()
cv2.destroyAllWindows()