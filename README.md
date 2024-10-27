## Project File Summary

This project is a full-stack web application for an AI-powered cover letter generator built with React, Express, and MongoDB, utilizing the OpenAI GPT-3.5 language model for enhanced content creation. The app includes a robust front-end built with Material-UI for UI components and Draft.js for rich text editing. 

### Project Inputs

- User input: Users provide prompts and information to guide the AI in generating cover letter content.
- Job details: Users input specific details about the job they're applying for, which the AI incorporates into the cover letter.
- User profile: Information such as work history, skills, and contact details is stored and used by the AI to personalize cover letters.
- Template selections: Users can choose from various templates to structure their cover letters.

### Project Outputs

- Personalized cover letters: The application generates cover letters tailored to the user's input and chosen template.
- Multiple draft management: Users can create, save, and manage multiple drafts of their cover letters.
- Persistent data storage: User data is stored persistently in MongoDB, ensuring access to previous drafts and profile information.
- API Integration: Leverages OpenAI's GPT-3.5 API to dynamically generate cover letter content. 
- Rich text formatting: Enables users to format their cover letters using Draft.js's rich text editing capabilities.
- User-friendly interface: Provides a user-friendly interface for seamless cover letter creation. 
- Automated comment insertion: Utilizes a custom script to automate the insertion of 'gut feeling' comments into the generated cover letters, offering a more personalized touch.
