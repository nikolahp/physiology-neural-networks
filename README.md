# From Biological to Artificial Neural Networks

Interactive teaching resource that uses visual cortex knowledge to scaffold artificial neural network concepts for physiology students.

Supplemental material for: Hadzi-Petrushev N, Mladenov M, Stojchevski R, Avtanski D. Using Visual Cortex Knowledge to Scaffold Artificial Neural Network Concepts.

## Live Demo

**[Launch the interactive app →](https://nikolahp.github.io/physiology-neural-networks/)**

No installation required. Works in any modern browser on desktop and mobile.

## What This Is

A two-layer artificial neural network (784→10, softmax) that classifies 28×28 grayscale images of clothing items, built to run entirely in the browser. The app is designed for physiology students and maps each computational component onto a familiar biological mechanism:

| Artificial concept | Biological analogue |
|---|---|
| Input layer | Photoreceptor signal transduction |
| Weights | Synaptic strength (EPSP/IPSP) |
| Bias | Resting membrane potential |
| Weighted sum | Spatial and temporal summation |
| Activation function | Threshold of excitation |
| Softmax | Lateral inhibition / winner-takes-all |
| Training (gradient descent) | Synaptic plasticity / Hebbian learning |
| Overfitting | Pareidolia |
| Deep network layers | Visual cortex hierarchy (V1→V2→V4→IT) |

## Interactive Modules

1. **From images to numbers** — Draw on a 28×28 canvas or browse training examples; observe pixel values in real time
2. **Weights** — Inspect weight matrices for all 10 neurons, visualized as excitatory (green) and inhibitory (red) patterns
3. **Softmax** — Watch the probability distribution update live as you draw
4. **Training** — Train the network, observe the loss curve, and compare training vs. test accuracy to see overfitting emerge
5. **Deep networks** — Compare the V1→V2→V4→IT cortical hierarchy with deep network layer structure

## Files

- `index.html` — Standalone app (open directly in a browser or serve via GitHub Pages)
- `web_app_interactive.jsx` — React source code

## Technical Details

- Built with React 18, compiled in-browser via Babel standalone
- No build step, no server, no dependencies to install
- 500 procedurally generated training images + 100 test images (Fashion-MNIST format, Xiao et al. 2017)
- Genuine gradient descent training with cross-entropy loss
- Responsive design (desktop, tablet, mobile)

## Usage

**Option 1 — GitHub Pages (recommended):** The app is live at the link above.

**Option 2 — Local:** Download `index.html` and open it in any browser.

**Option 3 — Classroom:** Share the GitHub Pages URL with students. No accounts, downloads, or installations needed.

## License

MIT

## Citation

If you use this resource in teaching or research, please cite:

> Hadzi-Petrushev N, Mladenov M, Stojchevski R, Avtanski D. Using Visual Cortex Knowledge to Scaffold Artificial Neural Network Concepts. Advances in Physiology Education (submitted).
