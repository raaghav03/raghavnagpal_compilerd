# Kalvium Online Assignment Submission by Raghav Nagpal

## Project Overview

This project aims to create a user-friendly interface for running code with syntax highlighting and placeholders for multiple languages.

### Technologies Used

- **Frontend:** Created using `create-react-app` with TypeScript.
- **Libraries:**
  - `shadcn` for ready-made components.
  - `react` for building components.
  - `tailwind` for responsive styling.
  - `axios` for making API requests.
  - `prism` for syntax highlighting across different languages.
  - `lucide` for icons.

### Features

- **Syntax Highlighting:** Utilizes Prism for clear code visualization.
- **Language Placeholder:** Provides guidance with placeholders for each supported language.
- **User-Friendly UI:** Designed for ease of use and navigation.

## Assignment Experience

This assignment was both enjoyable and challenging. I am eager to contribute more to the Kalvium team and explore further opportunities together.

## How to Run

To run this project locally, follow these steps:

1. Clone the repository `git clone <web-url>`
2. `npm install`
3. Build docker image : `docker build -t <tag> .`
4. Run the docker container with the built image : `docker run -p 3000:3000 -e OPENAI_API_KEY=<your-api-key> -e ALLOWED_RAM=<allowed-ram-value> <image-name>`
5. Open a web browser and navigate to `http://localhost:3000` to access the user interface for running your code.
