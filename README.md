# 🌿 KrishiSage

### Trustworthy Crop Disease Intelligence from Leaf Images

KrishiSage is an AI-powered crop disease detection project designed to help farmers identify potential plant diseases from leaf images and access understandable, actionable guidance.

The goal is to make crop-health information more accessible through explainable AI, uncertainty-aware predictions, and multilingual support.

## ✨ Key Features

* **AI-Based Disease Detection:** Analyze uploaded leaf images to predict possible crop diseases.
* **Top-3 Predictions:** Present the most likely disease classes for comparison.
* **Explainable AI:** Use Grad-CAM heatmaps to visualize image regions that influence model predictions.
* **Uncertainty Awareness:** Flag unclear or unsupported images instead of presenting every prediction as certain.
* **Multilingual Guidance:** Provide farmer-friendly guidance in supported regional languages, including Hindi and Marathi.
* **Treatment and Prevention Information:** Present curated recommendations intended to support informed crop-care decisions.

## 🎯 Project Objectives
1. Make crop disease identification more accessible to farmers through AI-powered image analysis.
2. Improve prediction transparency using explainable AI and uncertainty-aware results.
3. Bridge the gap between technical disease predictions and practical, easy-to-understand crop-care guidance.
4. Encourage informed agricultural decisions through multilingual and farmer-friendly information.

## 🔄 How It Works

1. Capture or upload a crop leaf image.
2. Check whether the image is suitable for analysis.
3. Run the image through the trained disease-classification model.
4. Display the top predicted classes and confidence scores.
5. Generate a Grad-CAM visualization to help explain the prediction.
6. Present relevant crop-care guidance in the selected language.

## 🧰 Proposed Technology Stack

* **Frontend:** React
* **Backend:** Python and Flask
* **Machine Learning:** TensorFlow/Keras with a MobileNet-family model
* **Explainability:** Grad-CAM
* **Image Processing:** OpenCV
* **Dataset Research:** PlantVillage and other suitable crop-image datasets

*The final stack and dataset depend on the implemented version of the project.*

## 📊 Validation Plan

Model performance will be evaluated using:

* Macro-F1 Score
* Top-3 Accuracy
* Per-class Precision and Recall
* Confusion Matrix
* Expected Calibration Error (ECE)
* Inference Latency
* Testing on real-world field images

Performance targets will be reported as achieved results only after testing.

## 🌱 Future Scope

* Support for additional crops and disease classes
* Improved performance on real-world field photographs
* Disease severity estimation
* Expanded regional-language support
* Offline or low-connectivity support, where feasible

## ⚠️ Disclaimer

KrishiSage is intended as a crop-health decision-support tool. Predictions may be incorrect, especially for poor-quality images or unfamiliar conditions. Users should verify important diagnoses and treatment decisions with qualified agricultural experts. Treatment recommendations should be crop-specific and follow approved local guidance.

## 👩‍💻 Project

**Project Name:** KrishiSage
**Domain:** Artificial Intelligence · Machine Learning · Smart Agriculture

---

*Building more accessible and explainable crop-health intelligence.*
