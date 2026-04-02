#  The Prism: News Analysis App

**The Prism** is a news analysis platform that never takes sides but shows all sides. It splits news articles into their core ideological components, providing a neutral factual summary followed by evaluations through Liberal, Conservative, and Centrist lenses.

![The Prism Screenshot](https://picsum.photos/seed/prism-news/1200/600)

## 🚀 Features

- **Neutral Factual Summary:** A strictly objective overview of events (Who, What, When, Where, Why).
- **Triple-Lens Analysis:**
    - 🔵 **Liberal / Progressive:** Focuses on social justice, systemic barriers, and collective action.
    - 🔴 **Conservative:** Emphasizes individual liberty, free markets, and traditional institutions.
    - ⚪ **Centrist / Moderate:** Prioritizes pragmatism, evidence-based policy, and bipartisan compromise.
- **Perspective Comparison:** Highlights areas of agreement, core value clashes, and potential "centrist bridges."
- **AI-Powered:** Utilizes Google's Gemini models for high-fidelity ideological analysis.
- **Exportable Reports:** Print or save analysis results as PDF.

## 🛠️ Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4.0](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **AI SDK:** [@google/genai](https://www.npmjs.com/package/@google/genai)
- **Icons:** [Lucide React](https://lucide.dev/)

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/the-prism.git
   cd the-prism
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

## 📖 Usage

1. Paste a news article text or a URL into the input area.
2. Click **"Analyze Article"**.
3. Review the factual summary and the different ideological perspectives.
4. Use the **"Perspective Comparison"** to understand the nuances of the debate.

## ⚖️ Methodology

The Prism uses a strict system instruction set for the AI model to ensure:
- **Vocabulary Isolation:** Each lens uses its own distinct set of values and terms.
- **Fact-First Approach:** Interpretation never precedes the factual summary.
- **Non-Judgmental Stance:** The app acts as a mirror, not a judge.

## 📄 License

This project is licensed under the Apache-2.0 License - see the [LICENSE](LICENSE) file for details.

---

*Built with ❤️ using Google AI Studio.*
