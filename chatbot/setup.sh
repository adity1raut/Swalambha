#!/bin/bash

echo "=== Setting up RAG Chatbot Environment ==="

# Remove old environment
echo "Removing old environment..."
rm -rf env

# Create new virtual environment
echo "Creating new virtual environment with Python 3.12.3..."
python3.12 -m venv env

# Activate environment
echo "Activating environment..."
source env/bin/activate

# Upgrade pip
echo "Upgrading pip..."
pip install --upgrade pip

# Install requirements
echo "Installing dependencies..."
pip install -r requirements.txt

echo "=== Setup Complete ==="
echo "To activate the environment, run: source env/bin/activate"
echo "To start the server, run: uvicorn Geminy:app --host 0.0.0.0 --port 8000 --reload"