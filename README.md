# AI Assistant

An intelligent web application that uses OpenAI's GPT-3.5-turbo to help users with code-related tasks. Whether you need to debug code, explain concepts, generate code, or have general conversations, AI Code Fixer provides an intuitive interface powered by advanced AI capabilities.

## Features

- **Multiple Modes**: 
  - 💬 **Chat Mode** - Ask questions and get answers in plain English
  - ⌨️ **Code Mode** - Fix code, explain code logic, and generate new code
  
- **Smart UI**:
  - Dark-themed interface with a modern design
  - Real-time message streaming with AI responses
  - Session-based message history (stored in browser)
  - Suggestion templates for quick interactions
  - Loading indicators for pending responses
  
- **Full-Stack Architecture**:
  - React + TypeScript frontend for type-safe development
  - FastAPI backend with async request handling
  - CORS-enabled for secure frontend-backend communication

## Tech Stack

### Frontend
- **React 19.2** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Lightning-fast build tool
- **React Query** - State management for server data
- **Material-UI (Joy UI)** - Component library
- **Axios** - HTTP client
- **ESLint** - Code quality

### Backend
- **FastAPI** - Modern Python web framework
- **LangChain** - AI/LLM orchestration
- **OpenAI API** - GPT-3.5-turbo model
- **Pydantic** - Data validation
- **Python 3.13+** - Programming language

## Project Structure

```
AI-Code-Fixer/
├── frontend/                 # React + TypeScript frontend
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── Prompt-Input.jsx        # Input form with mode selector
│   │   │   ├── Prompt-Response.jsx     # Response display card
│   │   │   └── Prompt-Loader.jsx       # Loading indicator
│   │   ├── hooks/           # Custom React hooks
│   │   │   ├── useQuery.ts             # React Query setup
│   │   │   └── useFunctions.ts         # API functions
│   │   ├── lib/             # Library configurations
│   │   │   └── react-query.ts
│   │   ├── utils/           # Utility functions
│   │   ├── App.tsx          # Main app component
│   │   └── main.tsx         # Entry point
│   ├── package.json         # Frontend dependencies
│   ├── vite.config.ts       # Vite configuration
│   └── tsconfig.json        # TypeScript configuration
│
├── backend/                  # FastAPI backend
│   ├── main.py              # API endpoints and LLM setup
│   └── requirements.txt      # Python dependencies
│
└── README.md                # This file
```

## Prerequisites

- **Python 3.13+** (for backend)
- **Node.js 18+** (for frontend)
- **npm** or **yarn** (package manager)
- **OpenAI API Key** (get one from [platform.openai.com](https://platform.openai.com))

## Installation

### 1. Clone the Repository
```bash
git clone <repository-url>
cd AI-Code-Fixer
```

### 2. Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\activate  # Windows
# or
source venv/bin/activate  # macOS/Linux

# Install dependencies
pip install -r requirements.txt
```

### 3. Frontend Setup

```bash
cd ../frontend

# Install dependencies
npm install
# or
yarn install
```

## Configuration

### Environment Variables

Create a `.env` file in the `backend/` directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

**How to get your OpenAI API Key:**
1. Go to [platform.openai.com](https://platform.openai.com)
2. Sign up or log in
3. Navigate to "API keys" section
4. Create a new secret key
5. Copy and paste it into your `.env` file

## Running the Application

### Backend (FastAPI Server)

```bash
cd backend

# Activate virtual environment (if not already activated)
.\venv\Scripts\activate  # Windows

# Start the server with auto-reload
uvicorn main:app --reload

# Server will be available at http://127.0.0.1:8000
```

### Frontend (React App)

In a new terminal:

```bash
cd frontend

# Start development server with hot-reload
npm run dev
# or
yarn dev

# Frontend will be available at http://localhost:5173
```

## API Endpoints

### Health Check
- **GET** `/health`
  - Returns server status
  - Response: `{ "Message": "AI-backend is running" }`

### Query Processing
- **POST** `/query`
  - Sends code/text with a mode to the AI
  - Request Body:
    ```json
    {
      "code": "your text or code here",
      "mode": "chat" or "code"
    }
    ```
  - Response:
    ```json
    {
      "response": "AI's response here"
    }
    ```

## Usage

1. **Open the frontend** at `http://localhost:5173`
2. **Select a mode**:
   - Choose **Chat** for general questions
   - Choose **Code** for code-related tasks
3. **Enter your request** in the text area (max 2000 characters)
4. **Submit** and wait for the AI response
5. **View history** - Previous messages are stored in your browser's session storage

### Example Use Cases

**Chat Mode:**
- "Explain React hooks"
- "Summarize this text in 3 points"
- "Give me ideas for a project"

**Code Mode:**
- "Debug this code: `function add(a, b) { return a + b; }`"
- "Generate a function to calculate factorial"
- "Explain what this function does"

## AI Assistant Behavior

The AI is configured with specific instructions:

- **Chat requests** → Responds as a helpful assistant in plain English
- **Code requests** → Fixes bugs, generates code, and provides explanations
- **Mixed content** → Smart detection to avoid unnecessary code generation

The default model is **GPT-3.5-turbo** with a temperature of **0.7** (balanced creativity and determinism).

## Features Walkthrough

### Message History
- Messages are stored in browser's `sessionStorage`
- History persists during your session
- Clear browser data to reset history

### Responsive UI
- Works on desktop, tablet, and mobile devices
- Dark theme for eye comfort
- Smooth animations and transitions

### Error Handling
- Clear error messages if API fails
- Graceful fallback if OpenAI API is unavailable
- Input validation (max 2000 characters)

## Development

### Frontend Development

```bash
cd frontend

# Run linter
npm run lint

# Build for production
npm run build

# Preview production build locally
npm run preview
```

### Backend Development

Modify `backend/main.py` to:
- Add new endpoints
- Change the LLM model (currently using gpt-3.5-turbo)
- Adjust temperature for different response styles
- Update system prompts

## Troubleshooting

### "TypeError: str expected, not NoneType"
- **Cause**: `OPENAI_API_KEY` environment variable not set
- **Solution**: Create a `.env` file in the backend directory with your API key

### "Connection refused" when frontend tries to reach backend
- **Cause**: Backend server not running or wrong port
- **Solution**: Ensure backend is running with `uvicorn main:app --reload`

### CORS errors
- **Cause**: Frontend and backend origins not matching
- **Solution**: Frontend is configured to access `http://127.0.0.1:8000`. Ensure backend is running on this address

### No response from AI
- **Cause**: Invalid or expired OpenAI API key
- **Solution**: Check your `.env` file and verify the API key is valid

## Future Enhancements

- [ ] Persistent message history (database)
- [ ] User authentication
- [ ] Multiple AI models selection
- [ ] Code syntax highlighting
- [ ] Export conversation as markdown/PDF
- [ ] Rate limiting
- [ ] Usage analytics
- [ ] Docker containerization

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is open source and available under the MIT License.

## Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing issues for solutions
- Review the troubleshooting section above

## Acknowledgments

- [OpenAI](https://openai.com) for GPT-3.5-turbo API
- [FastAPI](https://fastapi.tiangolo.com) for the backend framework
- [React](https://react.dev) and [Vite](https://vitejs.dev) for frontend tooling
- [LangChain](https://www.langchain.com) for LLM orchestration
- [Material-UI](https://mui.com) for component design

---

**Happy coding! 🚀**
