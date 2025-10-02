# main.py
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI
from dotenv import load_dotenv

# Load the API key from our .env file
load_dotenv()

# Initialize our FastAPI application
app = FastAPI()

# Add CORS middleware to allow our frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allows all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Set up the client to talk to OpenRouter
client = OpenAI(
  base_url="https://openrouter.ai/api/v1",
  api_key=os.getenv("OPENROUTER_API_KEY"),
)

# Define the structure of the data we expect from the frontend
class JournalEntry(BaseModel):
    text: str

# Define a simple root endpoint to check if the server is running
@app.get("/")
def read_root():
    return {"Status": "MindScribe Pro API is running."}

# This is our main AI endpoint for The Guide
@app.post("/analyze/challenger")
async def analyze_guide_agent(entry: JournalEntry):
    try:
        # The prompt that defines the AI's personality and task
        system_prompt = "You are The Challenger, a cognitive AI assistant based on CBT. Your role is to read the user's entry, identify one potential cognitive distortion or limiting belief, and gently challenge it with a thoughtful question. Be analytical and insightful, not just supportive."

        completion = client.chat.completions.create(
          model="meta-llama/llama-3-8b-instruct",
          messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": entry.text},
          ],
        )
        response_text = completion.choices[0].message.content
        return {"agent": "guide", "response": response_text}
    except Exception as e:
        # Return an error message if something goes wrong
        return {"error": str(e)}